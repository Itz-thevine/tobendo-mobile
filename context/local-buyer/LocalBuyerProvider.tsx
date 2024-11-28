import { LocalBuyerContext } from "./useLocalBuyer";
import { useLocalBuyerContext } from "./useLocalBuyerContext";

type LocalBuyerProviderProps = {
    children?: React.ReactNode;
}
export const LocalBuyerProvider = (props: LocalBuyerProviderProps) => {
    const context = useLocalBuyerContext();

    return (
        <LocalBuyerContext.Provider
            value={{...context}}
        >
            {props.children}
        </LocalBuyerContext.Provider>
    )
}