import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CouponType {
  INDIVIDUAL = 'individual',
  TIME_SPECIFIC = 'timespecific',
}

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPPIRED = 'expired',
}

@Entity('coupon')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.INDIVIDUAL,
  })
  type: CouponType;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column({ nullable: true })
  maxUsage: number;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ type: 'enum', enum: CouponStatus, default: CouponStatus.ACTIVE })
  status: CouponStatus;

  @Column('int', { array: true, default: [] })
  usedBy: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
