/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { CategoryRepository } from '../repositories/category.repository';
import { MediaRepository } from '../repositories/media.repository';
import { Category } from '../database/models/category';
import { Media } from '../database/models/media';
import { NotFoundError, ConflictError, ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { SlugService } from './slug.service';
import { Op } from 'sequelize';

export class CategoryService {
  private categoryRepo: CategoryRepository;
  private mediaRepo: MediaRepository;
  private slugService: SlugService;

  constructor() {
    this.categoryRepo = new CategoryRepository();
    this.mediaRepo = new MediaRepository();
    this.slugService = new SlugService(sequelize);
  }

  private async validateMedia(tenantId: number, mediaId: number | null): Promise<void> {
    if (!mediaId) return;
    const media = await this.mediaRepo.findOne(tenantId, { where: { id: mediaId } });
    if (!media) {
      throw new NotFoundError(`Media item with ID ${mediaId} not found.`);
    }
  }

  public async createCategory(
    tenantId: number,
    storeId: number,
    userId: number,
    data: any
  ): Promise<Category> {
    await this.validateMedia(tenantId, data.imageMediaId);

    // Validate parent exists if provided
    if (data.parentId) {
      const parent = await this.categoryRepo.findScopedById(tenantId, storeId, data.parentId);
      if (!parent) {
        throw new NotFoundError(`Parent category with ID ${data.parentId} not found.`);
      }
    }

    let slug = data.slug;
    if (!slug) {
      slug = await this.slugService.generateUniqueSlug(
        Category as any,
        data.name,
        tenantId,
        storeId
      );
    } else {
      slug = this.slugService.normalise(slug);
      const existing = await this.categoryRepo.findScopedOne(tenantId, storeId, {
        where: { slug },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Category with slug '${slug}' already exists.`);
      }
    }

    return this.categoryRepo.createScoped(tenantId, storeId, {
      ...data,
      slug,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async updateCategory(
    tenantId: number,
    storeId: number,
    categoryId: number,
    userId: number,
    data: any
  ): Promise<Category> {
    const category = await this.categoryRepo.findScopedById(tenantId, storeId, categoryId);
    if (!category) {
      throw new NotFoundError('Category not found.');
    }

    if (data.imageMediaId !== undefined) {
      await this.validateMedia(tenantId, data.imageMediaId);
    }

    // Circular dependency and self-parent protection
    if (data.parentId !== undefined) {
      if (data.parentId === categoryId) {
        throw new ValidationError('Category cannot be its own parent.');
      }
      if (data.parentId !== null) {
        const parent = await this.categoryRepo.findScopedById(tenantId, storeId, data.parentId);
        if (!parent) {
          throw new NotFoundError(`Parent category with ID ${data.parentId} not found.`);
        }

        // Cycle check: load all and check
        const allCategories = await this.categoryRepo.findScopedMany(tenantId, storeId);
        const map = new Map<number, any>(allCategories.map((c) => [c.id, c]));
        if (this.detectCycle(data.parentId, categoryId, map)) {
          throw new ValidationError(
            'Circular dependency detected. Cannot set parent to a descendant.'
          );
        }
      }
    }

    let slug = data.slug;
    if (slug && slug !== category.slug) {
      slug = this.slugService.normalise(slug);
      const existing = await this.categoryRepo.findScopedOne(tenantId, storeId, {
        where: { slug, id: { [Op.ne]: categoryId } },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Category with slug '${slug}' already exists.`);
      }
      data.slug = slug;
    } else if (data.name && data.name !== category.name && !slug) {
      data.slug = await this.slugService.generateUniqueSlug(
        Category as any,
        data.name,
        tenantId,
        storeId
      );
    }

    await this.categoryRepo.updateScoped(tenantId, storeId, categoryId, {
      ...data,
      updatedBy: userId,
    });

    return this.getCategory(tenantId, storeId, categoryId);
  }

  public async getCategory(
    tenantId: number,
    storeId: number,
    categoryId: number
  ): Promise<Category> {
    const category = await this.categoryRepo.findScopedOne(tenantId, storeId, {
      where: { id: categoryId },
      include: [
        { model: Media, as: 'image' },
        { model: Category, as: 'parent' },
      ],
    });
    if (!category) {
      throw new NotFoundError('Category not found.');
    }
    return category;
  }

  public async listCategories(
    tenantId: number,
    storeId: number,
    filters: any = {}
  ): Promise<{ rows: Category[]; count: number }> {
    const { page = 1, limit = 10, search, status, visibility, parentId } = filters;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;
    if (parentId !== undefined) where.parentId = parentId;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    return this.categoryRepo.findAndCountAllScoped(tenantId, storeId, {
      where,
      limit,
      offset,
      order: [
        ['sortOrder', 'ASC'],
        ['createdAt', 'DESC'],
      ],
      include: [{ model: Media, as: 'image' }],
    });
  }

  public async deleteCategory(
    tenantId: number,
    storeId: number,
    categoryId: number,
    userId: number
  ): Promise<void> {
    const category = await this.categoryRepo.findScopedById(tenantId, storeId, categoryId);
    if (!category) {
      throw new NotFoundError('Category not found.');
    }

    // Check if category has active children
    const child = await this.categoryRepo.findScopedOne(tenantId, storeId, {
      where: { parentId: categoryId },
    });
    if (child) {
      throw new ValidationError(
        'Cannot delete category that has subcategories. Move or delete them first.'
      );
    }

    await sequelize.transaction(async (_t) => {
      await this.categoryRepo.updateScoped(tenantId, storeId, categoryId, { updatedBy: userId });
      await this.categoryRepo.deleteScoped(tenantId, storeId, categoryId);
    });
  }

  public async restoreCategory(
    tenantId: number,
    storeId: number,
    categoryId: number,
    userId: number
  ): Promise<Category> {
    const restored = await this.categoryRepo.restoreScoped(tenantId, storeId, categoryId);
    if (!restored) {
      throw new NotFoundError('Category not found or not deleted.');
    }
    await this.categoryRepo.updateScoped(tenantId, storeId, categoryId, { updatedBy: userId });
    return this.getCategory(tenantId, storeId, categoryId);
  }

  public async moveCategory(
    tenantId: number,
    storeId: number,
    categoryId: number,
    parentId: number | null,
    userId: number
  ): Promise<Category> {
    return this.updateCategory(tenantId, storeId, categoryId, userId, { parentId });
  }

  public async reorderCategories(
    tenantId: number,
    storeId: number,
    orders: { id: number; sortOrder: number }[],
    userId: number
  ): Promise<void> {
    await sequelize.transaction(async (_t) => {
      for (const item of orders) {
        await this.categoryRepo.updateScoped(tenantId, storeId, item.id, {
          sortOrder: item.sortOrder,
          updatedBy: userId,
        });
      }
    });
  }

  // --- TREE CONSTRUCTION ---

  public detectCycle(
    parentId: number | null,
    currentId: number,
    categoriesMap: Map<number, any>
  ): boolean {
    let curr = parentId;
    const visited = new Set<number>([currentId]);
    while (curr !== null && curr !== undefined) {
      if (visited.has(curr)) {
        return true;
      }
      visited.add(curr);
      const parentObj = categoriesMap.get(curr);
      curr = parentObj ? parentObj.parentId : null;
    }
    return false;
  }

  public async getCategoryTree(tenantId: number, storeId: number): Promise<any[]> {
    // 1. Load all scoped categories in one query
    const categories = await this.categoryRepo.findScopedMany(tenantId, storeId, {
      order: [
        ['sortOrder', 'ASC'],
        ['id', 'ASC'],
      ],
      raw: true,
    });

    const categoriesMap = new Map<number, any>();
    for (const c of categories) {
      categoriesMap.set(c.id, { ...c, children: [] });
    }

    const roots: any[] = [];

    for (const c of categories) {
      const node = categoriesMap.get(c.id);
      if (c.parentId === null || c.parentId === undefined) {
        roots.push(node);
      } else {
        const parentNode = categoriesMap.get(c.parentId);
        if (parentNode) {
          // Circular prevention using path check
          if (!this.detectCycle(c.parentId, c.id, categoriesMap)) {
            parentNode.children.push(node);
          } else {
            // If cycle, treat as root to avoid orphan loss, but report cycle warning logic
            roots.push(node);
          }
        } else {
          // Parent not found, treat as root
          roots.push(node);
        }
      }
    }

    return roots;
  }
}
