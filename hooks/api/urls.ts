
// const __apiBaseUrl = process.env.EXPO_PUBLIC_BASE_URL;
// export const __apiBaseUrl = `http://10.0.2.2:7500`;
export const __apiBaseUrl = `http://44.201.129.126/api/v1`;
export const __apiUrls = {
    getAddresses: `${__apiBaseUrl}/address/`,

    createUser: `${__apiBaseUrl}/auth/users/`,
    getUser: `${__apiBaseUrl}/auth/me/`,
    resendOtp: `${__apiBaseUrl}/auth/resend-otp/`,
    verifyOtp: `${__apiBaseUrl}/auth/verify_otp/`,
    resetPassword: `${__apiBaseUrl}/auth/reset-password/`,
    signIn: `${__apiBaseUrl}/auth/token/`,
    
    addCompanyDetails: `${__apiBaseUrl}/seller/`,
    
    getUserProducts: `${__apiBaseUrl}/product/me/`,
    createUserProducts: `${__apiBaseUrl}/product/create/`,
    getCartItems: `${__apiBaseUrl}/cart/`,
    addItemToCart: `${__apiBaseUrl}/cart/`,
    removeCartItem: (cartId: string) => `${__apiBaseUrl}/cart/${cartId}`,
    checkoutCart: `${__apiBaseUrl}/checkout/checkout/`,
    
    getCustomerOrders: `${__apiBaseUrl}/order/`,
    getCustomerProducts: `${__apiBaseUrl}/customer-product/`,
    getProductSuggestions: `${__apiBaseUrl}/customer-product/`,
    
    getSellerOrders: `${__apiBaseUrl}/seller_order/`,

    getVehicleMakes: `${__apiBaseUrl}/techallience/brands/`,
    getVehicleModels: (brandId: number | string) => `${__apiBaseUrl}/techallience/models/${brandId}/`,
    getVehicleEngines: (brandId: number | string, modelId: number | string) => `${__apiBaseUrl}/techallience/engines/${brandId}/${modelId}`,
    searchSuggestions: (query?: string) => `${__apiBaseUrl}/techallience/auto-complete-suggestion/${query ?? ''}/`,
    getSubCategories: `${__apiBaseUrl}/techallience/get-sub-catogery/`,
    getPartLinkWithCar: (legacyArticleId: number | string) => `${__apiBaseUrl}/techallience/get-part-link-with-car/${legacyArticleId}/`,
    // createProduct: `${__apiBaseUrl}/techallience/product/`,
    getPartSuggestionDetails: `${__apiBaseUrl}/techallience/part-suggestion-deatils/`,
};