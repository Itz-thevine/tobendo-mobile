import { LocalSellerContext } from "./useLocalSeller";
import { useLocalSellerContext } from "./useLocalSellerContext";

type LocalSellerProviderProps = {
    children?: React.ReactNode;
}
export const LocalSellerProvider = (props: LocalSellerProviderProps) => {
    const context = useLocalSellerContext();

    return (
        <LocalSellerContext.Provider
            value={{...context}}
        >
            {props.children}
        </LocalSellerContext.Provider>
    )
}