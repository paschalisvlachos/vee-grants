import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grant } from './grant.schema';  // Import the correct Mongoose schema

@Injectable()
export class GrantsService {
  constructor(@InjectModel('Grant') private grantModel: Model<Grant>) {}  // Use 'Grant' as the model name

  async getAllGrants(tenantId: string): Promise<Grant[]> {
    return this.grantModel.find({ tenantId }).exec();
  }

  async getNewMatches(tenantId: string): Promise<Grant[]> {
    const today = new Date();
    return this.grantModel.find({
      tenantId,
      status: 'Pending',
      matchDate: { $gt: today }
    }).exec();
  }

  async submitFeedback(id: string, feedback: string, approve: boolean, tenantId: string): Promise<Grant | null> {
    const grant = await this.grantModel.findOne({ _id: id, tenantId }).lean<Grant>();

    if (!grant) {
      return null;
    }

    if (!approve) {
      await this.grantModel.deleteOne({ _id: id, tenantId });
      return null;
    }

    grant.status = 'Approved';
    grant.feedback = feedback;

    await this.grantModel.updateOne({ _id: id, tenantId }, { status: 'Approved', feedback });

    return await this.grantModel.findOne({ _id: id, tenantId });
  }
}
