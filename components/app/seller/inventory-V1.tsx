import { combineStyles, height, width } from '@/lib';
import { GlobalStyles } from '@/styles';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import TopSellerItemCard from './top-seller-item-card-V1';
import InventoryItemCard from './inventory-item-card';
import CustomModal from '@/components/shared/custom-modal';
import ProductSuggestion from './product-suggestion-list';
import { useGetUserProductsApi } from '@/hooks/api/user/getUserProducts';
import { customerProductItem } from '@/hooks/api/user/getCustomerProducts';


const Inventory: React.FC = () => {
  // const getTopSellerProductsApi = useGetCustomerProductsApi();
  // const getTopSellerProductsResp = getTopSellerProductsApi.response;
  
  const getProductsApi = useGetUserProductsApi();
  const getProductsResp = getProductsApi.response;

  const [isProductListModal, setIsProductListModal] = useState(false)
  
  const renderTopSellerItem = ({ item, index }: { item: customerProductItem, index: number }) => (
    <TopSellerItemCard key={`${index}_${item?.legacyArticleId}`} item={item}/>
  );

  // const topSellerItems = getTopSellerProductsResp.data?.result;
  const productItems = getProductsResp.data?.result ?? [];
  const topProductItems = productItems.slice(0, 10);
  
  useEffect(() => {
    // getTopSellerProductsApi.trigger({
    //   page: 1,
    //   page_size: 10,
    // });
    getProductsApi.trigger({
      page: 1,
      page_size: 10,
    });
  }, []);
  
  return (
    <SafeAreaView style={[combineStyles(GlobalStyles, 'relative', 'background_softer_blue'), { height: height}]}>
      <CustomModal
          isVisible={isProductListModal}
          onClose={() => setIsProductListModal(false)}
      >
          <View style={combineStyles(GlobalStyles, 'padding_y_xs')}>
              <ProductSuggestion setIsVisible={setIsProductListModal}/>
          </View>
      </CustomModal>
      <ScrollView style={combineStyles(GlobalStyles, 'padding_sm')} showsVerticalScrollIndicator={false}>
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_b_sm')}>Top Products</Text>
          <FlatList
              // data={inventoryData}
              data={topProductItems}
              renderItem={renderTopSellerItem}
              keyExtractor={(item, i) => `${i}_${item.product_id ?? ''}`}
              horizontal
              style={[combineStyles(GlobalStyles, 'margin_b_sm')]}
              contentContainerStyle={[combineStyles(GlobalStyles, 'gap_xl')]}
              showsHorizontalScrollIndicator={false}
          />
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_t_sm', 'margin_b_sm')}>Inventory</Text>
          <FlatList
              data={productItems}
              renderItem={({item, index: i}) => (
                <InventoryItemCard
                  key={`${i}_${item.product_id ?? ''}`}
                  item={item}
                />
              )}
              keyExtractor={(item, i) => `${i}_${item.product_id ?? ''}`}
              contentContainerStyle={[combineStyles(GlobalStyles, 'gap_xl')]}
          />
          <View style={{width: '100%', height: 200}}></View>
      </ScrollView>
      <View style={[combineStyles(GlobalStyles, 'background_white', 'padding_x_sm', 'padding_y_xs', 'fixed'), {top : height * -0.18, width: width}]}>
        <TouchableOpacity 
          style={combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm')} 
          onPress={() =>setIsProductListModal(true)}
        >
            <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Add New Inventory</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};



export default Inventory;
