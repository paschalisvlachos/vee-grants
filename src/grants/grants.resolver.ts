import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GrantsService } from './grants.service';
import { Grant } from './grant.model';  // GraphQL model
import { SubmitFeedbackInput } from './inputs/submit-feedback.input';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Grant)
export class GrantsResolver {
  constructor(private readonly grantsService: GrantsService) {}

  // Define the Query for getting all grants with tenant isolation
  @Query(() => [Grant])
  @UseGuards(JwtAuthGuard)
  async grants(
    @Args('tenantId') tenantId: string,
  ): Promise<Grant[]> {
    const grants = await this.grantsService.getAllGrants(tenantId);
    return grants.map(g => this.mapToGraphQLModel(g));  // Map Mongoose result to GraphQL model
  }

  @Query(() => [Grant])
  @UseGuards(JwtAuthGuard)
  async newMatches(
    @Args('tenantId') tenantId: string,
  ): Promise<Grant[]> {
    const matches = await this.grantsService.getNewMatches(tenantId);
    return matches.map(g => this.mapToGraphQLModel(g));  // Map Mongoose result to GraphQL model
  }

  @Mutation(() => Grant, { nullable: true })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  async submitFeedback(
    @Args('id') id: string,
    @Args('input') input: SubmitFeedbackInput,
    @Args('tenantId') tenantId: string,
  ): Promise<Grant | null> {
    const grant = await this.grantsService.submitFeedback(id, input.feedback, input.approve, tenantId);
    return grant ? this.mapToGraphQLModel(grant) : null;
  }

  // Helper method to map Mongoose model to GraphQL model
  private mapToGraphQLModel(grant: any): Grant {
    return {
      id: grant._id.toString(),
      foundationName: grant.foundationName,
      grantName: grant.grantName || '',
      avgAmount: grant.avgAmount || 0,
      status: grant.status,
      deadline: grant.deadline || '',
      matchDate: grant.matchDate.toISOString(),
      tenantId: grant.tenantId,
      feedback: grant.feedback || null,
    };
  }
}
