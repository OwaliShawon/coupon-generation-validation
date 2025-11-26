import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CouponLog } from './entities/coupon-log.entity';
import { CreateCouponLogDto } from './dto/create-coupon-log.dto';

@Controller()
export class CouponLogConsumer {
  constructor(
    @InjectRepository(CouponLog)
    private readonly logRepository: Repository<CouponLog>,
  ) {}

  @EventPattern('log_coupon_attempt')
  async handleCouponLog(@Payload() data: CreateCouponLogDto) {
    console.log('Logging attempt:', data);

    const newLog = this.logRepository.create(data);

    await this.logRepository.save(newLog);
  }
}
