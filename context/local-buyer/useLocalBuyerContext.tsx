import { useBuyerExplore } from "./useBuyerExplore";


export type localBuyerContext = ReturnType<typeof useLocalBuyerContext> | undefined;
export const useLocalBuyerContext = () => {
    const explore = useBuyerExplore();
    
    return {
        explore,
    };
}