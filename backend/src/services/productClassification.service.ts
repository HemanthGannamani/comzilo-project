/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { ProductRepository } from '../repositories/product.repository';
import { CategoryRepository } from '../repositories/category.repository';
import { BrandRepository } from '../repositories/brand.repository';
import { CollectionRepository } from '../repositories/collection.repository';
import { TagRepository } from '../repositories/tag.repository';
import { ProductCategoryRepository } from '../repositories/productCategory.repository';
import { ProductCollectionRepository } from '../repositories/productCollection.repository';
import { ProductTagRepository } from '../repositories/productTag.repository';
import { NotFoundError, ValidationError } from '../shared/errors/AppError';
import { sequelize } from '../config/database';
import { Category } from '../database/models/category';
import { Brand } from '../database/models/brand';
import { Collection } from '../database/models/collection';
import { Tag } from '../database/models/tag';

export class ProductClassificationService {
  private productRepo: ProductRepository;
  private categoryRepo: CategoryRepository;
  private brandRepo: BrandRepository;
  private collectionRepo: CollectionRepository;
  private tagRepo: TagRepository;
  private productCategoryRepo: ProductCategoryRepository;
  private productCollectionRepo: ProductCollectionRepository;
  private productTagRepo: ProductTagRepository;

  constructor() {
    this.productRepo = new ProductRepository();
    this.categoryRepo = new CategoryRepository();
    this.brandRepo = new BrandRepository();
    this.collectionRepo = new CollectionRepository();
    this.tagRepo = new TagRepository();
    this.productCategoryRepo = new ProductCategoryRepository();
    this.productCollectionRepo = new ProductCollectionRepository();
    this.productTagRepo = new ProductTagRepository();
  }

  public async getClassification(
    tenantId: number,
    storeId: number,
    productId: number
  ): Promise<any> {
    const product = await this.productRepo.findOne(tenantId, {
      where: { id: productId, storeId },
      include: [
        {
          model: Category,
          as: 'categories',
          through: { attributes: ['isPrimary', 'sortOrder'] },
        },
        {
          model: Brand,
          as: 'brandRecord',
        },
        {
          model: Collection,
          as: 'collections',
          through: { attributes: ['sortOrder'] },
        },
        {
          model: Tag,
          as: 'tags',
        },
      ],
    });

    if (!product) {
      throw new NotFoundError('Product not found.');
    }

    return {
      categories: product.categories || [],
      brand: product.brandRecord || null,
      collections: product.collections || [],
      tags: product.tags || [],
    };
  }

  public async replaceCategories(
    tenantId: number,
    storeId: number,
    productId: number,
    categoryIds: number[],
    primaryCategoryId: number | null
  ): Promise<void> {
    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found.');

    if (categoryIds.length > 0) {
      const categories = await this.categoryRepo.findScopedMany(tenantId, storeId, {
        where: { id: categoryIds },
      });
      if (categories.length !== categoryIds.length) {
        throw new NotFoundError('One or more categories not found.');
      }
    }

    if (primaryCategoryId !== null && !categoryIds.includes(primaryCategoryId)) {
      throw new ValidationError('Primary category must be one of the assigned categories.');
    }

    await sequelize.transaction(async (_t) => {
      // Clear current
      await this.productCategoryRepo.deleteScoped(tenantId, storeId, { productId });

      // Create new junctions
      if (categoryIds.length > 0) {
        const data = categoryIds.map((catId, index) => {
          let isPrimary = false;
          if (primaryCategoryId !== null) {
            isPrimary = catId === primaryCategoryId;
          } else if (categoryIds.length === 1) {
            isPrimary = true; // Auto-assign primary if only one category
          }
          return {
            productId,
            categoryId: catId,
            isPrimary,
            sortOrder: index,
          };
        });
        await this.productCategoryRepo.bulkCreateScoped(tenantId, storeId, data);
      }
    });
  }

  public async assignPrimaryCategory(
    tenantId: number,
    storeId: number,
    productId: number,
    categoryId: number
  ): Promise<void> {
    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found.');

    const junction = await this.productCategoryRepo.findScopedOne(tenantId, storeId, {
      where: { productId, categoryId },
    });
    if (!junction) {
      throw new ValidationError('Category is not associated with this product.');
    }

    await sequelize.transaction(async (t) => {
      // Set all categories for this product to non-primary
      await this.productCategoryRepo.dbModel.update(
        { isPrimary: false },
        { where: { tenant_id: tenantId, store_id: storeId, product_id: productId }, transaction: t }
      );
      // Set the target category as primary
      await this.productCategoryRepo.dbModel.update(
        { isPrimary: true },
        {
          where: {
            tenant_id: tenantId,
            store_id: storeId,
            product_id: productId,
            category_id: categoryId,
          },
          transaction: t,
        }
      );
    });
  }

  public async assignBrand(
    tenantId: number,
    storeId: number,
    productId: number,
    brandId: number | null
  ): Promise<void> {
    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found.');

    if (brandId !== null) {
      const brand = await this.brandRepo.findScopedById(tenantId, storeId, brandId);
      if (!brand) throw new NotFoundError('Brand not found.');
    }

    await this.productRepo.update(tenantId, productId, { brandId });
  }

  public async replaceCollections(
    tenantId: number,
    storeId: number,
    productId: number,
    collectionIds: number[]
  ): Promise<void> {
    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found.');

    if (collectionIds.length > 0) {
      const collections = await this.collectionRepo.findScopedMany(tenantId, storeId, {
        where: { id: collectionIds },
      });
      if (collections.length !== collectionIds.length) {
        throw new NotFoundError('One or more collections not found.');
      }
    }

    await sequelize.transaction(async (_t) => {
      await this.productCollectionRepo.deleteScoped(tenantId, storeId, { productId });

      if (collectionIds.length > 0) {
        const data = collectionIds.map((collId, index) => ({
          productId,
          collectionId: collId,
          sortOrder: index,
        }));
        await this.productCollectionRepo.bulkCreateScoped(tenantId, storeId, data);
      }
    });
  }

  public async replaceTags(
    tenantId: number,
    storeId: number,
    productId: number,
    tagIds: number[]
  ): Promise<void> {
    const product = await this.productRepo.findOne(tenantId, { where: { id: productId, storeId } });
    if (!product) throw new NotFoundError('Product not found.');

    if (tagIds.length > 0) {
      const tags = await this.tagRepo.findScopedMany(tenantId, storeId, {
        where: { id: tagIds },
      });
      if (tags.length !== tagIds.length) {
        throw new NotFoundError('One or more tags not found.');
      }
    }

    await sequelize.transaction(async (_t) => {
      await this.productTagRepo.deleteScoped(tenantId, storeId, { productId });

      if (tagIds.length > 0) {
        const data = tagIds.map((tagId) => ({
          productId,
          tagId,
        }));
        await this.productTagRepo.bulkCreateScoped(tenantId, storeId, data);
      }
    });
  }
}
