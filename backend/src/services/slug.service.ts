import { Sequelize } from 'sequelize';

/**
 * SlugService – a reusable utility to generate URL‑friendly slugs that are unique
 * per tenant and store. It can be used by Category, Brand, Collection, Tag and
 * Product modules.
 */
export class SlugService {
  constructor(_sequelize: Sequelize) {}

  /**
   * Normalises an arbitrary string into a slug.
   * @param raw The raw input string.
   */
  public normalise(raw: string): string {
    return raw
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // spaces to hyphens
      .replace(/[^a-z0-9-]/g, '') // remove unsupported chars
      .replace(/-+/g, '-') // collapse multiple hyphens
      .replace(/^[-]+|[-]+$/g, ''); // trim hyphens from ends
  }

  /**
   * Generates a unique slug for a given model scoped by tenantId and storeId.
   * If the desired slug already exists, a numeric suffix is appended.
   *
   * @param model The Sequelize model constructor (e.g. Category, Brand).
   * @param baseSlug Desired slug (already normalised or raw). If empty, throws.
   * @param tenantId Tenant identifier.
   * @param storeId Store identifier.
   */
  public async generateUniqueSlug(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: any,
    baseSlug: string,
    tenantId: number,
    storeId: number
  ): Promise<string> {
    if (!baseSlug) {
      throw new Error('Base slug cannot be empty');
    }
    const slugBase = this.normalise(baseSlug);
    let candidate = slugBase;
    let suffix = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await model.findOne({
        where: {
          slug: candidate,
          tenantId,
          storeId,
        },
        attributes: ['id'],
        raw: true,
      });
      if (!existing) {
        return candidate;
      }
      suffix += 1;
      candidate = `${slugBase}-${suffix}`;
    }
  }
}
