
// const __apiBaseUrl = process.env.EXPO_PUBLIC_BASE_URL;
export const __apiBaseUrl = `http://10.0.2.2:7500`;
export const __apiUrls = {
    getVehicleMakes: `${__apiBaseUrl}/techallieance/brands/`,
    getVehicleModels: (brandId: number | string) => `${__apiBaseUrl}/techallieance/models/${brandId}/`,
    getVehicleEngines: (brandId: number | string, modelId: number | string) => `${__apiBaseUrl}/techallieance/engines/${brandId}/${modelId}`,
    searchSuggestions: (query?: string) => `${__apiBaseUrl}/techallieance/auto-complete-suggestion/${query ?? ''}/`,
    getSubCategories: `${__apiBaseUrl}/techallieance/get-sub-catogery/`,
    createProduct: `${__apiBaseUrl}/techallieance/product/`,
};