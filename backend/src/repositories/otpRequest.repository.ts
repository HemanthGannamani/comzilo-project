import { BaseRepository } from '../core/BaseRepository';
import { OtpRequest } from '../database/models/otpRequest';

export class OtpRequestRepository extends BaseRepository<OtpRequest> {
  constructor() {
    super(OtpRequest);
  }

  public async findLatestActive(
    tenantId: number | null,
    destination: string,
    purpose: string
  ): Promise<OtpRequest | null> {
    return this.findOne(tenantId, {
      where: {
        destination,
        purpose,
        consumed_at: null,
      },
      order: [['created_at', 'DESC']],
    });
  }
}
