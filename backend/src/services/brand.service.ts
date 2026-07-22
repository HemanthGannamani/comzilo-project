/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { BrandRepository } from '../repositories/brand.repository';
import { MediaRepository } from '../repositories/media.repository';
import { Brand } from '../database/models/brand';
import { Media } from '../database/models/media';
import { NotFoundError, ConflictError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { SlugService } from './slug.service';
import { Op } from 'sequelize';

export class BrandService {
  private brandRepo: BrandRepository;
  private mediaRepo: MediaRepository;
  private slugService: SlugService;

  constructor() {
    this.brandRepo = new BrandRepository();
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

  public async createBrand(
    tenantId: number,
    storeId: number,
    userId: number,
    data: any
  ): Promise<Brand> {
    await this.validateMedia(tenantId, data.logoMediaId);

    // Validate slug/name uniqueness
    let slug = data.slug;
    if (!slug) {
      slug = await this.slugService.generateUniqueSlug(Brand as any, data.name, tenantId, storeId);
    } else {
      slug = this.slugService.normalise(slug);
      const existing = await this.brandRepo.findScopedOne(tenantId, storeId, {
        where: { slug },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Brand with slug '${slug}' already exists.`);
      }
    }

    return this.brandRepo.createScoped(tenantId, storeId, {
      ...data,
      slug,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async updateBrand(
    tenantId: number,
    storeId: number,
    brandId: number,
    userId: number,
    data: any
  ): Promise<Brand> {
    const brand = await this.brandRepo.findScopedById(tenantId, storeId, brandId);
    if (!brand) {
      throw new NotFoundError('Brand not found.');
    }

    if (data.logoMediaId !== undefined) {
      await this.validateMedia(tenantId, data.logoMediaId);
    }

    let slug = data.slug;
    if (slug && slug !== brand.slug) {
      slug = this.slugService.normalise(slug);
      const existing = await this.brandRepo.findScopedOne(tenantId, storeId, {
        where: { slug, id: { [Op.ne]: brandId } },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Brand with slug '${slug}' already exists.`);
      }
      data.slug = slug;
    } else if (data.name && data.name !== brand.name && !slug) {
      data.slug = await this.slugService.generateUniqueSlug(
        Brand as any,
        data.name,
        tenantId,
        storeId
      );
    }

    await this.brandRepo.updateScoped(tenantId, storeId, brandId, {
      ...data,
      updatedBy: userId,
    });

    return (await this.brandRepo.findScopedById(tenantId, storeId, brandId))!;
  }

  public async getBrand(tenantId: number, storeId: number, brandId: number): Promise<Brand> {
    const brand = await this.brandRepo.findScopedOne(tenantId, storeId, {
      where: { id: brandId },
      include: [{ model: Media, as: 'logo' }],
    });
    if (!brand) {
      throw new NotFoundError('Brand not found.');
    }
    return brand;
  }

  public async listBrands(
    tenantId: number,
    storeId: number,
    filters: any = {}
  ): Promise<{ rows: Brand[]; count: number }> {
    const { page = 1, limit = 10, search, status, visibility } = filters;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (visibility) where.visibility = visibility;

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } },
      ];
    }

    return this.brandRepo.findAndCountAllScoped(tenantId, storeId, {
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: Media, as: 'logo' }],
    });
  }

  public async deleteBrand(
    tenantId: number,
    storeId: number,
    brandId: number,
    userId: number
  ): Promise<void> {
    const brand = await this.brandRepo.findScopedById(tenantId, storeId, brandId);
    if (!brand) {
      throw new NotFoundError('Brand not found.');
    }

    await sequelize.transaction(async (_t) => {
      await this.brandRepo.updateScoped(tenantId, storeId, brandId, { updatedBy: userId });
      await this.brandRepo.deleteScoped(tenantId, storeId, brandId);
    });
  }

  public async restoreBrand(
    tenantId: number,
    storeId: number,
    brandId: number,
    userId: number
  ): Promise<Brand> {
    const restored = await this.brandRepo.restoreScoped(tenantId, storeId, brandId);
    if (!restored) {
      throw new NotFoundError('Brand not found or not deleted.');
    }
    await this.brandRepo.updateScoped(tenantId, storeId, brandId, { updatedBy: userId });
    return this.getBrand(tenantId, storeId, brandId);
  }
}
