import { useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export const useScroll = () => {
    const [states, setStates] = useState({
        hasReachedEnd: undefined as boolean | undefined,
        key: '',
    });
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const newStates = {...states};
        newStates.key = `${Date.now()}`;
        newStates.hasReachedEnd = false;

        const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;

        // Check if the user is 50 pixels from the bottom
        if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - 100
        ) {
            newStates.hasReachedEnd = true;
        }

        if(newStates.hasReachedEnd !== states.hasReachedEnd) setStates({...newStates});
    };
    return {
        ...states,
        handleScroll,
    };
}