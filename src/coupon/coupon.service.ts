import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon, CouponStatus, CouponType } from './entities/coupon.entity';
import { RedeemCouponDto } from './dto/redeem-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const existingCoupon = await this.couponRepository.findOneBy({
      key: createCouponDto.key,
    });

    if (existingCoupon) {
      throw new ConflictException('Coupon key already exists');
    }

    const newCoupon = this.couponRepository.create(createCouponDto);

    return await this.couponRepository.save(newCoupon);
  }

  async findAll() {
    return await this.couponRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOneBy({ id });

    if (!coupon) {
      throw new NotFoundException(`Coupon with ID ${id} not found`);
    }

    return coupon;
  }

  async findByCode(key: string) {
    const coupon = await this.couponRepository.findOneBy({ key });
    if (!coupon) {
      throw new NotFoundException(`Coupon key ${key} is invalid`);
    }
    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const coupon = await this.findOne(id);

    if (updateCouponDto.key && updateCouponDto.key !== coupon.key) {
      const duplicate = await this.couponRepository.findOneBy({
        key: updateCouponDto.key,
      });
      if (duplicate) {
        throw new ConflictException('New coupon code already exists');
      }
    }

    const updatedCoupon = this.couponRepository.merge(coupon, updateCouponDto);

    return await this.couponRepository.save(updatedCoupon);
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);
    return await this.couponRepository.remove(coupon);
  }

  async redeem(redeemCouponDto: RedeemCouponDto) {
    const { key, userId } = redeemCouponDto;

    const coupon = await this.couponRepository.findOneBy({ key });
    if (!coupon) {
      throw new NotFoundException('Invalid coupon code');
    }

    if (coupon.status !== CouponStatus.ACTIVE) {
      throw new BadRequestException('This coupon is inactive or expired');
    }

    const now = new Date();

    if (coupon.type === CouponType.TIME_SPECIFIC) {
      if (coupon.validFrom && now < coupon.validFrom) {
        throw new BadRequestException('This promotion has not started yet');
      }
      if (coupon.validUntil && now > coupon.validUntil) {
        throw new BadRequestException('This promotion has expired');
      }
    }

    if (coupon.type === CouponType.INDIVIDUAL) {
      if (coupon.usedBy.includes(userId)) {
        throw new ConflictException('You have already redeemed this coupon');
      }
    }

    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) {
      throw new BadRequestException(
        'This coupon has reached its maximum usage limit',
      );
    }

    coupon.usedBy.push(userId);
    coupon.usageCount += 1;

    await this.couponRepository.save(coupon);

    return {
      success: true,
      message: 'Coupon redeemed successfully',
    };
  }
}
