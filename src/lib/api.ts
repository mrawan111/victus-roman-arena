// API Base URL - defaults to localhost:8080/api
// Can be overridden by setting VITE_API_BASE_URL in .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Log API base URL in development for debugging
if (import.meta.env.DEV) {
  console.log("API Base URL:", API_BASE_URL);
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  // Check for admin session first
  const adminSession = localStorage.getItem("adminSession");
  if (adminSession) {
    try {
      const sessionData = JSON.parse(adminSession);
      return sessionData.token || null;
    } catch {
      // Invalid session, continue to check user session
    }
  }
  
  // Check for user session
  const userSession = localStorage.getItem("userSession");
  if (userSession) {
    try {
      const sessionData = JSON.parse(userSession);
      return sessionData.token || null;
    } catch {
      return null;
    }
  }
  
  return null;
};

// Helper function to make API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    // Enhanced error handling for network issues
    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error(`Failed to connect to API at ${API_BASE_URL}${endpoint}`);
      throw new Error(`Unable to connect to server. Please ensure the backend is running on ${API_BASE_URL}`);
    }
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone_num?: string;
    seller_account?: boolean;
  }) => apiRequest<{ message: string; email: string; token: string; seller_id?: number }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  login: async (data: { email: string; password: string }) =>
    apiRequest<{ message: string; token: string; email: string; seller_account: boolean }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  checkAccount: async (email: string, password: string) =>
    apiRequest<{ password: boolean; exists: boolean; is_seller?: boolean }>(`/auth/check_account/${email}/${password}`),
};

// Products API
export const productsAPI = {
  getAll: async (page = 0, size = 10) =>
    apiRequest<{
      content: any[];
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    }>(`/products?page=${page}&size=${size}`),

  getById: async (id: number) => apiRequest<any>(`/products/${id}`),

  create: async (data: any) =>
    apiRequest<any>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id: number, data: any) =>
    apiRequest<any>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ deleted: boolean }>(`/products/${id}`, { method: "DELETE" }),
};

// Categories API
export const categoriesAPI = {
  getAll: async () => apiRequest<any[]>("/categories"),

  getById: async (id: number) => apiRequest<any>(`/categories/${id}`),

  create: async (data: any) =>
    apiRequest<any>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id: number, data: any) =>
    apiRequest<any>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ deleted: boolean }>(`/categories/${id}`, { method: "DELETE" }),
};

