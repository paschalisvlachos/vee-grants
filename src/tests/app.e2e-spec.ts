import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import mongoose from 'mongoose';  // Import mongoose to handle MongoDB connections

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Close the MongoDB connection after all tests
    await mongoose.disconnect();
    await app.close();
  });

  it('/graphql (POST) - submit feedback', async () => {
    const mutation = `
      mutation {
        submitFeedback(id: "670d5db89dc38a3afcc0cee5", input: { feedback: "Great opportunity!", approve: true }, tenantId: "tenant123") {
          id
          foundationName
          status
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200)
      .expect(res => {
        expect(res.body.data.submitFeedback.id).toBe("670d5db89dc38a3afcc0cee5");
        expect(res.body.data.submitFeedback.foundationName).toBe("Alpha Foundation");
        expect(res.body.data.submitFeedback.status).toBe("Approved");
      });
  });

  it('/graphql (POST) - fetch new matches', async () => {
    const query = `
      query {
        newMatches(tenantId: "tenant123") {
          id
          foundationName
          grantName
          avgAmount
          status
          deadline
          matchDate
        }
      }
    `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200)
      .expect(res => {
        expect(res.body.data.newMatches.length).toBeGreaterThan(0); // Make sure we get matches
        expect(res.body.data.newMatches[0].foundationName).toBe("Alpha Foundation"); // Verify some data
      });
  });
});
