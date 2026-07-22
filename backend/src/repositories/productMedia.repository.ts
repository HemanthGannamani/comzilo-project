import { BaseRepository } from '../core/BaseRepository';
import { ProductMedia } from '../database/models/productMedia';

export class ProductMediaRepository extends BaseRepository<ProductMedia> {
  constructor() {
    super(ProductMedia);
  }
}
