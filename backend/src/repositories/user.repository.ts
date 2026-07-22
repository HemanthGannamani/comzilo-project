import { BaseRepository } from '../core/BaseRepository';
import { User } from '../database/models/user';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  public async findByEmail(tenantId: number | null, email: string): Promise<User | null> {
    return this.findOne(tenantId, { where: { email } });
  }

  public async findByUuid(tenantId: number | null, uuid: string): Promise<User | null> {
    return this.findOne(tenantId, { where: { uuid } });
  }
}
