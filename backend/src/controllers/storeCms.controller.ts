/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { StoreCmsService } from '../services/storeCms.service';
import { success, badRequest, created } from '../shared/responses';
import { logger } from '../shared/logging/logger';

export class StoreCmsController {
  // THEMES
  static async getThemes(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const themes = await StoreCmsService.getThemes(tenantId, storeId);
      success(res, 'Themes retrieved successfully', themes);
    } catch (error: unknown) {
      const err = error as Error;
      logger.error(`[StoreCmsController] getThemes error: ${err.message}`);
      badRequest(res, err.message);
    }
  }

  static async createTheme(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const theme = await StoreCmsService.createTheme(tenantId, storeId, userId, req.body);
      created(res, 'Theme created successfully', theme);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async activateTheme(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const id = parseInt(req.params.id, 10);

      const theme = await StoreCmsService.activateTheme(tenantId, storeId, userId, id);
      success(res, 'Theme activated successfully', theme);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // PAGES & PAGE BUILDER
  static async getPages(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const pages = await StoreCmsService.getPages(tenantId, storeId);
      success(res, 'CMS pages retrieved successfully', pages);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createPage(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const page = await StoreCmsService.createPage(tenantId, storeId, userId, req.body);
      created(res, 'CMS page created successfully', page);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async addPageSection(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const section = await StoreCmsService.addPageSection(tenantId, storeId, userId, req.body);
      created(res, 'Page section added successfully', section);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async publishPage(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;
      const id = parseInt(req.params.id, 10);

      const page = await StoreCmsService.publishPage(tenantId, storeId, userId, id);
      success(res, 'Page published successfully', page);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // NAVIGATION MENUS
  static async getNavigationMenus(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const menus = await StoreCmsService.getNavigationMenus(tenantId, storeId);
      success(res, 'Navigation menus retrieved successfully', menus);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createNavigationMenu(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const menu = await StoreCmsService.createNavigationMenu(tenantId, storeId, userId, req.body);
      created(res, 'Navigation menu created successfully', menu);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // BLOG POSTS
  static async getBlogPosts(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const posts = await StoreCmsService.getBlogPosts(tenantId, storeId);
      success(res, 'Blog posts retrieved successfully', posts);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createBlogPost(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const post = await StoreCmsService.createBlogPost(tenantId, storeId, userId, req.body);
      created(res, 'Blog post created successfully', post);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // MEDIA ASSETS
  static async getMediaAssets(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const assets = await StoreCmsService.getMediaAssets(tenantId, storeId);
      success(res, 'Media assets retrieved successfully', assets);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createMediaAsset(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const asset = await StoreCmsService.createMediaAsset(tenantId, storeId, userId, req.body);
      created(res, 'Media asset registered successfully', asset);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  // FORMS & SUBMISSIONS
  static async getForms(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;

      const forms = await StoreCmsService.getForms(tenantId, storeId);
      success(res, 'CMS forms retrieved successfully', forms);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async createForm(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.context?.tenantId || Number((req.user as any)?.tenantId) || 1;
      const storeId = (req as any).storeId || Number((req.user as any)?.storeId) || 1;
      const userId = Number((req.user as any)?.id) || 1;

      const form = await StoreCmsService.createForm(tenantId, storeId, userId, req.body);
      created(res, 'CMS form created successfully', form);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }

  static async submitForm(req: Request, res: Response): Promise<void> {
    try {
      const formId = parseInt(req.params.id, 10);
      const submission = await StoreCmsService.submitForm(formId, req.body);
      created(res, 'Form submitted successfully', submission);
    } catch (error: unknown) {
      const err = error as Error;
      badRequest(res, err.message);
    }
  }
}
