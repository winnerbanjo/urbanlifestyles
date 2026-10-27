import {
  AddToCartPayload,
  CheckoutPayload,
  CreateReviewPayload,
  CustomerProfile,
  NileApiResponse,
  NileCart,
  NileOrder,
  NileProduct,
  NileStore,
  PaymentInitializationResponse,
  ProductCategory,
  ProductsListResponse,
  ReviewsResponse,
  NileReview,
  UpdateCartItemPayload,
  VerifyOtpResponse,
} from "./types";
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_REVIEWS,
  MOCK_STORE,
} from "./mock-data";

export const NILE_API_URL =
  process.env.NEXT_PUBLIC_NILE_API_URL || "https://api.nile.ng/storefront/v1";
export const NILE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_NILE_PUBLISHABLE_KEY || "";

class NileApiClient {
  private baseUrl: string;
  private publishableKey: string;

  constructor() {
    this.baseUrl = NILE_API_URL.replace(/\/+$/, "");
    this.publishableKey = NILE_PUBLISHABLE_KEY;
  }

  public setPublishableKey(key: string) {
    this.publishableKey = key;
  }

  public getPublishableKey(): string {
    return this.publishableKey;
  }

  private isLiveConfigured(): boolean {
    return (
      Boolean(this.publishableKey) &&
      !this.publishableKey.includes("your_publishable_key") &&
      this.publishableKey.startsWith("pk_")
    );
  }

