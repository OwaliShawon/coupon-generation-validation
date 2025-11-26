import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RedeemCouponDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
