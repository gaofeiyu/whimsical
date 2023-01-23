import { Injectable } from '@nestjs/common';

export type TrackerBody = {
  projectId: string;
  actionId: string;
  type: string;
  params: unknown;
};

@Injectable()
export class AppService {
  tracker(): TrackerBody {
    return {
      projectId: '1',
      actionId: '1',
      type: 'count',
      params: {},
    };
  }
}
