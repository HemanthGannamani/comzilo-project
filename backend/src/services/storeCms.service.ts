/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CmsTheme,
  CmsPage,
  CmsPageVersion,
  CmsSection,
  CmsNavigationMenu,
  CmsNavigationItem,
  CmsBlogPost,
  CmsMediaAsset,
  CmsForm,
  CmsFormSubmission,
} from '../database/models';
import { createAuditLog } from '../utils/auditHelper';

export class StoreCmsService {
  // ================= THEMES =================
  static async getThemes(tenantId: number, storeId: number) {
    const themes = await CmsTheme.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return themes;
  }

  static async createTheme(tenantId: number, storeId: number, userId: number, payload: any) {
    const theme = await CmsTheme.create({
      tenantId,
      storeId,
      name: payload.name,
      code: payload.code || payload.name.toLowerCase().replace(/\s+/g, '_'),
      isActive: payload.isActive || false,
      themeSettings: payload.themeSettings || { primaryColor: '#3f51b5', fontFamily: 'Roboto' },
      customCss: payload.customCss || null,
      customJs: payload.customJs || null,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'theme.created',
      entityType: 'CmsTheme',
      entityId: String(theme.id),
    });

    return theme;
  }

  static async activateTheme(tenantId: number, storeId: number, userId: number, id: number) {
    await CmsTheme.update({ isActive: false }, { where: { tenantId, storeId } });
    const theme = await CmsTheme.findOne({ where: { id, tenantId, storeId } });
    if (!theme) throw new Error('Theme not found');

    await theme.update({ isActive: true });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'theme.activated',
      entityType: 'CmsTheme',
      entityId: String(id),
    });

    return theme;
  }

  // ================= PAGES & PAGE BUILDER =================
  static async getPages(tenantId: number, storeId: number) {
    const pages = await CmsPage.findAll({
      where: { tenantId, storeId },
      include: [
        { model: CmsSection, as: 'sections' },
        { model: CmsPageVersion, as: 'versions' },
      ],
      order: [['id', 'DESC']],
    });
    return pages;
  }

  static async createPage(tenantId: number, storeId: number, userId: number, payload: any) {
    const page = await CmsPage.create({
      tenantId,
      storeId,
      title: payload.title,
      slug: payload.slug || payload.title.toLowerCase().replace(/\s+/g, '-'),
      template: payload.template || 'default',
      isHomepage: payload.isHomepage || false,
      status: 'draft',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'page.created',
      entityType: 'CmsPage',
      entityId: String(page.id),
    });

    return page;
  }

  static async addPageSection(tenantId: number, storeId: number, userId: number, payload: any) {
    const section = await CmsSection.create({
      tenantId,
      storeId,
      pageId: payload.pageId,
      sectionType: payload.sectionType || 'hero',
      sortOrder: payload.sortOrder || 0,
      settingsJson: payload.settingsJson || {},
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'page_section.added',
      entityType: 'CmsSection',
      entityId: String(section.id),
    });

    return section;
  }

  static async publishPage(tenantId: number, storeId: number, userId: number, id: number) {
    const page = await CmsPage.findOne({
      where: { id, tenantId, storeId },
      include: [{ model: CmsSection, as: 'sections' }],
    });
    if (!page) throw new Error('Page not found');

    const lastVer = await CmsPageVersion.findOne({
      where: { pageId: id },
      order: [['versionNumber', 'DESC']],
    });
    const nextVer = lastVer ? lastVer.versionNumber + 1 : 1;

    await CmsPageVersion.create({
      pageId: id,
      versionNumber: nextVer,
      sectionsJson: (page as any).sections || [],
      createdBy: userId,
    });

    await page.update({ status: 'published', publishedAt: new Date() });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'page.published',
      entityType: 'CmsPage',
      entityId: String(id),
    });

    return page;
  }

  // ================= NAVIGATION MENUS =================
  static async getNavigationMenus(tenantId: number, storeId: number) {
    const menus = await CmsNavigationMenu.findAll({
      where: { tenantId, storeId },
      include: [{ model: CmsNavigationItem, as: 'items' }],
      order: [['id', 'DESC']],
    });
    return menus;
  }

  static async createNavigationMenu(
    tenantId: number,
    storeId: number,
    userId: number,
    payload: any
  ) {
    const menu = await CmsNavigationMenu.create({
      tenantId,
      storeId,
      name: payload.name,
      location: payload.location || 'header',
      isMegaMenu: payload.isMegaMenu || false,
    });

    if (payload.items && Array.isArray(payload.items)) {
      for (const item of payload.items) {
        await CmsNavigationItem.create({
          menuId: menu.id,
          title: item.title,
          url: item.url,
          type: item.type || 'custom',
          sortOrder: item.sortOrder || 0,
        });
      }
    }

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'navigation_menu.created',
      entityType: 'CmsNavigationMenu',
      entityId: String(menu.id),
    });

    return menu;
  }

  // ================= BLOG POSTS =================
  static async getBlogPosts(tenantId: number, storeId: number) {
    const posts = await CmsBlogPost.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return posts;
  }

  static async createBlogPost(tenantId: number, storeId: number, userId: number, payload: any) {
    const post = await CmsBlogPost.create({
      tenantId,
      storeId,
      title: payload.title,
      slug: payload.slug || payload.title.toLowerCase().replace(/\s+/g, '-'),
      content: payload.content || 'Blog post content',
      featuredImage: payload.featuredImage || null,
      status: payload.status || 'published',
      publishedAt: new Date(),
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'blog_post.created',
      entityType: 'CmsBlogPost',
      entityId: String(post.id),
    });

    return post;
  }

  // ================= MEDIA ASSETS =================
  static async getMediaAssets(tenantId: number, storeId: number) {
    const assets = await CmsMediaAsset.findAll({
      where: { tenantId, storeId },
      order: [['id', 'DESC']],
    });
    return assets;
  }

  static async createMediaAsset(tenantId: number, storeId: number, userId: number, payload: any) {
    const asset = await CmsMediaAsset.create({
      tenantId,
      storeId,
      filename: payload.filename || 'banner.png',
      fileUrl: payload.fileUrl || 'https://assets.comzilo.com/media/banner.png',
      mimeType: payload.mimeType || 'image/png',
      fileSize: payload.fileSize || 102400,
      altText: payload.altText || null,
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'media_asset.uploaded',
      entityType: 'CmsMediaAsset',
      entityId: String(asset.id),
    });

    return asset;
  }

  // ================= FORMS & SUBMISSIONS =================
  static async getForms(tenantId: number, storeId: number) {
    const forms = await CmsForm.findAll({
      where: { tenantId, storeId },
      include: [{ model: CmsFormSubmission, as: 'submissions' }],
      order: [['id', 'DESC']],
    });
    return forms;
  }

  static async createForm(tenantId: number, storeId: number, userId: number, payload: any) {
    const form = await CmsForm.create({
      tenantId,
      storeId,
      name: payload.name,
      formFields: payload.formFields || [],
      status: 'active',
    });

    await createAuditLog({
      tenantId,
      actorId: userId,
      action: 'form.created',
      entityType: 'CmsForm',
      entityId: String(form.id),
    });

    return form;
  }

  static async submitForm(formId: number, payload: any) {
    const submission = await CmsFormSubmission.create({
      formId,
      submissionData: payload.submissionData || payload,
      submittedAt: new Date(),
    });

    return submission;
  }
}
