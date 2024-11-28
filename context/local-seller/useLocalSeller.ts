import { createContext, useContext } from "react";
import { localSellerContext } from "./useLocalSellerContext";

export const LocalSellerContext = createContext<localSellerContext>(undefined);
export const useLocalSeller = () => {
    return useContext(LocalSellerContext)
}