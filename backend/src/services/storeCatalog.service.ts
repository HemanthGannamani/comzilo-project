/* eslint-disable @typescript-eslint/no-explicit-any */
import { sequelize } from '../config/database';
import {
  Category,
  CategorySeo,
  Brand,
  BrandSeo,
  Tag,
  Collection,
  CollectionRule,
  ProductAttribute,
  ProductAttributeValue,
} from '../database/models';
import { Op } from 'sequelize';
import { logger } from '../shared/logging/logger';
import { createAuditLog } from '../utils/auditHelper';

export class StoreCatalogService {
  // ================= CATEGORIES =================
  static async getCategoriesTree(tenantId: number, storeId: number) {
    const categories = await Category.findAll({
      where: { tenantId, storeId },
      include: [{ model: CategorySeo, as: 'seoRecord' }],
      order: [
        ['sort_order', 'ASC'],
        ['id', 'ASC'],
      ],
    });

    const categoryMap: Record<number, any> = {};
    const tree: any[] = [];

    categories.forEach((cat) => {
      categoryMap[cat.id] = { ...cat.toJSON(), children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parentId && categoryMap[cat.parentId]) {
        categoryMap[cat.parentId].children.push(categoryMap[cat.id]);
      } else {
        tree.push(categoryMap[cat.id]);
      }
    });

    return tree;
  }

  static async createCategory(tenantId: number, storeId: number, userId: number, payload: any) {
    const transaction = await sequelize.transaction();
    try {
      let slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const existing = await Category.findOne({ where: { tenantId, storeId, slug }, transaction });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const category = await Category.create(
        {
          tenantId,
          storeId,
          parentId: payload.parentId || null,
          name: payload.name,
          slug,
          description: payload.description || null,
          status: payload.status || 'active',
          visibility: payload.visibility || 'public',
          sortOrder: payload.sortOrder || 0,
          createdBy: userId,
          updatedBy: userId,
        } as any,
        { transaction }
      );

      if (payload.seo) {
        await CategorySeo.create(
          {
            categoryId: category.id,
            metaTitle: payload.seo.metaTitle || null,
            metaDescription: payload.seo.metaDescription || null,
            metaKeywords: payload.seo.metaKeywords || null,
            ogImage: payload.seo.ogImage || null,
            canonicalUrl: payload.seo.canonicalUrl || null,
          },
          { transaction }
        );
      }

      await transaction.commit();

      await createAuditLog({
        tenantId,
        actorId: userId,
        action: 'category.created',
        entityType: 'Category',
        entityId: String(category.id),
      });

      return category;
    } catch (error: any) {
      await transaction.rollback();
      logger.error(`[StoreCatalogService] createCategory error: ${error.message}`);
      throw error;
    }
  }

