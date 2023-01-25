import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
