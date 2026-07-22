import { BaseRepository } from '../core/BaseRepository';
import { Media } from '../database/models/media';

export class MediaRepository extends BaseRepository<Media> {
  constructor() {
    super(Media);
  }
}
