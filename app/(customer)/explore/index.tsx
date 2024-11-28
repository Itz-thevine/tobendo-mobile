import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import CustomerAppHeader from '@/components/shared/customers-app-header';
import SearchBar from '@/components/app/customer/search-bar';
import CustomModal from '@/components/shared/custom-modal';
import Filter from '@/components/shared/filter';
import Sort from '@/components/shared/sort';
import ProductCard from '@/components/app/customer/product-card-4';
import { useLocalUser } from '@/context/local-user/useLocalUser';
import { useScroll } from '@/hooks/useScroll';
import { productSortOrder } from '@/context/local-buyer/useBuyerExplore';

const ExploreScreen: React.FC = () => {
  const scrollHook = useScroll();
  const hook = useLocalUser()?.buyerExplore;
  const loading = hook?.loading;
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);


  const brands = ['Mercedes', 'BMW', 'Nissan', 'Fiat', 'Mazda', 'Hyundai', 'Audi', 'Alfa Romeo', 'Kia', 'Ford', 'Opel'];
  // const sortValues = ['Price: Low to High', 'Price: High to Low'];
  const sortValues: Record<productSortOrder, string> = {
    asc: `Low to High`,
    desc: `High to Low`,
  };

  useEffect(() => {
    if(scrollHook.hasReachedEnd !== false){
      hook?.getProducts();
    }
  }, [scrollHook.key]);
  
  return (
    <SafeAreaView style={combineStyles(GlobalStyles, 'safeArea')}>
      
      <CustomModal
        isVisible={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title='Filter'
      >
        <ScrollView style={combineStyles(GlobalStyles, 'padding_xs')}>
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_medium')}>Price</Text>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            
              <View style={combineStyles(GlobalStyles, 'flex_row', 'margin_t_xs', 'gap_sm', 'jusify_between', 'margin_b_sm')}>
                <View style={[combineStyles(GlobalStyles, 'flex_row', 'border_xs', 'padding_xs', 'rounded_full', 'border_soft_gray'), {width: '48%'}]}>
                  <Text style={[combineStyles(GlobalStyles, 'color_gray'), {marginTop: 5}]}>From</Text>
                  <TextInput
                    style={combineStyles(GlobalStyles, 'text_sm', 'margin_l_xs')}
                    value={`${hook?.filters?.minPrice ?? ''}`}
                    onChangeText={(value) => {
                      hook?.updateFilters({
                        minPrice: value ? parseInt(value) : undefined,
                      });
                    }}
                  />
                </View>

                <View style={[combineStyles(GlobalStyles, 'flex_row', 'border_xs', 'padding_xs', 'rounded_full', 'border_soft_gray'), {width: '48%'}]}>
                  <Text style={[combineStyles(GlobalStyles, 'color_gray'),  {marginTop: 5}]}>to</Text>
                  <TextInput
                    style={combineStyles(GlobalStyles, 'margin_l_xs')}
                    value={`${hook?.filters.maxPrice ?? ''}`}
                    onChangeText={(value) => {
                      hook?.updateFilters({
                        maxPrice: value ? parseInt(value) : undefined,
                      });
                    }}
                  />
                </View>
              </View>

              <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
                <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_medium', 'margin_b_sm')}>Brand</Text>
                {brands.map((brand, index) => (
                  <TouchableOpacity 
                    style={combineStyles(GlobalStyles, 'flex_row', 'items_center', 'margin_b_xs')}
                    onPress={() => {
                      hook?.updateFilters({
                        brand,
                      });
                    }} 
                    key={index}
                  >
                    <View style={[combineStyles(GlobalStyles, "border_xs", 'rounded_full', 'border_gray', 'items_center', 'jusify_center'), {height: 20, width: 20}]}>
                      <View style={ hook?.filters.brand === brand && [combineStyles(GlobalStyles, 'background_dark_blue', 'rounded_full'), {width: 12, height: 12}]}></View>
                    </View>
                    <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_l_sm')}>{brand}</Text>
                  </TouchableOpacity>
                ))}
              </View>

          </View>
          <View style={{width: "100%", height: 100}}></View>
        </ScrollView>
        <View style={combineStyles(GlobalStyles, 'absolute', 'background_white', 'bottom_0', 'right_0', 'left_0', 'padding_y_xs', 'padding_x_sm' )}>
          <TouchableOpacity style={combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm')} onPress={() => {
            //  setcurrentDisplay(1)
            setIsFilterModalOpen(false)
            
            }}>
            <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Apply</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
      <CustomModal
        isVisible={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        title='Sort'
      >
        <ScrollView style={combineStyles(GlobalStyles, 'padding_sm')}>
            <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
                <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_medium', 'margin_b_sm')}>Sort By</Text>
                {Object.entries(sortValues).map(([sortOrder, sortValue], index) => (
                  <TouchableOpacity 
                    style={combineStyles(GlobalStyles, 'flex_row', 'items_center', 'margin_b_xs')}
                    onPress={() => {
                      hook?.updateFilters({
                        sortOrder: sortOrder as productSortOrder,
                      });
                    }} 
                    key={index}
                  >
                    <View style={[combineStyles(GlobalStyles, "border_xs", 'rounded_full', 'border_gray', 'items_center', 'jusify_center'), {height: 20, width: 20}]}>
                      <View style={ hook?.filters.sortOrder === sortOrder && [combineStyles(GlobalStyles, 'background_dark_blue', 'rounded_full'), {width: 12, height: 12}]}></View>
                    </View>
                    <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_l_sm')}>{sortValue}</Text>
                  </TouchableOpacity>
                ))}
              </View>

        </ScrollView>
        <View style={combineStyles(GlobalStyles, 'absolute', 'background_white', 'bottom_0', 'right_0', 'left_0', 'padding_y_xs', 'padding_x_sm' )}>
          <TouchableOpacity style={combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm')} onPress={() => {
            setIsSortModalOpen(false)
            // setcurrentDisplay(2)
          }}>
            <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Apply</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>

      <CustomerAppHeader />
      <ScrollView
        style={combineStyles(GlobalStyles, 'background_softer_blue')}
        onScroll={scrollHook.handleScroll}
      >
        <View style={combineStyles(GlobalStyles, 'background_dark_blue', 'margin_b_sm')}>
          <SearchBar
            autoFocus
            onChangeText={(searchQuery) => {
              hook?.updateFilters({
                searchQuery,
              });
            }}
          />
        </View>

        <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between', 'margin_sm', 'margin_b_sm')}>
          <Filter onPress={() => setIsFilterModalOpen(true)}/>
          <Sort onPress={() => setIsSortModalOpen(true)}/>
        </View>
      
        <View style={styles.manufacturerContainer}>
          <View style={[combineStyles(GlobalStyles, 'gap_xl')]}>
            {
              hook?.data?.map((item, i) => {
                return (
                  <ProductCard
                    key={`${i}_${item.product_id}`}
                    item={item}
                  />
                )
              })
            }
          </View>
          {
            loading ?
            <ActivityIndicator style={{margin: 35, marginLeft: 0, marginRight: 0,}} /> : <></>
          }
        </View>

        {/* <RelatedProductsWrapper 
          openCategory={openCategory}
          handlePress={handlePress}
          renderInventoryItem={renderInventoryItem}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  manufacturerContainer: {
    margin: 20,
  },
});

export default ExploreScreen;
