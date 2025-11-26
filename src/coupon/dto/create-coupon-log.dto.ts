export class CreateCouponLogDto {
  id: number;
  couponCode?: string;
  userId?: number;
  wasSuccessful?: boolean;
  errorMessage?: string;
}
