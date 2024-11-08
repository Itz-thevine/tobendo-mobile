import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGetSubCategoriesApi } from '@/hooks/api/vehicle/getSubCategories';
import SubCategoryItem from './sub-category-item';


const SubCategoryItems = () => {
  const [openCategoryName, setOpenCategoryName] = useState<string | undefined>(undefined);
  const getSubCateogriesApi = useGetSubCategoriesApi();
  const getResp = getSubCateogriesApi.response;
  const items = getResp.data?.data?.array?.slice(0, 10);
  
  const handlePress = (categoryName: string) => {
    setOpenCategoryName(prev => (prev === categoryName ? undefined : categoryName));
  };

  useEffect(() => {
    getSubCateogriesApi.trigger();
  }, []);

  return (
    <View style={styles.categoryContainer}>
      {
        getResp.loading === false ?
        <>
          {
            items?.map((item, i) => {
              return (
                <SubCategoryItem
                  key={`${i}_${item.assemblyGroupNodeId}`}
                  // image={icon}
                  category={item.assemblyGroupName}
                  parentNodeId={item.assemblyGroupNodeId}
                  hasChilds={item?.hasChilds}
                  isOpen={openCategoryName === item.assemblyGroupName}
                  onPress={() => {
                    handlePress(item.assemblyGroupName);
                  }}
                />
              )
            })
          }
        </> :
        getResp.loading ? <Text>Loading...</Text> :
        <></>
      }
   </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    margin: 20,
    marginBottom: 0,
  },
});

export default SubCategoryItems;