// Cart API
export const cartAPI = {
  getAll: async () => apiRequest<any[]>("/carts"),

  getById: async (id: number) => apiRequest<any>(`/carts/${id}`),

  getByEmail: async (email: string) => apiRequest<any>(`/carts/user/${email}`),

  create: async (data: { email: string; totalPrice?: number; isActive?: boolean }) =>
    apiRequest<any>("/carts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id: number, data: any) =>
    apiRequest<any>(`/carts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ deleted: boolean }>(`/carts/${id}`, { method: "DELETE" }),

  // New Cart Sync endpoints
  sync: async (data: { email: string }) =>
    apiRequest<{ cart_id: number; email: string; total_price: number; item_count: number; synced: boolean }>(
      "/carts/sync",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  calculateTotal: async (id: number) =>
    apiRequest<{ cart_id: number; total_price: number; item_count: number }>(
      `/carts/${id}/calculate-total`,
      {
        method: "PUT",
      }
    ),
};

// Cart Products API
export const cartProductsAPI = {
  getAll: async () => apiRequest<any[]>("/cart-products"),

  getById: async (id: number) => apiRequest<any>(`/cart-products/${id}`),

  getByCartId: async (cartId: number) => apiRequest<any[]>(`/cart-products/cart/${cartId}`),

  addToCart: async (data: { variant_id: number; cart_id: number; quantity: number }) =>
    apiRequest<{ message: string; cart_product_id: number }>("/cart-products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuantity: async (data: { cart_id: number; variant_id: number; quantity: number }) =>
    apiRequest<{ message: string }>("/cart-products", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: async (id: number) =>
    apiRequest<{ message: string }>(`/cart-products/${id}`, {
      method: "DELETE",
    }),
};

// Orders API
export const ordersAPI = {
  getAll: async () => apiRequest<any[]>("/orders"),

  getWithProducts: async () => apiRequest<any[]>("/orders/with-products"),

  getById: async (id: number) => apiRequest<any>(`/orders/${id}`),

  getByEmail: async (email: string) => apiRequest<any[]>(`/orders/user/${email}`),

  create: async (data: any) =>
    apiRequest<any>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createFromCart: async (cartId: number, data: {
    address: string;
    phone_num?: string;
    payment_method?: string;
    order_status?: string;
    payment_status?: string;
    clear_cart?: boolean;
  }) =>
    apiRequest<{ message: string; order_id: number; total_price: number; order_status: string }>(
      `/orders/from-cart/${cartId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  update: async (id: number, data: any) =>
    apiRequest<any>(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ deleted: boolean }>(`/orders/${id}`, { method: "DELETE" }),
};

// Accounts API
export const accountsAPI = {
  getAll: async () => apiRequest<any[]>("/accounts"),

  getByEmail: async (email: string) => apiRequest<any>(`/accounts/${email}`),

  create: async (data: any) =>
    apiRequest<any>("/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (email: string, data: any) =>
    apiRequest<any>(`/accounts/${email}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (email: string) => apiRequest<{ deleted: boolean }>(`/accounts/${email}`, { method: "DELETE" }),
};

// Variants API
export const variantsAPI = {
  getAll: async () => apiRequest<any[]>("/variants"),

  getById: async (id: number) => apiRequest<any>(`/variants/${id}`),

  getByProductId: async (productId: number) => apiRequest<any[]>(`/variants/product/${productId}`),

  checkAvailability: async (id: number) => apiRequest<any>(`/variants/${id}/check-availability`),

  create: async (data: {
    productId: number;
    color?: string;
    size?: string;
    stockQuantity: number;
    price: number;
    sku?: string;
    isActive?: boolean;
  }) =>
    apiRequest<any>("/variants", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id: number, data: {
    productId?: number;
    color?: string;
    size?: string;
    stockQuantity?: number;
    price?: number;
    sku?: string;
    isActive?: boolean;
  }) =>
    apiRequest<any>(`/variants/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ message: string }>(`/variants/${id}`, { method: "DELETE" }),
};

// Images API
export const imagesAPI = {
  getAll: async () => apiRequest<any[]>("/images"),

  getById: async (id: number) => apiRequest<any>(`/images/${id}`),

  getByProductId: async (productId: number) => apiRequest<any[]>(`/images/product/${productId}`),

  create: async (data: any) =>
    apiRequest<any>("/images", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id: number, data: any) =>
    apiRequest<any>(`/images/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ message: string }>(`/images/${id}`, { method: "DELETE" }),
};

// Sellers API
export const sellersAPI = {
  getAll: async () => apiRequest<any[]>("/sellers"),

  getById: async (id: number) => apiRequest<any>(`/sellers/${id}`),

  create: async (data: any) =>
    apiRequest<any>("/sellers", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id: number, data: any) =>
    apiRequest<any>(`/sellers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ deleted: boolean }>(`/sellers/${id}`, { method: "DELETE" }),
};

// Admin Coupons API
export const couponsAPI = {
  getAll: async () => apiRequest<any[]>("/admin/coupons"),

  getActive: async () => apiRequest<any[]>("/admin/coupons/active"),

  getById: async (id: number) => apiRequest<any>(`/admin/coupons/${id}`),

  getByCode: async (code: string) => apiRequest<any>(`/admin/coupons/code/${code}`),

  create: async (data: {
    couponCode: string;
    description?: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    validFrom: string;
    validUntil: string;
    isActive?: boolean;
  }) =>
    apiRequest<any>("/admin/coupons", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: async (id: number, data: {
    couponCode?: string;
    description?: string;
    discountType?: "PERCENTAGE" | "FIXED";
    discountValue?: number;
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    usageLimit?: number;
    validFrom?: string;
    validUntil?: string;
    isActive?: boolean;
  }) =>
    apiRequest<any>(`/admin/coupons/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ message: string }>(`/admin/coupons/${id}`, { method: "DELETE" }),

  validate: async (code: string, cartTotal: number) =>
    apiRequest<{
      valid: boolean;
      coupon_code?: string;
      discount?: number;
      discount_type?: string;
      original_amount?: number;
      final_amount?: number;
      error?: string;
    }>(`/admin/coupons/validate/${code}`, {
      method: "POST",
      body: JSON.stringify({ cart_total: cartTotal }),
    }),
};

// Admin Activity Logging API
export const activityAPI = {
  getAll: async (page = 0, size = 20) =>
    apiRequest<{
      content: any[];
      totalElements: number;
      totalPages: number;
      size: number;
      number: number;
    }>(`/admin/activities?page=${page}&size=${size}`),

  getById: async (id: number) => apiRequest<any>(`/admin/activities/${id}`),

  getByAdminEmail: async (email: string, page = 0, size = 20) =>
    apiRequest<{
      content: any[];
      totalElements: number;
      totalPages: number;
    }>(`/admin/activities/admin/${email}?page=${page}&size=${size}`),

  getByEntityType: async (entityType: string) => apiRequest<any[]>(`/admin/activities/entity/${entityType}`),

  getByActionType: async (actionType: string) => apiRequest<any[]>(`/admin/activities/action/${actionType}`),

  log: async (data: {
    adminEmail: string;
    actionType: string;
    entityType: string;
    entityId?: number;
    description?: string;
  }) =>
    apiRequest<any>("/admin/activities", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  quickLog: async (data: {
    admin_email: string;
    action_type: string;
    entity_type: string;
    entity_id?: number;
    description?: string;
  }) =>
    apiRequest<any>("/admin/activities/quick-log", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: async (id: number) => apiRequest<{ message: string }>(`/admin/activities/${id}`, { method: "DELETE" }),
};

