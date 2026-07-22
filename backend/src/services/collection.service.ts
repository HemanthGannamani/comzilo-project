/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { CollectionRepository } from '../repositories/collection.repository';
import { ProductCollectionRepository } from '../repositories/productCollection.repository';
import { ProductRepository } from '../repositories/product.repository';
import { MediaRepository } from '../repositories/media.repository';
import { Collection } from '../database/models/collection';
import { Product } from '../database/models/product';
import { Media } from '../database/models/media';
import { ProductCollection } from '../database/models/productCollection';
import { NotFoundError, ConflictError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { SlugService } from './slug.service';
import { Op } from 'sequelize';

export class CollectionService {
  private collectionRepo: CollectionRepository;
  private productCollectionRepo: ProductCollectionRepository;
  private productRepo: ProductRepository;
  private mediaRepo: MediaRepository;
  private slugService: SlugService;

  constructor() {
    this.collectionRepo = new CollectionRepository();
    this.productCollectionRepo = new ProductCollectionRepository();
    this.productRepo = new ProductRepository();
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

  public async createCollection(
    tenantId: number,
    storeId: number,
    userId: number,
    data: any
  ): Promise<Collection> {
    await this.validateMedia(tenantId, data.imageMediaId);

    let slug = data.slug;
    if (!slug) {
      slug = await this.slugService.generateUniqueSlug(
        Collection as any,
        data.name,
        tenantId,
        storeId
      );
    } else {
      slug = this.slugService.normalise(slug);
      const existing = await this.collectionRepo.findScopedOne(tenantId, storeId, {
        where: { slug },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Collection with slug '${slug}' already exists.`);
      }
    }

    return this.collectionRepo.createScoped(tenantId, storeId, {
      ...data,
      slug,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  public async updateCollection(
    tenantId: number,
    storeId: number,
    collectionId: number,
    userId: number,
    data: any
  ): Promise<Collection> {
    const collection = await this.collectionRepo.findScopedById(tenantId, storeId, collectionId);
    if (!collection) {
      throw new NotFoundError('Collection not found.');
    }

    if (data.imageMediaId !== undefined) {
      await this.validateMedia(tenantId, data.imageMediaId);
    }

    let slug = data.slug;
    if (slug && slug !== collection.slug) {
      slug = this.slugService.normalise(slug);
      const existing = await this.collectionRepo.findScopedOne(tenantId, storeId, {
        where: { slug, id: { [Op.ne]: collectionId } },
        paranoid: false,
      });
      if (existing) {
        throw new ConflictError(`Collection with slug '${slug}' already exists.`);
      }
      data.slug = slug;
    } else if (data.name && data.name !== collection.name && !slug) {
      data.slug = await this.slugService.generateUniqueSlug(
        Collection as any,
        data.name,
        tenantId,
        storeId
      );
    }

    await this.collectionRepo.updateScoped(tenantId, storeId, collectionId, {
      ...data,
      updatedBy: userId,
    });

    return this.getCollection(tenantId, storeId, collectionId);
  }

  public async getCollection(
    tenantId: number,
    storeId: number,
    collectionId: number
  ): Promise<Collection> {
    const collection = await this.collectionRepo.findScopedOne(tenantId, storeId, {
      where: { id: collectionId },
      include: [{ model: Media, as: 'image' }],
    });
    if (!collection) {
      throw new NotFoundError('Collection not found.');
    }
    return collection;
  }

  public async listCollections(
    tenantId: number,
    storeId: number,
    filters: any = {}
  ): Promise<{ rows: Collection[]; count: number }> {
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

    return this.collectionRepo.findAndCountAllScoped(tenantId, storeId, {
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

  public async deleteCollection(
    tenantId: number,
    storeId: number,
    collectionId: number,
    userId: number
  ): Promise<void> {
    const collection = await this.collectionRepo.findScopedById(tenantId, storeId, collectionId);
    if (!collection) {
      throw new NotFoundError('Collection not found.');
    }

    await sequelize.transaction(async (_t) => {
      await this.collectionRepo.updateScoped(tenantId, storeId, collectionId, {
        updatedBy: userId,
      });
      await this.collectionRepo.deleteScoped(tenantId, storeId, collectionId);
    });
  }

  public async restoreCollection(
    tenantId: number,
    storeId: number,
    collectionId: number,
    userId: number
  ): Promise<Collection> {
    const restored = await this.collectionRepo.restoreScoped(tenantId, storeId, collectionId);
    if (!restored) {
      throw new NotFoundError('Collection not found or not deleted.');
    }
    await this.collectionRepo.updateScoped(tenantId, storeId, collectionId, { updatedBy: userId });
    return this.getCollection(tenantId, storeId, collectionId);
  }

  // --- COLLECTION PRODUCTS MANAGEMENT ---

  public async addProductToCollection(
    tenantId: number,
    storeId: number,
    collectionId: number,
    productId: number,
    sortOrder?: number
  ): Promise<void> {
    const collection = await this.collectionRepo.findScopedById(tenantId, storeId, collectionId);
    if (!collection) throw new NotFoundError('Collection not found.');

    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found in this store.');

    const existing = await this.productCollectionRepo.findScopedOne(tenantId, storeId, {
      where: { collectionId, productId },
    });
    if (existing) {
      throw new ConflictError('Product is already in this collection.');
    }

    await this.productCollectionRepo.createScoped(tenantId, storeId, {
      collectionId,
      productId,
      sortOrder: sortOrder !== undefined ? sortOrder : 0,
    });
  }

  public async removeProductFromCollection(
    tenantId: number,
    storeId: number,
    collectionId: number,
    productId: number
  ): Promise<void> {
    const collection = await this.collectionRepo.findScopedById(tenantId, storeId, collectionId);
    if (!collection) throw new NotFoundError('Collection not found.');

    const deleted = await this.productCollectionRepo.deleteScoped(tenantId, storeId, {
      collectionId,
      productId,
    });
    if (deleted === 0) {
      throw new NotFoundError('Product is not in this collection.');
    }
  }

  public async replaceProductsInCollection(
    tenantId: number,
    storeId: number,
    collectionId: number,
    productIds: number[]
  ): Promise<void> {
    const collection = await this.collectionRepo.findScopedById(tenantId, storeId, collectionId);
    if (!collection) throw new NotFoundError('Collection not found.');

    // Validate all products exist in this store
    if (productIds.length > 0) {
      const products = await this.productRepo.findMany(tenantId, {
        where: { id: productIds, storeId },
      });
      if (products.length !== productIds.length) {
        throw new NotFoundError('One or more products were not found in this store.');
      }
    }

    await sequelize.transaction(async (_t) => {
      // Clear current
      await this.productCollectionRepo.deleteScoped(tenantId, storeId, { collectionId });

      // Create new junctions
      if (productIds.length > 0) {
        const data = productIds.map((id, index) => ({
          collectionId,
          productId: id,
          sortOrder: index,
        }));
        await this.productCollectionRepo.bulkCreateScoped(tenantId, storeId, data);
      }
    });
  }

  public async reorderProductsInCollection(
    tenantId: number,
    storeId: number,
    collectionId: number,
    orderedProductIds: number[]
  ): Promise<void> {
    const collection = await this.collectionRepo.findScopedById(tenantId, storeId, collectionId);
    if (!collection) throw new NotFoundError('Collection not found.');

    await sequelize.transaction(async (t) => {
      for (let i = 0; i < orderedProductIds.length; i++) {
        const pId = orderedProductIds[i];
        await this.productCollectionRepo.dbModel.update(
          { sortOrder: i },
          {
            where: {
              tenant_id: tenantId,
              store_id: storeId,
              collection_id: collectionId,
              product_id: pId,
            },
            transaction: t,
          }
        );
      }
    });
  }

  public async listCollectionProducts(
    tenantId: number,
    storeId: number,
    collectionId: number,
    filters: any = {}
  ): Promise<{ rows: Product[]; count: number }> {
    const collection = await this.collectionRepo.findScopedById(tenantId, storeId, collectionId);
    if (!collection) throw new NotFoundError('Collection not found.');

    const { page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const queryOptions: any = {
      where: { storeId },
      include: [
        {
          model: Collection,
          as: 'collections',
          where: { id: collectionId },
          through: { attributes: ['sortOrder'] },
        },
      ],
      limit,
      offset,
      order: [[{ model: Collection, as: 'collections' }, ProductCollection, 'sort_order', 'ASC']],
    };

    return this.productRepo.findAndCountAll(tenantId, queryOptions);
  }
}
