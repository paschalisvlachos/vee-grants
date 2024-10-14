import { Test, TestingModule } from '@nestjs/testing';
import { GrantsResolver } from './grants.resolver';

describe('GrantsResolver', () => {
  let resolver: GrantsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrantsResolver],
    }).compile();

    resolver = module.get<GrantsResolver>(GrantsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
