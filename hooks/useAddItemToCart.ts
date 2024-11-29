import { useEffect } from "react";
import { useLocalBuyer } from "../context/local-buyer/useLocalBuyer";
import { useAddItemToCartApi } from "./api/user-cart/addItemToCart";

export const useAddItemToCart = () => {
    const cartHook = useLocalBuyer()?.cart;

    const addItemApi = useAddItemToCartApi();
    const addItemResp = addItemApi.response;

    const add = (productId: string, quantity: number) => {
        addItemApi.trigger({
          product_id: `${productId}`,
          quantity,
        });
    }
    useEffect(() => {
        if(addItemResp.loading === false && addItemResp.success){
            //update cart;
            cartHook?.get();
        }
    }, [addItemResp.loading]);

    return {
        loading: addItemResp.loading,
        success: addItemResp.success,
        error: addItemResp.error,
        add,
    };
}