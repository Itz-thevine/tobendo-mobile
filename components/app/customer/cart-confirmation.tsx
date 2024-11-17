import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView } from 'react-native';
import { combineStyles } from '@/lib'; // Assuming this is a utility function for combining styles
import { GlobalStyles } from '@/styles'; // Assuming this is your global styles file
import ArtIcon from 'react-native-vector-icons/AntDesign';
import Counter from '@/components/shared/counter';
import { useCheckoutCartApi } from '@/hooks/api/user-cart/checkoutCart';
import { useAuth } from '@/context/auth';
import { cartItem } from '@/hooks/api/user-cart/getCartItems';
import { useRemoveCartItemApi } from '@/hooks/api/user-cart/removeCartItem';


interface ConfirmPurchaseProps {
  cartItems: cartItem[];
  totalAmount: number;
  moveNext: () => void;
  updateItem?: (itemIndex: number, itemProps: Partial<cartItem>) => void;
  removeItem?: (itemIndex: number) => void;
}

const ConfirmPurchaseScreen = (props: ConfirmPurchaseProps) => {
  const authHook = useAuth();

  const checkoutApi = useCheckoutCartApi();
  const checkoutResp = checkoutApi.response;
  const deleteApi = useRemoveCartItemApi();
  const deleteResp = deleteApi.response;

  const [itemIndexToRemove, setItemIndexToRemove] = useState<number | undefined>(undefined);

  const deleteItem = (itemIndex: number, cartId?: string) => {
    if(cartId){
      deleteApi.trigger({
          cart_id: cartId,
      });
      setItemIndexToRemove(itemIndex);
    }
  }

  const checkout = () => {
    if(authHook.user?.id) checkoutApi.trigger({
      user_id: authHook.user?.id,
      items: props.cartItems,
      shipping_address: '',
      payment_method: '',
    });
  }

  const tax = 10;
  const deliveryFee = 10;
  const total = props.totalAmount + tax + deliveryFee;

  useEffect(() => {
    if(checkoutResp.success){
      props.moveNext();
    }
  }, [checkoutResp.success]);
  useEffect(() => {
      if(deleteResp.success){
        if(typeof itemIndexToRemove === 'number' && props.removeItem){
          props.removeItem(itemIndexToRemove);
        }
      }
  }, [deleteResp.success]);

  return (
    <View style={combineStyles(GlobalStyles, 'background_soft_blue', 'safeArea')}>
      {/* Cart Items */}
      <ScrollView style={combineStyles(GlobalStyles, 'padding_sm')}>
        <FlatList
          data={props.cartItems}
          keyExtractor={(item) => `${item.cart_id}_${item.product_id}`}
          contentContainerStyle={combineStyles(GlobalStyles, 'gap_sm', )}
          renderItem={({item, index}) => (
            <View key={index} style={combineStyles(GlobalStyles, 'flex_row', 'margin_b_sm', 'items_center')}>
              <View style={styles.imageContainer}>
              <Image
                source={require('@/assets/images/seller/image 5.png')}
                style={[GlobalStyles.rounded_xs, {width: 100, height: 100 }]}
                resizeMode='contain'
              />
                {/* <Image src={item.image} style={styles.productImage} alt={item.name} /> */}
              </View>
              <View style={combineStyles(GlobalStyles, 'safeArea', 'margin_l_sm')}>
                <Text style={combineStyles(GlobalStyles, 'font_bold')}>{item.genericArticleDescription}</Text>
                <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_t_xs')}>
                  5 L - ref. 214178 - Engine oil
                </Text>
                <View style={combineStyles(GlobalStyles, 'flex_row', 'gap_sm', 'margin_t_sm')}>
                  <View style={[combineStyles(GlobalStyles), {width : 85}]}>
                    <Counter count={item.quantity ?? 0} setCount={(newCount) => {
                      if(props.updateItem) props.updateItem(index, {quantity: newCount});
                    }} />
                  </View>
                  <TouchableOpacity onPress={() => {
                    deleteItem(index, item.cart_id);
                  }}>
                    <View style={[combineStyles(GlobalStyles, 'margin_r_sm', 'background_softer_blue', 'flex_row', 'items_center' , 'padding_xs', 'rounded_full')]}>
                        <ArtIcon name='delete' size={20} color={'#A2112A'} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
                <Text style={combineStyles(GlobalStyles, 'margin_t_xs', 'text_lg', 'font_bold')}>
                  ${item.price}
                </Text>
              </View>
            </View>
            )}
        />

        {/* Tax and Delivery Fee */}
        <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between', 'margin_t_sm')}>
          <Text style={combineStyles(GlobalStyles, 'text_sm', 'color_gray')}>Tax:</Text>
          <Text style={combineStyles(GlobalStyles, 'text_lg')}>${tax}</Text>
        </View>
        <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between', 'margin_t_sm', 'border_b_xs', 'border_soft_gray', 'padding_b_sm')}>
          <Text style={combineStyles(GlobalStyles, 'text_sm', 'color_gray')}>ExpressUp Delivery:</Text>
          <Text style={combineStyles(GlobalStyles, 'text_lg')}>${deliveryFee}</Text>
        </View>

        {/* Total */}
        <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between', 'margin_t_sm')}>
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_bold')}>Total</Text>
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_bold')}>${total}</Text>
        </View>

        <View style={combineStyles(GlobalStyles, 'margin_t_sm', 'margin_b_sm')}>
            <Text style={combineStyles(GlobalStyles, 'margin_b_xs', 'text_lg')}>Delivered to</Text>
            <View style={combineStyles(GlobalStyles, 'background_white', 'padding_sm', 'rounded_xs')}>
                <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between')}>
                    <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
                        
                        <Text style={combineStyles(GlobalStyles, 'text_lg')}>Address Line 1, </Text>
                    </View>
                    <TouchableOpacity>
                        <Image
                            source={require('../../../assets/images/seller/rect1499.png')}
                            style={[{ width: 20, height: 20 }]}
                            resizeMode='contain'
                        />  
                    </TouchableOpacity>
                    {/* <Icon name="edit" size={20} color="#888" /> */}
                </View>
                <Text style={combineStyles(GlobalStyles, 'margin_t_sm', 'color_gray')}>Address Line 2,</Text>
                <Text style={combineStyles(GlobalStyles, 'margin_t_sm', 'text_lg')}> Address Line 3.</Text>
            </View>
        </View>
       
        <View style={combineStyles(GlobalStyles, 'margin_t_sm', 'margin_b_sm')}>
            <Text style={combineStyles(GlobalStyles, 'margin_b_xs', 'text_lg')}>Arrives</Text>
            <View style={combineStyles(GlobalStyles, 'background_white', 'padding_sm', 'rounded_xs')}>
                <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between')}>
                    <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
                        
                        <Text style={combineStyles(GlobalStyles, 'text_lg')}>ExpressUP</Text>
                    </View>
                    <TouchableOpacity>
                        <Image
                            source={require('../../../assets/images/seller/rect1499.png')}
                            style={[{ width: 20, height: 20 }]}
                            resizeMode='contain'
                        />  
                    </TouchableOpacity>
                    {/* <Icon name="edit" size={20} color="#888" /> */}
                </View>
                <Text style={combineStyles(GlobalStyles, 'margin_t_sm', 'color_gray')}>Tomorrow</Text>
            </View>
        </View>

        <View style={[combineStyles(GlobalStyles), {width: '100%', height: 50}]}></View>
      </ScrollView>

      {/* Confirm Purchase Button */}
      <View style={combineStyles(GlobalStyles, 'background_white', 'padding_sm')}>
        <TouchableOpacity style={combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm', 'margin_t_xs')} onPress={checkout}>
          <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Confirm Purchase</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  quantityButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginTop: 5,
  },
});

export default ConfirmPurchaseScreen;
