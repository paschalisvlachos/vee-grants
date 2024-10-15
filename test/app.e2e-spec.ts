import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let dbConnection: Connection;

  // Increase the timeout to 30 seconds (30,000 ms)
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri), // Use in-memory MongoDB for testing
        AppModule,
      ],
    })
    .overrideGuard(JwtAuthGuard) // Override the JwtAuthGuard to bypass it
    .useValue({
      canActivate: () => true, // Always allow access
    })
    .compile();

    app = moduleFixture.createNestApplication();
    dbConnection = moduleFixture.get(getConnectionToken());

    await app.init();
  }, 30000); // Increase timeout to 30 seconds

  afterAll(async () => {
    await dbConnection.dropDatabase(); // Clean up test DB
    await app.close();
    await mongoServer.stop(); // Stop the in-memory server
  });

  it('/graphql (POST) - submit feedback', async () => {
    // Seed test data into the in-memory database
    const result = await dbConnection.collection('grants').insertOne({
      foundationName: 'Alpha Foundation',
      grantName: 'Education for All',
      avgAmount: 5000,
      status: 'Pending',
      deadline: '2024-12-31',
      matchDate: new Date('2024-10-20'),
      tenantId: 'tenant123',
      feedback: ''
    });
  
    const mutation = `
      mutation {
        submitFeedback(id: "${result.insertedId.toString()}", input: { feedback: "Great opportunity!", approve: true }, tenantId: "tenant123") {
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
        expect(res.body.data.submitFeedback).toBeDefined();  // Ensure that the response is not null
        expect(res.body.data.submitFeedback.id).toBe(result.insertedId.toString());  // Check if the ID matches
        expect(res.body.data.submitFeedback.foundationName).toBe("Alpha Foundation");
        expect(res.body.data.submitFeedback.status).toBe("Approved");
      });
  });  
  

  it('/graphql (POST) - fetch new matches', async () => {
    // Seed test data for new matches
    await dbConnection.collection('grants').insertMany([
      {
        foundationName: 'Alpha Foundation',
        grantName: 'Education for All',
        avgAmount: 5000,
        status: 'Pending',
        deadline: '2024-12-31',
        matchDate: new Date('2024-10-20'),
        tenantId: 'tenant123',
        feedback: ''
      },
      {
        foundationName: 'Gamma Foundation',
        grantName: 'Environmental Protection',
        avgAmount: 15000,
        status: 'Pending',
        deadline: '2025-01-10',
        matchDate: new Date('2024-11-01'),
        tenantId: 'tenant123',
        feedback: ''
      },
    ]);

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
        // Ensure that newMatches is defined and not null
        expect(res.body.data.newMatches).toBeDefined();
        expect(res.body.data.newMatches.length).toBeGreaterThan(0);
        expect(res.body.data.newMatches[0].foundationName).toBe("Alpha Foundation");
      });
  });
});
