import { useSellerInventory } from "./useSellerInventory";


export type localSellerContext = ReturnType<typeof useLocalSellerContext> | undefined;
export const useLocalSellerContext = () => {
    const inventory = useSellerInventory();
    
    return {
        inventory,
    };
}