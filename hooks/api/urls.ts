
// const __apiBaseUrl = process.env.EXPO_PUBLIC_BASE_URL;
// export const __apiBaseUrl = `http://10.0.2.2:7500`;
export const __apiBaseUrl = `http://44.201.129.126/api/v1`;
export const __apiUrls = {
    createUser: `${__apiBaseUrl}/auth/users/`,
    resendOtp: `${__apiBaseUrl}/auth/resend-otp/`,
    verifyOtp: `${__apiBaseUrl}/auth/verify_otp/`,
    resetPassword: `${__apiBaseUrl}/auth/reset-password/`,
    signIn: `${__apiBaseUrl}/auth/token/`,
    
    addCompanyDetails: `${__apiBaseUrl}/seller/`,
    
    getCustomerOrders: `${__apiBaseUrl}/order/`,
    getUserProducts: `${__apiBaseUrl}/product/me/`,

    getVehicleMakes: `${__apiBaseUrl}/techallience/brands/`,
    getVehicleModels: (brandId: number | string) => `${__apiBaseUrl}/techallience/models/${brandId}/`,
    getVehicleEngines: (brandId: number | string, modelId: number | string) => `${__apiBaseUrl}/techallience/engines/${brandId}/${modelId}`,
    searchSuggestions: (query?: string) => `${__apiBaseUrl}/techallience/auto-complete-suggestion/${query ?? ''}/`,
    getSubCategories: `${__apiBaseUrl}/techallience/get-sub-catogery/`,
    createProduct: `${__apiBaseUrl}/techallience/product/`,
};