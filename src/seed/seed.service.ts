import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grant } from '../grants/grant.schema';  // Import the Grant schema

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Grant.name) private grantModel: Model<Grant>,
  ) {}

  async seed() {
    // Clear the existing grants data (optional)
    await this.grantModel.deleteMany({});

    // Insert sample grants data, including future match dates for new matches
    await this.grantModel.insertMany([
      {
        foundationName: 'Alpha Foundation',
        grantName: 'Education for All',
        avgAmount: 5000,
        status: 'Pending',  // Set status to Pending for new matches
        deadline: '2024-12-31',
        matchDate: new Date('2025-10-20'),  // Future match date
        tenantId: 'tenant123',
        feedback: ''
      },
      {
        foundationName: 'Beta Foundation',
        grantName: 'Healthcare Improvement',
        avgAmount: 10000,
        status: 'Approved',
        deadline: '2024-11-15',
        matchDate: new Date('2024-09-30'),  // Past match date
        tenantId: 'tenant456',
        feedback: 'Positive feedback'
      },
      {
        foundationName: 'Gamma Foundation',
        grantName: 'Environmental Protection',
        avgAmount: 15000,
        status: 'Pending',  // Set status to Pending for new matches
        deadline: '2025-01-10',
        matchDate: new Date('2025-11-01'),  // Future match date
        tenantId: 'tenant123',
        feedback: ''
      },
      {
        foundationName: 'Delta Foundation',
        grantName: 'Community Health Initiative',
        avgAmount: 8000,
        status: 'Pending',  // Set status to Pending for new matches
        deadline: '2024-12-15',
        matchDate: new Date('2025-12-01'),  // Future match date
        tenantId: 'tenant456',
        feedback: ''
      },
    ]);

    console.log('Seeding completed');
  }
}
