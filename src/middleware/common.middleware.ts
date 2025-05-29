import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CommonMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('Server is running...');
    next();
    console.log('Server is shutting down...');
  }
}
