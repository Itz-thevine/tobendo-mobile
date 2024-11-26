import AsyncStorage from "@react-native-async-storage/async-storage";

export type localUser = {
    user_id?: string;
    access_token?: string;
    email?: string;
    isSeller?: boolean;
}
const __localUserStorageKey = 'user';
export const setLocalUser = (localUser: localUser) => {
    const doThis = async (localUser: localUser) => {
        await AsyncStorage.setItem(__localUserStorageKey, JSON.stringify(localUser));
    };
    doThis(localUser);
}
export const updateLocalUser = (localUser: Partial<localUser>) => {
    const newLocalUser: localUser = {
        ...getLocalUser(),
        ...localUser,
    }
    setLocalUser(newLocalUser);
}
export const getLocalUser = () => {
    let storedUser: localUser | undefined;

    const doThis = async () => {
        const stringifiedUser = await AsyncStorage.getItem(__localUserStorageKey);
        storedUser = (stringifiedUser ? JSON.parse(stringifiedUser) : undefined) as localUser | undefined;
    };
    doThis();

    return storedUser;
}
export const unsetLocalUser = () => {
    const doThis = async () => {
        await AsyncStorage.removeItem(__localUserStorageKey);
    };
    doThis();
}