import {
  IsEnum,
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { CouponType, CouponStatus } from '../entities/coupon.entity';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsOptional()
  @IsEnum(CouponType)
  type?: CouponType;

  @IsOptional()
  @IsDateString()
  validFrom?: Date;

  @IsOptional()
  @IsDateString()
  validUntil?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsage?: number;

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;
}
