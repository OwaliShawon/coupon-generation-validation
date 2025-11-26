import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponService } from './coupon.service';
import { CouponController } from './coupon.controller';
import { Coupon } from './entities/coupon.entity';
import { CouponLog } from './entities/coupon-log.entity';
import { CouponLogConsumer } from './coupon-log.consumer';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, CouponLog]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [
                configService.get<string>('KAFKA_BROKER') || 'localhost:9092',
              ],
            },
            consumer: {
              groupId: 'coupon-service-producer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CouponController, CouponLogConsumer],
  providers: [CouponService],
  exports: [CouponService],
})
export class CouponModule {}
