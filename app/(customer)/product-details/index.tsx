import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { combineStyles, width, height } from '@/lib';
import { GlobalStyles } from '@/styles';
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomerAppHeader from '@/components/shared/customers-app-header';
import Counter from '@/components/shared/counter';
import SearchBar from '@/components/app/customer/search-bar';
import FAIcon from "react-native-vector-icons/FontAwesome"
import ProductCard2 from '@/components/app/customer/product-card-2';
import { inventoryData } from '@/static';
import { InventoryItem } from '@/types';
import { router } from 'expo-router';

const ProductDetailsScreen: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [count, setCount] = useState<number>(1);

  const relatedProducts = [
    { id: '1', image: require('@/assets/images/castrol.png'), title: 'QUARTZ INEO FIRST 0W-30', price: '$13.00' },
    { id: '2', image: require('@/assets/images/castrol.png'), title: 'QUARTZ INEO FIRST 5W-40', price: '$13.00' },
    { id: '3', image: require('@/assets/images/castrol.png'), title: 'QUARTZ INEO FIRST 10W-60', price: '$13.00' },
  ];

  const renderRelatedProduct = ({ item }: { item: InventoryItem }) => (
    <ProductCard2 item={item}/>
  );

  return (
    <SafeAreaView style={combineStyles(GlobalStyles, 'safeArea')}>
        <CustomerAppHeader />
        <ScrollView style={combineStyles(GlobalStyles, 'background_softer_blue')}>
          <View style={combineStyles(GlobalStyles, 'background_dark_blue')}>
            <SearchBar />
          
            <View style={combineStyles(GlobalStyles, 'background_white', 'padding_sm', 'margin_sm', 'rounded_xs')}>
              <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between')}>
                <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
                  <MCIIcon name="car-side" size={24} color={"blue"}/>
                  <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_bold' ,'margin_l_xs')}>Mercedes</Text>
                </View>
                <TouchableOpacity>
                  <Image
                      source={require('../../../assets/images/seller/rect1499.png')}
                      style={[{ width: 20, height: 20 }]}
                      resizeMode='contain'
                  />  
                </TouchableOpacity>
              </View>
              <Text style={combineStyles(GlobalStyles, 'margin_t_sm', 'text_lg')}>S-Class 2.0 CDTI DIESEL</Text>
              <Text style={combineStyles(GlobalStyles, 'margin_t_xs')}>(165 HP / 121 KW, YEAR FROM 2013 - 2023)</Text>
            </View>
          </View>


            {/* Compatibility Notification */}
            <View style={combineStyles(GlobalStyles, 'background_soft_blue', 'padding_sm', 'flex_row', 'items_center', 'gap_sm')}>
              <View>
                <FAIcon name="check-circle" size={20} color={'#51D4A5'}/>
              </View>
            <Text style={combineStyles(GlobalStyles)}>This Product is compatible with your vehicle!</Text>
            </View>

            {/* Product Image */}
            <View style={combineStyles(GlobalStyles, 'background_white')}>
              <Image source={require('@/assets/images/seller/image 5.png')} style={styles.productImage} resizeMode="contain" />
            </View>

            {/* Product Details */}
            <View style={combineStyles(GlobalStyles, 'margin_sm', )}>
              <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center', 'gap_sm', 'margin_b_xs')}>
                <Image source={require('@/assets/images/seller/image 6.png')} style={{height: 40, width: 50}} resizeMode="contain" />
                <Text style={styles.productBrand}>Total Energies</Text>
              </View>
            <Text style={styles.productTitle}>QUARTZ INEO FIRST 0W-30</Text>
            <Text style={combineStyles(GlobalStyles, 'color_gray')}>5 L - ref. 214178 - Engine oil</Text>
            <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_b_sm')}>Delivery: Sat 1 May</Text>

            <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
              <View style={combineStyles(GlobalStyles,  'flex_row', 'jusify_between', 'margin_b_xs')}>
                <Text style={styles.productDetailItem}>Point: Product Detail</Text>
                <Text style={combineStyles(GlobalStyles, 'color_gray' )}>Details</Text>
              </View>
            </View>

           <View style={combineStyles(GlobalStyles, 'items_center', 'margin_t_sm')}> 
              <TouchableOpacity style={combineStyles(GlobalStyles, 'background_soft_blue', 'items_center', 'rounded_full', 'padding_x_sm', 'padding_y_xs' )} > 
                  <Text style={combineStyles(GlobalStyles, 'text_lg')}>More</Text>
              </TouchableOpacity>
            </View>
            </View>

            {/* Product Description */}
            <View style={combineStyles(GlobalStyles, 'padding_sm')}>
            <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_b_sm')}>Product Description</Text>
            <Text style={combineStyles(GlobalStyles, 'line_lg')}>
               Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Text>
            </View>

            {/* Get in Touch */}
            <View style={[combineStyles(GlobalStyles, 'background_dark_blue', 'padding_sm', 'flex_row', 'jusify_between'), {paddingVertical: 50}]}>
              <Text style={[combineStyles(GlobalStyles, 'color_white', 'text_3xl',) ,  {width:"50%"}]}>Need help with this product?</Text>
              <TouchableOpacity style={[combineStyles(GlobalStyles, 'background_warning', 'items_center', 'jusify_center', 'rounded_full', 'padding_x_sm'), {width: "40%"}]}>
                  <Text style={combineStyles(GlobalStyles, 'color_white', 'text_3xl')}>Get in Touch</Text>
              </TouchableOpacity>
            </View>

            {/* Related Products */}
            <View style={combineStyles(GlobalStyles, 'padding_sm')}>
              <Text style={combineStyles(GlobalStyles, 'text_lg', 'margin_b_sm')}>You Might Also Like</Text>
              <FlatList
                data={inventoryData}
                renderItem={renderRelatedProduct}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[combineStyles(GlobalStyles, 'gap_xl')]}
              />
            </View>

            {/* Footer */}
            <View style={{
              width: "100%", height:200
            }}>

            </View>
        </ScrollView>

         {/* footer */}
        <View style={combineStyles(GlobalStyles, 'absolute', 'background_white', 'bottom_0', 'right_0', 'left_0', 'padding_y_xs', 'padding_x_sm' )}>
            <View style={[combineStyles(GlobalStyles, 'flex_row', 'margin_t_xs', 'jusify_between', 'safeArea', 'margin_r_xs', 'margin_l_xs', 'margin_b_xs')]}>
                <View style={combineStyles(GlobalStyles, 'flex_row')}>
                    <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs')}>{'$'}</Text>
                    <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs', 'font_bold')}>{'4,955'}</Text>
                </View>
                <View style={[combineStyles(GlobalStyles)]}>
                    <Counter count={count} setCount={setCount}/>
                </View>
        
            </View>
            <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between')}>
                <TouchableOpacity style={[combineStyles(GlobalStyles, 'border_royal_blue', 'border_sm', 'padding_t_xs', 'padding_b_xs', 'rounded_full', 'items_center', 'padding_x_xs', 'flex_row'), {width: "38%"}]}>
                    <Image
                        source={require('@/assets/images/Group 28.png')}
                        style={[{ height: 16 }]}
                        resizeMode='contain'
                    />
                    <Text style={combineStyles(GlobalStyles, 'text_lg', 'margin_l_xs', 'margin_r_xs')}>Add To Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_xs'), {width: '58%'}]} onPress={() => {
                    router.push('/cart')
                    
                    }}>
                    <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Apply</Text>
                </TouchableOpacity>

            </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1a1a1a',
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#333',
    color: '#fff',
  },
  cartContainer: {
    position: 'relative',
    marginLeft: 15,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#f00',
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  vehicleInfoContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
  },
  vehicleInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  vehicleInfoDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  compatibilityContainer: {
    backgroundColor: '#e0f7e7',
    padding: 10,
    alignItems: 'center',
  },
  compatibilityText: {
    color: '#00a152',
    fontWeight: 'bold',
  },
  productImage: {
    width: width * 0.8,
    height: height * 0.3,
    alignSelf: 'center',
    marginVertical: 20,
  },

  productBrand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  productSubtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  productDelivery: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  productDetailsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  productDetailItem: {
    fontSize: 14,
    color: '#333',
  },
  productDetailLink: {
    fontSize: 14,
    color: '#007bff',
  },
  moreButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  moreButtonText: {
    fontSize: 16,
    color: '#007bff',
    textTransform: 'uppercase',
  },
  productDescriptionContainer: {
    padding: 15,
    marginTop: 10,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  productDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDescriptionText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  getInTouchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  getInTouchText: {
    fontSize: 16,
    color: '#333',
  },
  getInTouchButton: {
    backgroundColor: '#ffa726',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
  },
  getInTouchButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  relatedProductsContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  relatedProductsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  relatedProductCard: {
    width: 120,
    marginRight: 15,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  relatedProductImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  relatedProductTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  relatedProductPrice: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addToCartText: {
    fontSize: 12,
    color: '#fff',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  addToCartFooterButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addToCartFooterText: {
    fontSize: 16,
    color: '#fff',
  },
  buyNowButton: {
    backgroundColor: '#00c853',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buyNowButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ProductDetailsScreen;
