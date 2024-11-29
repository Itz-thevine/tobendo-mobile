import { useBuyerCart } from "./useBuyerCart";
import { useBuyerExplore } from "./useBuyerExplore";
import { useBuyerOrders } from "./useBuyerOrders";


export type localBuyerContext = ReturnType<typeof useLocalBuyerContext> | undefined;
export const useLocalBuyerContext = () => {
    const explore = useBuyerExplore();
    const orders = useBuyerOrders();
    const cart = useBuyerCart();
    
    return {
        explore,
        orders,
        cart,
    };
}