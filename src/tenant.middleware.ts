import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract tenant_id from the request
    const tenantId = req.headers['x-tenant-id'];
    // Store tenant_id in request for later use
    req['tenantId'] = tenantId;
    next();
  }
}
