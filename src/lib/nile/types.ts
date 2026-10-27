/**
 * Nile Storefront API v1 TypeScript Definitions
 * Official API Specification Types
 */

export interface NileApiResponse<T> {
  success: boolean;
  message: string;
  responseObject: T;
  statusCode: number;
}

export interface NileApiError {
  success: false;
  message: string;
  statusCode: number;
  code?: string;
  error?: string;
}

// Store & Branding Types
export interface StoreContact {
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface StoreSocials {
  instagram: string | null;
  twitter: string | null;
  whatsappLink: string | null;
  whatsappPhone: string | null;
  facebook: string | null;
  linkedin: string | null;
}

export interface StoreCurrency {
  base: string;
  legacy: string;
}

export interface StoreThemeColors {
  primary?: string;
  accent?: string;
  background?: string;
  text?: string;
  [key: string]: string | undefined;
}

export interface StoreTheme {
  name: string;
  colors: string | StoreThemeColors; // JSON string or object
  logo: string | null;
  fonts: string | null;
  images: string | null;
  backgrounds: string | null;
  headerMedia: string | null;
}

export interface StoreSettings {
  storeFrontActive: boolean;
  storeNotice: string | null;
  language: string;
  theme: StoreTheme;
  hours: {
    enabled: boolean;
    schedule: string | null;
  };
  shipping: {
    feeActive: boolean;
    freeShippingThreshold: number;
  };
}

export interface ConnectedGateway {
  provider: "PAYSTACK" | "FLUTTERWAVE" | "STRIPE" | string;
  environment: "live" | "test" | string;
  connectedAt: string;
}

export interface StorePaymentMethods {
  connectedGateways: ConnectedGateway[];
  preferredGatewayProvider: string;
}

export interface StoreWideDiscount {
  isEnabled: boolean;
  type: "PERCENTAGE" | "FIXED" | string;
  value: number;
  startDate: string | null;
  endDate: string | null;
}

export interface NileStore {
  id: string;
  name: string;
  storeUrl: string;
  status: "ACTIVE" | "PAUSED" | string;
  whitelabel: boolean;
  logo: string | null;
  banner: string | null;
  about: string | null;
  contact: StoreContact;
  socials: StoreSocials;
  currency: StoreCurrency;
  settings: StoreSettings;
  paymentMethods: StorePaymentMethods;
  storeWideDiscount?: StoreWideDiscount;
}

// Catalog Types
export interface ProductCategory {
  id?: number;
  uuid: string;
  name: string;
  description: string | null;
  parentId?: number | null;
  parentCategory?: ProductCategory | null;
  productCount?: number;
  imageUrl?: string | null;
  imageUrls?: string[];
  products?: NileProduct[];
}

export interface ProductAttributeValue {
  attribute: {
    name: string;
    hexColor?: string;
  };
  productAttribute: {
    name: string; // e.g. "Colour", "Size"
  };
}

export interface ProductVariant {
  id: string;
  sku: string;
  quantity: number;
  price: number;
  discountedPrice: number | null;
  imageUrl?: string | null;
  attributes: ProductAttributeValue[];
}

export interface NileProduct {
  id: number;
  uuid: string;
  name: string;
  description: string;
  price: number;
  discountedPrice: number | null;
  stock: number;
  hasVariants: boolean;
  unitSold?: number;
  minimumOrderQuantity?: number;
  freeShipping?: boolean;
  isSoldOut?: boolean;
  isPreorder?: boolean;
  imageUrl: string;
  imageUrls: string[];
  publishStatus: "PUBLISHED" | "DRAFT" | string;
  productStatus: "AVAILABLE" | "OUT_OF_STOCK" | string;
  category: ProductCategory | null;
  categories?: ProductCategory[];
  attributesValues: ProductAttributeValue[];
  productVariants: ProductVariant[];
  customizationEnabled?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductsPaginationMeta {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductsListResponse {
  category: ProductCategory | null;
  products: NileProduct[];
  meta: ProductsPaginationMeta;
  currencyProjection?: string;
}

// Cart Types
export interface CartItemProduct {
  uuid: string;
  name: string;
  imageUrl: string;
  stock: number;
  price: number;
  discountedPrice: number | null;
  hasVariants: boolean;
  productStatus: string;
  category?: { uuid: string; name: string };
}

export interface NileCartItem {
  id: number;
  cartId: string;
  productId: string; // product uuid
  variantID: string | null;
  quantity: number;
  price: number;
  customizationData?: Record<string, string> | null;
  product: CartItemProduct;
  variant: ProductVariant | null;
  productAttributeValue?: ProductAttributeValue | null;
}

export interface NileCart {
  cartId: string;
  items: NileCartItem[];
  total: number;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  isVariant: boolean;
  variantId?: string | null;
  customizationData?: Record<string, string> | null;
}

export interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
  isVariant: boolean;
  variantId?: string | null;
}

// Checkout Types
export interface CheckoutItemPayload {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  productImage?: string;
  variantName?: string;
}

export interface CheckoutPayload {
  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  customerCity: string;
  customerState: string;
  customerCountry: string;
  cartId: string;
  currency: string;
  salesChannel: "Headless" | string;
  items: CheckoutItemPayload[];
  shippingFee: number;
  shippingAddress: string;
  shippingZoneName: string;
  subtotalAmount: number;
  grandTotal: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  variantName?: string | null;
}

export interface OrderPaymentRecord {
  id: number;
  method: string;
  status: "PAID" | "PENDING" | "FAILED" | string;
  reference: string;
}

export interface NileOrder {
  id: number;
  storeId: string;
  customerId?: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | string;
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED" | string;
  currency: string;
  subtotalAmount: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  amountDue: number;
  shippingAddress: string;
  items: OrderItem[];
  payment?: OrderPaymentRecord;
  createdAt: string;
}

export interface PaymentInitializationResponse {
  paymentLink?: string;
  authorizationUrl: string;
  reference: string;
  provider: string;
  initializedPayment?: {
    id: number;
    orderId: number;
    method: string;
    status: string;
    amountMinor: number;
    currency: string;
    reference: string;
  };
}

// Customers & Auth Types
export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken?: string;
}

// Reviews Types
export interface NileReview {
  id: string;
  storeId?: string;
  productId: string;
  reviewerName: string;
  reviewerEmail?: string;
  rating: number; // 1-5
  comment: string;
  orderId?: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: NileReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateReviewPayload {
  productId: string;
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  orderId?: string;
  isVerifiedPurchase?: boolean;
}
