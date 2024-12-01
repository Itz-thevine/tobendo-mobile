import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, ImageSourcePropType } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import { useGetSubCategoriesApi } from '@/hooks/api/vehicle/getSubCategories';
import { useLocalBuyer } from '../../../context/local-buyer/useLocalBuyer';
import { router } from 'expo-router';

interface SubCategoryItemProps {
    image?: ImageSourcePropType
  category: string;
  parentNodeId?: number;
  hasChilds?: boolean;
  isOpen: boolean;
  onPress: () => void;
}

const SubCategoryItem: React.FC<SubCategoryItemProps> = (props: SubCategoryItemProps) => {
  const exploreHook = useLocalBuyer()?.explore;
  const [heightAnim] = useState(new Animated.Value(0));
  const getSubCateogriesApi = useGetSubCategoriesApi();
  const getResp = getSubCateogriesApi.response;
  const subCategories = (getResp.data?.data?.array || [])?.slice(0, 10);

  useEffect(() => {
    if(props?.hasChilds && props.parentNodeId){
      getSubCateogriesApi.trigger({
        parent_node_id: props.parentNodeId,
      });
    }
  }, []);
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: props.isOpen ? subCategories?.length * 30 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [props.isOpen, subCategories?.length , heightAnim]);
  
  return (
    <View style={styles.categoryItem}>
      <TouchableOpacity onPress={props.onPress} style={styles.categoryHeader}>
        <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
          {
            props.image && (
              <Image source={props.image} style={{height: 40, width: 40, marginRight: 10}} resizeMode="contain" />
            )
          }
            <Text style={styles.categoryText}>{props.category}</Text>
        </View>
        <MaterialIcon name={props.isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} color="#888" />
      </TouchableOpacity>
      <Animated.View style={{ overflow: 'hidden', height: heightAnim }}>
        {subCategories?.map((subCategory, i) => (
          <TouchableOpacity
            key={`${i}_${subCategory.assemblyGroupNodeId}`}
            onPress={() => {
              exploreHook?.updateFilters({
                searchQuery: subCategory.assemblyGroupName,
              });
              router.push('/(customer)/explore');
            }}
          >
            <Text style={styles.subCategoryText}>{subCategory.assemblyGroupName}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItem: {
    marginBottom: 10,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
  },
  subCategoryText: {
    fontSize: 14,
    color: '#888',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default SubCategoryItem;
