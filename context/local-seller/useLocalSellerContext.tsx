import { useSellerInventory } from "./useSellerInventory";
import { useSellerOrders } from "./useSellerOrders";


export type localSellerContext = ReturnType<typeof useLocalSellerContext> | undefined;
export const useLocalSellerContext = () => {
    const inventory = useSellerInventory();
    const orders = useSellerOrders();
    
    return {
        inventory,
        orders,
    };
}