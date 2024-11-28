import { createContext, useContext } from "react";
import { localBuyerContext } from "./useLocalBuyerContext";

export const LocalBuyerContext = createContext<localBuyerContext>(undefined);
export const useLocalBuyer = () => {
    return useContext(LocalBuyerContext)
}