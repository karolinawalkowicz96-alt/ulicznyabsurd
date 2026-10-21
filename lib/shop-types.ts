export const shopSizes = ['S','M','L','XL','XXL'] as const;
export type ShopSize = typeof shopSizes[number];
export type ShopProduct = {
  id:string;slug:string;name:string;description:string;image:string;images:string[];
  price:number|null;priceApproved:boolean;active:boolean;hidden:boolean;soldOut:boolean;sortOrder:number;
  bestseller:boolean;isNew:boolean;seoTitle:string;seoDescription:string;material:string;care:string;
  manufacturer?:string;manufacturerAddress?:string;manufacturerEmail?:string;manufacturerCountry?:string;
  responsiblePerson?:string;responsiblePersonAddress?:string;responsiblePersonEmail?:string;
  baseGarment?:string;composition?:string;safetyInfo?:string;gpsrReady?:boolean;
  variants:{size:ShopSize;stock:number|null;available?:boolean;effectiveStock?:number|null}[];
  effectivePrice?:number|null;testPrice?:number;
};
export type ShopSettings = {
  sellerPhone?:string;fulfillmentDays?:number;legalReady?:boolean;sizeChartApproved?:boolean;shippingReady?:boolean;
  testMode:boolean;salesActive:boolean;codActive:boolean;stripeActive:boolean;
  courierActive:boolean;lockerActive:boolean;courierPrice:number;lockerPrice:number;
  courierCodConfirmed:boolean;lockerCodConfirmed:boolean;internationalCodConfirmed:boolean;codSurcharge:number;codShippingPrice?:number;
  quarterlyLimit:number;instagram:number;facebook:number;youtube:number;tiktok:number;views:number;statsUpdated:string;
};
export const orderStatuses=['new','confirmed','processing','packed','shipped','delivered','completed','cancelled','returned'] as const;
export type OrderStatus=typeof orderStatuses[number];
export type ShopCustomer={firstName:string;lastName:string;email:string;phone:string;country:string;street?:string;postalCode:string;city:string;locker?:string;notes?:string;invoice?:string};
export type ShopOrder={legalText?:string;legalVersion?:string;sellerPhone?:string;fulfillmentDays?:number;id:string;number:string;token?:string;stripeSessionId?:string;stripeUrl?:string;createdAt:string;testMode:boolean;customer:ShopCustomer;items:{id:string;name:string;image:string;size:ShopSize;quantity:number;price:number}[];subtotal:number;shipping:number;total:number;delivery:string;payment:string;status:OrderStatus;paymentStatus:string;shippingStatus:string;returnStatus:string;trackingNumber:string;carrier:string;history:{at:string;action:string}[];notificationStatus:string;stockRestored:boolean;shippedAt?:string;};
