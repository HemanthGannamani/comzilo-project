/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { TagRepository } from '../repositories/tag.repository';
import { ProductTagRepository } from '../repositories/productTag.repository';
import { ProductRepository } from '../repositories/product.repository';
import { Tag } from '../database/models/tag';
import { NotFoundError, ConflictError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { SlugService } from './slug.service';
import { Op } from 'sequelize';

export class TagService {
  private tagRepo: TagRepository;
  private productTagRepo: ProductTagRepository;
  private productRepo: ProductRepository;
  private slugService: SlugService;

  constructor() {
    this.tagRepo = new TagRepository();
    this.productTagRepo = new ProductTagRepository();
    this.productRepo = new ProductRepository();
    this.slugService = new SlugService(sequelize);
  }

  public async createTag(
    tenantId: number,
    storeId: number,
    userId: number,
    data: any
  ): Promise<Tag> {
    let slug = data.slug;
    if (!slug) {
      slug = await this.slugService.generateUniqueSlug(Tag as any, data.name, tenantId, storeId);
    } else {
      slug = this.slugService.normalise(slug);
      const existing = await this.tagRepo.findScopedOne(tenantId, storeId, {
        where: { slug },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Tag with slug '${slug}' already exists.`);
      }
    }

    return this.tagRepo.createScoped(tenantId, storeId, {
      ...data,
      slug,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async updateTag(
    tenantId: number,
    storeId: number,
    tagId: number,
    userId: number,
    data: any
  ): Promise<Tag> {
    const tag = await this.tagRepo.findScopedById(tenantId, storeId, tagId);
    if (!tag) {
      throw new NotFoundError('Tag not found.');
    }

    let slug = data.slug;
    if (slug && slug !== tag.slug) {
      slug = this.slugService.normalise(slug);
      const existing = await this.tagRepo.findScopedOne(tenantId, storeId, {
        where: { slug, id: { [Op.ne]: tagId } },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Tag with slug '${slug}' already exists.`);
      }
      data.slug = slug;
    } else if (data.name && data.name !== tag.name && !slug) {
      data.slug = await this.slugService.generateUniqueSlug(
        Tag as any,
        data.name,
        tenantId,
        storeId
      );
    }

    await this.tagRepo.updateScoped(tenantId, storeId, tagId, {
      ...data,
      updatedBy: userId,
    });

    return this.getTag(tenantId, storeId, tagId);
  }

  public async getTag(tenantId: number, storeId: number, tagId: number): Promise<Tag> {
    const tag = await this.tagRepo.findScopedById(tenantId, storeId, tagId);
    if (!tag) {
      throw new NotFoundError('Tag not found.');
    }
    return tag;
  }

  public async listTags(
    tenantId: number,
    storeId: number,
    filters: any = {}
  ): Promise<{ rows: Tag[]; count: number }> {
    const { page = 1, limit = 10, search } = filters;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    return this.tagRepo.findAndCountAllScoped(tenantId, storeId, {
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });
  }

  public async deleteTag(
    tenantId: number,
    storeId: number,
    tagId: number,
    userId: number
  ): Promise<void> {
    const tag = await this.tagRepo.findScopedById(tenantId, storeId, tagId);
    if (!tag) {
      throw new NotFoundError('Tag not found.');
    }

    await sequelize.transaction(async (_t) => {
      await this.tagRepo.updateScoped(tenantId, storeId, tagId, { updatedBy: userId });
      await this.tagRepo.deleteScoped(tenantId, storeId, tagId);
    });
  }

  public async restoreTag(
    tenantId: number,
    storeId: number,
    tagId: number,
    userId: number
  ): Promise<Tag> {
    const restored = await this.tagRepo.restoreScoped(tenantId, storeId, tagId);
    if (!restored) {
      throw new NotFoundError('Tag not found or not deleted.');
    }
    await this.tagRepo.updateScoped(tenantId, storeId, tagId, { updatedBy: userId });
    return this.getTag(tenantId, storeId, tagId);
  }

  // --- PRODUCT TAGS ASSIGNMENT ---

  public async assignTagsToProduct(
    tenantId: number,
    storeId: number,
    productId: number,
    tagIds: number[]
  ): Promise<void> {
    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found.');

    const tags = await this.tagRepo.findScopedMany(tenantId, storeId, { where: { id: tagIds } });
    if (tags.length !== tagIds.length) {
      throw new NotFoundError('One or more tags not found.');
    }

    await sequelize.transaction(async (_t) => {
      for (const tagId of tagIds) {
        const existing = await this.productTagRepo.findScopedOne(tenantId, storeId, {
          where: { productId, tagId },
        });
        if (!existing) {
          await this.productTagRepo.createScoped(tenantId, storeId, { productId, tagId });
        }
      }
    });
  }

  public async removeTagsFromProduct(
    tenantId: number,
    storeId: number,
    productId: number,
    tagIds: number[]
  ): Promise<void> {
    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found.');

    await this.productTagRepo.deleteScoped(tenantId, storeId, {
      productId,
      tagId: tagIds,
    });
  }

  public async replaceProductTags(
    tenantId: number,
    storeId: number,
    productId: number,
    tagIds: number[]
  ): Promise<void> {
    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found.');

    if (tagIds.length > 0) {
      const tags = await this.tagRepo.findScopedMany(tenantId, storeId, { where: { id: tagIds } });
      if (tags.length !== tagIds.length) {
        throw new NotFoundError('One or more tags not found.');
      }
    }

    await sequelize.transaction(async (_t) => {
      await this.productTagRepo.deleteScoped(tenantId, storeId, { productId });

      if (tagIds.length > 0) {
        const data = tagIds.map((tagId) => ({ productId, tagId }));
        await this.productTagRepo.bulkCreateScoped(tenantId, storeId, data);
      }
    });
  }
}
