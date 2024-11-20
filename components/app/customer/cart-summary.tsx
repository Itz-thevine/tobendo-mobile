import React from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { combineStyles } from '@/lib'; // Assuming this is a utility function for combining styles
import { GlobalStyles } from '@/styles'; // Assuming this is your global styles file
import { cartItem } from '@/hooks/api/user-cart/getCartItems';
import { customerProductItem } from '@/hooks/api/user/getCustomerProducts';
import ProductCard3 from './product-card-3';
import ProductCard2 from './product-card-2';

interface CartSummaryProps {
  cartItems?: cartItem[];
  relatedItems?: customerProductItem[];
  totalAmount: number;
  loading?: boolean;
  moveNext: () => void;
  removeItem?: (itemIndex: number) => void;
}
const CartSummary = (props: CartSummaryProps) => {
  return (
    <View style={[combineStyles(GlobalStyles, 'background_softer_blue'),{ flex: 1 }]}>
      <ScrollView>
        {/* Cart Items */}
        <View style={combineStyles(GlobalStyles, 'margin_sm', 'flex_row', 'gap_sm', 'items_center')}>
          <View style={[combineStyles(GlobalStyles, 'background_warning', 'rounded_full', 'jusify_center', 'items_center'), { width: 30, height: 30 }]}>
            <Text style={combineStyles(GlobalStyles, 'color_white', 'font_bold')}>{props.cartItems?.length ?? 0}</Text>
          </View>
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_bold')}>Items</Text>
        </View>
        <FlatList
          data={props.cartItems}
          renderItem={({item, index}) => (
            <ProductCard3
              item={item}
              onDelete={() => {
                if(props.removeItem) props.removeItem(index);
              }}
            />
          )}
          keyExtractor={(item) => `${item.cart_id}_${item.product_id}`}
          style={styles.cartList}
          contentContainerStyle={combineStyles(GlobalStyles, 'gap_sm', 'margin_sm')}
        />
        {
          props.loading ?
          <ActivityIndicator /> : <></>
        }

        {/* Related Products */}
        {
          props.relatedItems?.length ?
          <View style={combineStyles(GlobalStyles, 'margin_sm')}>
            <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_b_sm')}>You Might Also Like</Text>
            <FlatList
              data={props.relatedItems}
              renderItem={({item}) => <ProductCard2 item={item} />}
              keyExtractor={(item) => `${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={combineStyles(GlobalStyles, 'gap_sm')}
            />
          </View> : <></>
        }
        <View style={{width : '100%', height: 200}}></View>
      </ScrollView>

      <View style={combineStyles(GlobalStyles, 'absolute', 'background_white', 'bottom_0', 'right_0', 'left_0', 'padding_y_xs', 'padding_x_sm')}>
        <View style={[combineStyles(GlobalStyles, 'flex_row', 'margin_t_xs', 'jusify_between', 'safeArea', 'margin_r_xs', 'margin_l_xs', 'margin_b_xs')]}>
          <Text style={combineStyles(GlobalStyles, 'text_2xl')}>Total</Text>
          <View style={combineStyles(GlobalStyles, 'flex_row')}>
            <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs')}>{'$'}</Text>
            <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs', 'font_bold')}>{props.totalAmount}</Text>
          </View>
        </View>

        <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between')}>
          <TouchableOpacity
            style={[combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm'), { width: '100%' }]}
            onPress={props.moveNext}
          >
            <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Proceed Buying</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartList: {
    // Add your styles here if needed
  },
});

export default CartSummary;
