import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, InsertResult, Repository } from 'typeorm';
import { Tracker } from './index.entity';
@Injectable()
export class TrackerService {
  constructor(
    @InjectRepository(Tracker)
    private readonly trackerRepository: Repository<Tracker>,
  ) {}

  private readonly tracker: Tracker[] = [];

  async findAll(): Promise<Tracker[]> {
    return await this.trackerRepository.find();
  }

  async insert(): Promise<InsertResult> {
    console.log(this.trackerRepository);
    const data = this.trackerRepository.create();
    console.log(data);
    return await this.trackerRepository
      .createQueryBuilder()
      .insert()
      .into(Tracker)
      .values({
        actionId: `test1`,
        projectId: `0`,
        type: 'count',
        extend: '{}',
      })
      .execute();
  }
}
