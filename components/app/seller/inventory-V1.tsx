import { combineStyles, height, width } from '@/lib';
import { GlobalStyles } from '@/styles';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import TopSellerItemCard from './top-seller-item-card-V1';
import InventoryItemCard from './inventory-item-card';
import CustomModal from '@/components/shared/custom-modal';
import ProductSuggestion from './product-suggestion-list';
import { customerProductItem } from '@/hooks/api/user/getCustomerProducts';
import { useScroll } from '@/hooks/useScroll';
import { useLocalSeller } from '@/context/local-seller/useLocalSeller';


const Inventory: React.FC = () => {
  const scrollHook = useScroll();
  const hook = useLocalSeller()?.inventory;
  const productsLoading = hook?.loading;

  const [isProductListModal, setIsProductListModal] = useState(false)
  
  const renderTopSellerItem = ({ item, index }: { item: customerProductItem, index: number }) => (
    <TopSellerItemCard key={`${index}_${item?.legacyArticleId}`} item={item}/>
  );

  // const topSellerItems = getTopSellerProductsResp.data?.result;
  const productItems = hook?.data ?? [];
  const topProductItems = productItems.slice(0, 10);

  useEffect(() => {
    if(scrollHook.hasReachedEnd !== false){
      hook?.getProducts();
    }
  }, [scrollHook.key]);
  
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
      <ScrollView
        style={combineStyles(GlobalStyles, 'padding_sm')} showsVerticalScrollIndicator={false}
        onScroll={scrollHook.handleScroll}
      >
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
          {
            productsLoading ?
            <ActivityIndicator /> :
            !topProductItems.length ?
            <Text style={{textAlign: 'center'}}>no items</Text> :
            <></>
          }
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_t_sm', 'margin_b_sm')}>Inventory</Text>
          <View style={[combineStyles(GlobalStyles, 'gap_xl')]}>
            {
              productItems.length ?
              <>
                {
                  productItems.map((item, i) => {
                    return (
                      <InventoryItemCard
                        key={`${i}_${item.product_id ?? ''}`}
                        item={item}
                      />
                    )
                  })
                }
              </> :
              <></>
            }
          </View>
          {
            productsLoading ?
            <ActivityIndicator /> :
            !productItems.length ?
            <Text style={{textAlign: 'center'}}>no items</Text> :
            <></>
          }
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
