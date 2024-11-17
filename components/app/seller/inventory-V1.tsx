import { combineStyles, height, width } from '@/lib';
import { GlobalStyles } from '@/styles';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import TopSellerItemCard from './top-seller-item-card-V1';
import InventoryItemCard from './inventory-item-card';
import CustomModal from '@/components/shared/custom-modal';
import ProductSuggestion from './product-suggestion-list';
import { useGetUserProductsApi, userProductItem } from '@/hooks/api/user/getUserProducts';
import { partDetailsArticleItem, useGetPartSuggestionDetailsApi } from '@/hooks/api/vehicle/getPartSuggestionDetails';


const Inventory: React.FC = () => {
  const getPartDetailsApi = useGetPartSuggestionDetailsApi();
  const getPartDetailsResp = getPartDetailsApi.response;
  
  const getProductsApi = useGetUserProductsApi();
  const getProductsResp = getProductsApi.response;

  const [isProductListModal, setIsProductListModal] = useState(false)
  
  const renderTopSellerItem = ({ item, index }: { item: partDetailsArticleItem, index: number }) => (
    <TopSellerItemCard key={`${index}_${item?.legacyArticleId}`} item={item}/>
  );

  const renderInventoryItem = ({ item }: { item: userProductItem }) => (
    <InventoryItemCard item={item}/>
  );

  const topSellerItems = getPartDetailsResp.data?.articles;
  const productItems = getProductsResp.data?.result ?? [];

  useEffect(() => {
    getPartDetailsApi.trigger({
      page: 1,
      per_page: 10,
      lang: 'en',
      include_all: false,
      search_type: 99,
    });
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
      <View style={combineStyles(GlobalStyles)}>
          <ScrollView style={combineStyles(GlobalStyles, 'padding_sm')} showsVerticalScrollIndicator={false}>
              <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_b_sm')}>Top Sellers</Text>
              <FlatList
                  // data={inventoryData}
                  data={topSellerItems}
                  renderItem={renderTopSellerItem}
                  keyExtractor={(item) => `${item.legacyArticleId ?? ''}`}
                  horizontal
                  style={[combineStyles(GlobalStyles, 'margin_b_sm')]}
                  contentContainerStyle={[combineStyles(GlobalStyles, 'gap_xl')]}
                  showsHorizontalScrollIndicator={false}
              />
              <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_t_sm', 'margin_b_sm')}>Inventory</Text>
              <FlatList
                  data={productItems}
                  renderItem={renderInventoryItem}
                  keyExtractor={(item) => item.id ?? ''}
                  contentContainerStyle={[combineStyles(GlobalStyles, 'gap_xl')]}
              />
              {/* <View style={{width: '100%', height: 200}}></View> */}
          </ScrollView>
      </View>
      <View style={[combineStyles(GlobalStyles, 'background_white', 'padding_x_sm', 'padding_y_xs', 'fixed'), {top : -height * 0.25, width: width}]}>
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
