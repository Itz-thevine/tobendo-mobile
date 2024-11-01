import { DynamicObject } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import { StyleSheet, TextStyle, ViewStyle, ImageStyle } from 'react-native';

export const { width, height } = Dimensions.get('window');

export const getGreeting = () => {
    
    const currentHour = new Date().getHours();
  
    if (currentHour < 12) {
      return 'Good Morning 👋';
    } else if (currentHour < 18) {
      return 'Good Afternoon 👋';
    } else {
      return 'Good Evening 👋';
    }
}
  
export const storeData = async (key: string, value: DynamicObject): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Error storing data", e);
  }
};

export const getData = async (key: string): Promise<DynamicObject | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error retrieving data", e);
    return null;
  }
};


type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };
export const combineStyles = <T extends NamedStyles<T>>(
  styleSheet: T,
  ...styles: (keyof T)[]
): ViewStyle | TextStyle | ImageStyle => {
  return styles.map(style => styleSheet[style]).reduce((acc, style) => {
    return { ...acc, ...style };
  }, {});
};

/**
 * Builds a query string from the provided parameters object.
 *
 * This function accepts an object where the keys are parameter names and values are parameter values.
 * It constructs a URL-encoded query string, ignoring parameters that have `undefined`, `null`, or empty string values.
 *
 * @param {Object} params - The parameters object containing key-value pairs to be turned into a query string.
 * @param {string | number | boolean | any} params[key] - The value of the query parameter. It can be a string, number, or any value that can be converted to a string.
 *
 * @returns {string} - A URL-encoded query string constructed from the provided parameters.
 *
 * @example
 * const params = { name: 'John', age: 30, city: '' };
 * const queryString = buildQueryParams(params);
 * console.log(queryString); // Output: 'name=John&age=30'
 */
export const buildQueryParams = (params: { [key: string]: any }) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value.toString());
    }
  });

  return queryParams.toString();
};