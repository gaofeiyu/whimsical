import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  common(response): unknown {
    return {
      ...response,
      flowCommon: true,
    };
  }
}
