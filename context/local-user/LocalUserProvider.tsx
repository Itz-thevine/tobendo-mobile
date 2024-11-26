import { LocalUserContext } from "./useLocalUser";
import { useLocalUserContext } from "./useLocalUserContext";

type LocalUserProviderProps = {
    children?: React.ReactNode;
}
export const LocalUserProvider = (props: LocalUserProviderProps) => {
    const context = useLocalUserContext();

    return (
        <LocalUserContext.Provider
            value={{...context}}
        >
            {props.children}
        </LocalUserContext.Provider>
    )
}