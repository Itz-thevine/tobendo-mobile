import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';

type FakeSearchBarProps = {
  onPress?: () => void;
}
const FakeSearchBar = (props: FakeSearchBarProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[combineStyles(GlobalStyles, 'margin_sm', 'flex_row', 'items_center', 'padding_x_sm', 'rounded_lg', 'border_sm', 'border_soft_gray'), styles.searchBar]}
    >
      <Text
        style={combineStyles(GlobalStyles, 'color_gray', 'safeArea')}
      >Search Part Name or Number</Text>
      <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#33384C',
    paddingTop: 15,
    paddingBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
});

export default FakeSearchBar;
