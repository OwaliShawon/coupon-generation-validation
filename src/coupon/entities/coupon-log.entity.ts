import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('coupon_logs')
export class CouponLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  couponCode: string;

  @Column()
  userId: number;

  @Column()
  wasSuccessful: boolean;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  attemptedAt: Date;
}
