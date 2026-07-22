import { BaseRepository } from '../core/BaseRepository';
import { CustomerTagAssignment } from '../database/models/customerTagAssignment';

export class CustomerTagAssignmentRepository extends BaseRepository<CustomerTagAssignment> {
  constructor() {
    super(CustomerTagAssignment);
  }
}