  static async deleteCategory(tenantId: number, storeId: number, userId: number, id: number) {
    const category = await Category.findOne({ where: { id, tenantId, storeId } });
    if (!category) throw new Error('Category not found');

    await category.destroy();
    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'category.deleted',
      entityType: 'Category',
      entityId: String(id),
    });
    return true;
  }

  // ================= BRANDS =================
  static async getBrands(tenantId: number, storeId: number, query: any) {
    const page = parseInt(query.page || '0', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = page * limit;

    const where: any = { tenantId, storeId };
    if (query.search) {
      where.name = { [Op.like]: `%${query.search}%` };
    }

    const { rows, count } = await Brand.findAndCountAll({
      where,
      include: [{ model: BrandSeo, as: 'seoRecord' }],
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return { brands: rows, total: count, page, limit };
  }

  static async createBrand(tenantId: number, storeId: number, userId: number, payload: any) {
    const transaction = await sequelize.transaction();
    try {
      let slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const existing = await Brand.findOne({ where: { tenantId, storeId, slug }, transaction });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const brand = await Brand.create(
        {
          tenantId,
          storeId,
          name: payload.name,
          slug,
          description: payload.description || null,
          status: payload.status || 'active',
          website: payload.website || null,
          createdBy: userId,
          updatedBy: userId,
        } as any,
        { transaction }
      );

      if (payload.seo) {
        await BrandSeo.create(
          {
            brandId: brand.id,
            metaTitle: payload.seo.metaTitle || null,
            metaDescription: payload.seo.metaDescription || null,
            metaKeywords: payload.seo.metaKeywords || null,
            ogImage: payload.seo.ogImage || null,
            canonicalUrl: payload.seo.canonicalUrl || null,
          },
          { transaction }
        );
      }

      await transaction.commit();

      await createAuditLog({
        tenantId,
        actorId: userId,
        action: 'brand.created',
        entityType: 'Brand',
        entityId: String(brand.id),
      });

      return brand;
    } catch (error: any) {
      await transaction.rollback();
      logger.error(`[StoreCatalogService] createBrand error: ${error.message}`);
      throw error;
    }
  }

  // ================= TAGS =================
  static async getTags(tenantId: number, storeId: number, query: any) {
    const where: any = { tenantId, storeId };
    if (query.search) {
      where.name = { [Op.like]: `%${query.search}%` };
    }

    const tags = await Tag.findAll({ where, order: [['id', 'DESC']] });
    return tags;
  }

  static async createTag(tenantId: number, storeId: number, userId: number, payload: any) {
    let slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = await Tag.findOne({ where: { tenantId, storeId, slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const tag = await Tag.create({
      tenantId,
      storeId,
      name: payload.name,
      slug,
    } as any);

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'tag.created',
      entityType: 'Tag',
      entityId: String(tag.id),
    });

    return tag;
  }

  // ================= COLLECTIONS =================
  static async getCollections(tenantId: number, storeId: number, _query: any) {
    const collections = await Collection.findAll({
      where: { tenantId, storeId },
      include: [{ model: CollectionRule, as: 'rules' }],
      order: [['id', 'DESC']],
    });
    return collections;
  }

  static async createCollection(tenantId: number, storeId: number, userId: number, payload: any) {
    const transaction = await sequelize.transaction();
    try {
      let slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const existing = await Collection.findOne({
        where: { tenantId, storeId, slug },
        transaction,
      });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const collection = await Collection.create(
        {
          tenantId,
          storeId,
          name: payload.name,
          slug,
          description: payload.description || null,
          status: payload.status || 'active',
          createdBy: userId,
          updatedBy: userId,
        } as any,
        { transaction }
      );

      if (payload.rules && Array.isArray(payload.rules)) {
        for (const rule of payload.rules) {
          await CollectionRule.create(
            {
              collectionId: collection.id,
              field: rule.field,
              operator: rule.operator,
              value: rule.value,
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      await createAuditLog({
        tenantId,
        actorId: userId,
        action: 'collection.created',
        entityType: 'Collection',
        entityId: String(collection.id),
      });

      return collection;
    } catch (error: any) {
      await transaction.rollback();
      logger.error(`[StoreCatalogService] createCollection error: ${error.message}`);
      throw error;
    }
  }

  // ================= ATTRIBUTES =================
  static async getAttributes(tenantId: number, storeId: number) {
    const attributes = await ProductAttribute.findAll({
      where: { tenantId, storeId },
      include: [{ model: ProductAttributeValue, as: 'values' }],
      order: [['id', 'DESC']],
    });
    return attributes;
  }

  static async createAttribute(tenantId: number, storeId: number, userId: number, payload: any) {
    const transaction = await sequelize.transaction();
    try {
      const attribute = await ProductAttribute.create(
        {
          tenantId,
          storeId,
          name: payload.name,
          code: payload.code || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          type: payload.type || 'dropdown',
          isRequired: payload.isRequired || false,
          isFilterable: payload.isFilterable || true,
          isSearchable: payload.isSearchable || true,
          isComparable: payload.isComparable || false,
          sortOrder: payload.sortOrder || 0,
        },
        { transaction }
      );

      if (payload.values && Array.isArray(payload.values)) {
        for (const val of payload.values) {
          await ProductAttributeValue.create(
            {
              attributeId: attribute.id,
              value: typeof val === 'string' ? val : val.value,
              label: typeof val === 'object' ? val.label : null,
              swatchData: typeof val === 'object' ? val.swatchData : null,
              sortOrder: typeof val === 'object' ? val.sortOrder || 0 : 0,
              status: typeof val === 'object' ? val.status || 'active' : 'active',
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      await createAuditLog({
        tenantId,
        actorId: userId,
        action: 'attribute.created',
        entityType: 'ProductAttribute',
        entityId: String(attribute.id),
      });

      return attribute;
    } catch (error: any) {
      await transaction.rollback();
      logger.error(`[StoreCatalogService] createAttribute error: ${error.message}`);
      throw error;
    }
  }
}
