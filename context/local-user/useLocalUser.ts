import { createContext, useContext } from "react";
import { localUserContext } from "./useLocalUserContext";

export const LocalUserContext = createContext<localUserContext>(undefined);
export const useLocalUser = () => {
    return useContext(LocalUserContext)
}