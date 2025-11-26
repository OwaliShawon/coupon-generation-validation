import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';

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
}
