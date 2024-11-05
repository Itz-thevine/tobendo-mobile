
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

    getVehicleMakes: `${__apiBaseUrl}/techallieance/brands/`,
    getVehicleModels: (brandId: number | string) => `${__apiBaseUrl}/techallieance/models/${brandId}/`,
    getVehicleEngines: (brandId: number | string, modelId: number | string) => `${__apiBaseUrl}/techallieance/engines/${brandId}/${modelId}`,
    searchSuggestions: (query?: string) => `${__apiBaseUrl}/techallieance/auto-complete-suggestion/${query ?? ''}/`,
    getSubCategories: `${__apiBaseUrl}/techallieance/get-sub-catogery/`,
    createProduct: `${__apiBaseUrl}/techallieance/product/`,
};