import { BaseRepository } from '../core/BaseRepository';
import { RefreshToken } from '../database/models/refreshToken';

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  constructor() {
    super(RefreshToken);
  }

  public async findByHash(
    tenantId: number | null,
    tokenHash: string
  ): Promise<RefreshToken | null> {
    return this.findOne(tenantId, { where: { tokenHash } });
  }

  public async revokeFamily(
    tenantId: number | null,
    familyId: string,
    reason: string
  ): Promise<number> {
    const [affectedCount] = await RefreshToken.update(
      { revokedAt: new Date(), revokeReason: reason },
      {
        where: {
          tenant_id: tenantId,
          family_id: familyId,
          revoked_at: null,
        },
      }
    );
    return affectedCount;
  }
}