  private async request<T>(
    endpoint: string,
    options: {
      method?: string;
      body?: unknown;
      cartId?: string | null;
      customerToken?: string | null;
      params?: Record<string, string | number | boolean | undefined>;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    const {
      method = "GET",
      body,
      cartId,
      customerToken,
      params,
      headers = {},
    } = options;

    let url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });
      const queryStr = searchParams.toString();
      if (queryStr) {
        url += `${url.includes("?") ? "&" : "?"}${queryStr}`;
      }
    }

    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (this.publishableKey) {
      requestHeaders["x-api-key"] = this.publishableKey;
    }

    if (cartId) {
      requestHeaders["x-anonymous-cart-id"] = cartId;
    }

    if (customerToken) {
      requestHeaders["Authorization"] = `Bearer ${customerToken}`;
    }

    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      cache: method === "GET" && !endpoint.includes("/cart") ? "default" : "no-store",
    });

    const data: NileApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: `Failed to parse response from ${endpoint}`,
      responseObject: null as unknown as T,
      statusCode: response.status,
    }));

    if (!response.ok || !data.success) {
      const errorMsg = data.message || `API error (${response.status}) on ${endpoint}`;
      console.warn(`[Nile API Error ${response.status}] ${endpoint}:`, errorMsg);
      throw new Error(errorMsg);
    }

    return data.responseObject;
  }

  // --- NORMALIZATION HELPERS ---
  private normalizeProduct(p: NileProduct): NileProduct {
    let imageUrl = p.imageUrl || "";
    let imageUrls: string[] = [];

    if (typeof imageUrl === "string" && imageUrl.trim().startsWith("[")) {
      try {
        const parsed = JSON.parse(imageUrl);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrl = parsed[0];
          imageUrls = parsed;
        }
      } catch {
        // keep as is
      }
    } else if (imageUrl) {
      imageUrls = [imageUrl];
    }

    if (Array.isArray(p.imageUrls) && p.imageUrls.length > 0) {
      imageUrls = p.imageUrls;
      if (!imageUrl) imageUrl = imageUrls[0];
    }

    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop";
      imageUrls = [imageUrl];
    }

    // Default swatches if attributesValues is empty so card displays swatches
    let attributesValues = p.attributesValues || [];
    if (attributesValues.length === 0) {
      attributesValues = [
        { attribute: { name: "Onyx", hexColor: "#171717" }, productAttribute: { name: "Colour" } },
        { attribute: { name: "Sage", hexColor: "#BDD2BF" }, productAttribute: { name: "Colour" } },
        { attribute: { name: "Ivory", hexColor: "#FAF7F2" }, productAttribute: { name: "Colour" } },
      ];
    }

    return {
      ...p,
      imageUrl,
      imageUrls,
      attributesValues,
    };
  }

  private normalizeStore(store: NileStore): NileStore {
    const whatsappPhone = store.contact?.phone || store.socials?.whatsappPhone;
    const whatsappLink =
      store.socials?.whatsappLink ||
      (whatsappPhone ? `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, "")}` : null);

    return {
      ...store,
      socials: {
        ...store.socials,
        whatsappLink,
      },
    };
  }

  // --- STORE BRANDING ---
  async getStore(): Promise<NileStore> {
    if (!this.isLiveConfigured()) {
      return this.normalizeStore(MOCK_STORE);
    }
    try {
      const live = await this.request<NileStore>("/store");
      return this.normalizeStore(live);
    } catch (err) {
      console.warn("Failed fetching live store from Nile, falling back to brand defaults:", err);
      return this.normalizeStore(MOCK_STORE);
    }
  }

  // --- CATALOG & PRODUCTS ---
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    is_featured?: boolean;
    sortBy?: "createdAt" | "updatedAt" | "price" | "newest" | "topSellers";
    sortOrder?: "asc" | "desc";
    currency?: string;
  }): Promise<ProductsListResponse> {
    if (!this.isLiveConfigured()) {
      let filtered = [...MOCK_PRODUCTS];

      if (params?.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query)
        );
      }

      if (params?.category && params.category !== "ALL") {
        const catQuery = params.category.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.category?.name.toLowerCase() === catQuery ||
            p.category?.uuid.toLowerCase() === catQuery
        );
      }

      if (params?.is_featured) {
        filtered = filtered.slice(0, 4);
      }

      if (params?.sortBy) {
        if (params.sortBy === "price") {
          filtered.sort((a, b) =>
            params.sortOrder === "desc"
              ? (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price)
              : (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price)
          );
        } else if (params.sortBy === "topSellers") {
          filtered.sort((a, b) => (b.unitSold ?? 0) - (a.unitSold ?? 0));
        } else if (params.sortBy === "newest" || params.sortBy === "createdAt") {
          filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      }

      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      return {
        category: null,
        products: paginated,
        meta: {
          currentPage: page,
          totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
          totalProducts: filtered.length,
          hasNextPage: start + limit < filtered.length,
          hasPreviousPage: page > 1,
        },
      };
    }

    try {
      const res = await this.request<ProductsListResponse>("/products", {
        params: params as Record<string, string | number | boolean | undefined>,
      });
      return {
        ...res,
        products: (res.products || []).map((p) => this.normalizeProduct(p)),
      };
    } catch (err) {
      console.warn("Live products fetch failed, using fallback:", err);
      return this.getProducts({ ...params, page: 1 });
    }
  }

  async getProduct(uuid: string): Promise<NileProduct> {
    if (!this.isLiveConfigured()) {
      const match = MOCK_PRODUCTS.find((p) => p.uuid === uuid);
      if (match) return match;
      throw new Error(`Product with uuid ${uuid} not found`);
    }

    try {
      const prod = await this.request<NileProduct>(`/products/${uuid}`);
      return this.normalizeProduct(prod);
    } catch (err) {
      console.warn(`Live product ${uuid} fetch failed, checking fallback:`, err);
      const match = MOCK_PRODUCTS.find((p) => p.uuid === uuid);
      if (match) return match;
      throw err;
    }
  }

  async getCategories(): Promise<ProductCategory[]> {
    if (!this.isLiveConfigured()) {
      return MOCK_CATEGORIES;
    }

    try {
      return await this.request<ProductCategory[]>("/categories");
    } catch (err) {
      console.warn("Live categories fetch failed, using fallback:", err);
      return MOCK_CATEGORIES;
    }
  }

  async getCategoryProducts(
    categoryId: string,
    params?: { page?: number; limit?: number }
  ): Promise<ProductsListResponse> {
    if (!this.isLiveConfigured()) {
      const category = MOCK_CATEGORIES.find(
        (c) => c.uuid === categoryId || c.name.toLowerCase() === categoryId.toLowerCase()
      );
      const filtered = category && category.name !== "ALL"
        ? MOCK_PRODUCTS.filter((p) => p.category?.uuid === category.uuid || p.category?.name === category.name)
        : MOCK_PRODUCTS;

      return {
        category: category || null,
        products: filtered,
        meta: {
          currentPage: 1,
          totalPages: 1,
          totalProducts: filtered.length,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    }

    try {
      return await this.request<ProductsListResponse>(`/categories/${categoryId}/products`, {
        params: params as Record<string, string | number | boolean | undefined>,
      });
    } catch (err) {
      console.warn(`Category ${categoryId} products fetch failed, using fallback:`, err);
      return this.getProducts({ category: categoryId });
    }
  }

  // --- CART OPERATIONS ---
  async getCart(cartId?: string | null): Promise<NileCart> {
    if (!this.isLiveConfigured()) {
      return this.getLocalCart(cartId);
    }

    try {
      return await this.request<NileCart>("/cart", { cartId });
    } catch (err) {
      console.warn("Live cart fetch failed, falling back to local cart:", err);
      return this.getLocalCart(cartId);
    }
  }

  async addToCart(cartId: string | null, payload: AddToCartPayload): Promise<NileCart> {
    if (!this.isLiveConfigured()) {
      return this.addToLocalCart(cartId, payload);
    }

    try {
      await this.request<{ id: number; cartId: string }>("/cart/items", {
        method: "POST",
        body: payload,
        cartId,
      });
      return await this.getCart(cartId);
    } catch (err) {
      console.warn("Live add to cart failed, using local cart:", err);
      return this.addToLocalCart(cartId, payload);
    }
  }

  async updateCartItem(
    cartId: string,
    payload: UpdateCartItemPayload
  ): Promise<NileCart> {
    if (!this.isLiveConfigured()) {
      return this.updateLocalCartItem(cartId, payload);
    }

    try {
      await this.request<{ count: number }>("/cart/items", {
        method: "PATCH",
        body: payload,
        cartId,
      });
      return await this.getCart(cartId);
    } catch (err) {
      console.warn("Live update cart item failed, using local cart:", err);
      return this.updateLocalCartItem(cartId, payload);
    }
  }

  async removeCartItem(
    cartId: string,
    productId: string,
    variantId?: string | null
  ): Promise<NileCart> {
    if (!this.isLiveConfigured()) {
      return this.removeLocalCartItem(cartId, productId, variantId);
    }

    try {
      const queryParam = variantId ? `?variantId=${encodeURIComponent(variantId)}` : "";
      await this.request<{ count: number }>(`/cart/items/${productId}${queryParam}`, {
        method: "DELETE",
        cartId,
      });
      return await this.getCart(cartId);
    } catch (err) {
      console.warn("Live remove cart item failed, using local cart:", err);
      return this.removeLocalCartItem(cartId, productId, variantId);
    }
  }

  async clearCart(cartId: string): Promise<NileCart> {
    if (!this.isLiveConfigured()) {
      return this.clearLocalCart(cartId);
    }

    try {
      await this.request<{ count: number }>("/cart", {
        method: "DELETE",
        cartId,
      });
      return await this.getCart(cartId);
    } catch (err) {
      console.warn("Live clear cart failed, using local cart:", err);
      return this.clearLocalCart(cartId);
    }
  }

  // --- CHECKOUT & PAYMENT ---
  async createCheckout(payload: CheckoutPayload): Promise<NileOrder> {
    if (!this.isLiveConfigured()) {
      const mockOrder: NileOrder = {
        id: Math.floor(1000 + Math.random() * 9000),
        storeId: MOCK_STORE.id,
        status: "PENDING",
        paymentStatus: "UNPAID",
        currency: payload.currency || "NGN",
        subtotalAmount: payload.subtotalAmount,
        shippingFee: payload.shippingFee,
        taxAmount: 0,
        discountAmount: 0,
        grandTotal: payload.grandTotal,
        amountDue: payload.grandTotal,
        shippingAddress: payload.shippingAddress,
        items: payload.items.map((item, idx) => ({
          id: idx + 1,
          orderId: 9999,
          productId: item.productId,
          productName: item.productName,
          productPrice: item.productPrice,
          quantity: item.quantity,
          variantName: item.variantName,
        })),
        createdAt: new Date().toISOString(),
      };
      return mockOrder;
    }

    return await this.request<NileOrder>("/checkout", {
      method: "POST",
      body: payload,
    });
  }

  async startPayment(orderId: number): Promise<PaymentInitializationResponse> {
    if (!this.isLiveConfigured()) {
      return {
        paymentLink: `/checkout/payment?orderId=${orderId}&status=simulated`,
        authorizationUrl: `/checkout/payment?orderId=${orderId}&status=simulated`,
        reference: `ord_${orderId}_simulated`,
        provider: "paystack",
        initializedPayment: {
          id: 999,
          orderId,
          method: "PAYSTACK",
          status: "PENDING_PAYMENT",
          amountMinor: 5000000,
          currency: "NGN",
          reference: `ord_${orderId}_simulated`,
        },
      };
    }

    return await this.request<PaymentInitializationResponse>(
      `/checkout/${orderId}/payment`,
      {
        method: "POST",
        body: { orderId },
      }
    );
  }

  // --- CUSTOMERS AUTH & ORDERS ---
  async sendOtp(email: string): Promise<void> {
    if (!this.isLiveConfigured()) {
      console.log(`[Simulated OTP] Login code sent to ${email}: 123456`);
      return;
    }
    await this.request<null>("/customers/auth/sendOtp", {
      method: "POST",
      body: { email },
    });
  }

  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse> {
    if (!this.isLiveConfigured()) {
      if (otp === "123456" || otp.length === 6) {
        return {
          accessToken: `mock_jwt_token_${Date.now()}`,
          refreshToken: `mock_refresh_${Date.now()}`,
        };
      }
      throw new Error("Invalid OTP code. Please enter the 6-digit code (use 123456 in demo mode).");
    }

    return await this.request<VerifyOtpResponse>("/customers/auth/verifyOtp", {
      method: "POST",
      body: { email, otp },
    });
  }

  async getCustomerProfile(customerToken: string): Promise<CustomerProfile> {
    if (!this.isLiveConfigured() || customerToken.startsWith("mock_")) {
      return {
        id: "cust_sample_uuid",
        fullName: "Luxury Client",
        email: "client@urbanlifestyles.ng",
        phone: "+2348123456789",
        createdAt: "2026-01-10T10:00:00.000Z",
      };
    }

    return await this.request<CustomerProfile>("/customers/auth/profile", {
      customerToken,
    });
  }

  async getCustomerOrders(customerToken: string): Promise<NileOrder[]> {
    if (!this.isLiveConfigured() || customerToken.startsWith("mock_")) {
      return [
        {
          id: 3412,
          storeId: MOCK_STORE.id,
          status: "COMPLETED",
          paymentStatus: "PAID",
          currency: "NGN",
          subtotalAmount: 100000,
          shippingFee: 0,
          taxAmount: 0,
          discountAmount: 0,
          grandTotal: 100000,
          amountDue: 0,
          shippingAddress: "14 Adeola Odeku Street, Victoria Island, Lagos",
          items: [
            {
              id: 701,
              orderId: 3412,
              productId: "prod-lily-set",
              productName: "LILY SET",
              productPrice: 50000,
              quantity: 1,
              variantName: "Colour: Sage Floral, Size: M",
            },
            {
              id: 702,
              orderId: 3412,
              productId: "prod-klohe-dress",
              productName: "KLOHE DRESS",
              productPrice: 50000,
              quantity: 1,
              variantName: "Colour: Ocean Teal, Size: S",
            },
          ],
          payment: {
            id: 881,
            method: "PAYSTACK",
            status: "PAID",
            reference: "ord_3412_paystack",
          },
          createdAt: "2026-10-21T11:20:00.000Z",
        },
      ];
    }

    return await this.request<NileOrder[]>("/customers/auth/orders", {
      customerToken,
    });
  }

  // --- REVIEWS ---
  async getProductReviews(
    productUuid: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ReviewsResponse> {
    if (!this.isLiveConfigured()) {
      const reviews = MOCK_REVIEWS.filter((r) => r.productId === productUuid);
      return {
        reviews,
        meta: {
          page,
          limit,
          total: reviews.length,
          totalPages: 1,
        },
      };
    }

    try {
      return await this.request<ReviewsResponse>(
        `/products/${productUuid}/reviews`,
        {
          params: { page, limit },
        }
      );
    } catch (err) {
      console.warn("Product reviews fetch failed, returning mock:", err);
      const reviews = MOCK_REVIEWS.filter((r) => r.productId === productUuid);
      return {
        reviews,
        meta: { page, limit, total: reviews.length, totalPages: 1 },
      };
    }
  }

  async createReview(payload: CreateReviewPayload): Promise<NileReview> {
    if (!this.isLiveConfigured()) {
      const newRev: NileReview = {
        id: `rev-${Date.now()}`,
        productId: payload.productId,
        reviewerName: payload.reviewerName,
        reviewerEmail: payload.reviewerEmail,
        rating: payload.rating,
        comment: payload.comment,
        orderId: payload.orderId,
        isVerifiedPurchase: true,
        createdAt: new Date().toISOString(),
      };
      MOCK_REVIEWS.unshift(newRev);
      return newRev;
    }

    return await this.request<NileReview>("/reviews", {
      method: "POST",
      body: payload,
    });
  }

  // --- LOCAL FALLBACK CART STATE MANAGEMENT ---
  private getLocalCart(cartId?: string | null): NileCart {
    if (typeof window === "undefined") {
      return {
        cartId: cartId || "temp-cart-id",
        items: [],
        total: 0,
      };
    }

    const key = `nile_cart_${cartId || "default"}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore parse error
      }
    }

    const initial: NileCart = {
      cartId: cartId || `cart_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      items: [],
      total: 0,
    };
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }

  private saveLocalCart(cart: NileCart) {
    if (typeof window !== "undefined") {
      const key = `nile_cart_${cart.cartId}`;
      localStorage.setItem(key, JSON.stringify(cart));
      localStorage.setItem("x-anonymous-cart-id", cart.cartId);
    }
  }

  private addToLocalCart(cartId: string | null, payload: AddToCartPayload): NileCart {
    const cart = this.getLocalCart(cartId);
    const product = MOCK_PRODUCTS.find((p) => p.uuid === payload.productId);

    if (!product) {
      return cart;
    }

    const variant = payload.isVariant && payload.variantId
      ? product.productVariants.find((v) => v.id === payload.variantId) || null
      : null;

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.productId === payload.productId &&
        (item.variantID || null) === (payload.variantId || null)
    );

    const price = variant?.discountedPrice ?? variant?.price ?? product.discountedPrice ?? product.price;

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += payload.quantity;
    } else {
      cart.items.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        cartId: cart.cartId,
        productId: product.uuid,
        variantID: variant ? variant.id : null,
        quantity: payload.quantity,
        price,
        customizationData: payload.customizationData,
        product: {
          uuid: product.uuid,
          name: product.name,
          imageUrl: product.imageUrl,
          stock: product.stock,
          price: product.price,
          discountedPrice: product.discountedPrice,
          hasVariants: product.hasVariants,
          productStatus: product.productStatus,
          category: product.category ? { uuid: product.category.uuid, name: product.category.name } : undefined,
        },
        variant,
      });
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.saveLocalCart(cart);
    return cart;
  }

  private updateLocalCartItem(cartId: string, payload: UpdateCartItemPayload): NileCart {
    const cart = this.getLocalCart(cartId);
    const index = cart.items.findIndex(
      (item) =>
        item.productId === payload.productId &&
        (item.variantID || null) === (payload.variantId || null)
    );

    if (index > -1) {
      if (payload.quantity <= 0) {
        cart.items.splice(index, 1);
      } else {
        cart.items[index].quantity = payload.quantity;
      }
    }

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.saveLocalCart(cart);
    return cart;
  }

  private removeLocalCartItem(
    cartId: string,
    productId: string,
    variantId?: string | null
  ): NileCart {
    const cart = this.getLocalCart(cartId);
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId === productId &&
          (item.variantID || null) === (variantId || null)
        )
    );
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.saveLocalCart(cart);
    return cart;
  }

  private clearLocalCart(cartId: string): NileCart {
    const cart = this.getLocalCart(cartId);
    cart.items = [];
    cart.total = 0;
    this.saveLocalCart(cart);
    return cart;
  }
}

export const nileApi = new NileApiClient();
