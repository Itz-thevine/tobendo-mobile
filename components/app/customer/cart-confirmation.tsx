import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { combineStyles } from '@/lib'; // Assuming this is a utility function for combining styles
import { GlobalStyles } from '@/styles'; // Assuming this is your global styles file
import { useCheckoutCartApi } from '@/hooks/api/user-cart/checkoutCart';
import { cartItem } from '@/hooks/api/user-cart/getCartItems';
import ProductCard5 from './product-card-5';
import { addressProps } from '@/hooks/api/address/getAddresses';
import { deliveryOption } from './cart-address-summary';
import ResponseModal, { responseModal } from '@/components/ResponseModal';
import { useLocalUser } from '@/context/local-user/useLocalUser';


interface ConfirmPurchaseProps {
  cartItems: cartItem[];
  totalAmount: number;
  selectedAddress?: addressProps;
  selectedDeliveryOption?: deliveryOption;
  moveNext: () => void;
  updateItem?: (itemIndex: number, itemProps: Partial<cartItem>) => void;
  removeItem?: (itemIndex: number) => void;
}

const ConfirmPurchaseScreen = (props: ConfirmPurchaseProps) => {
  const localUser = useLocalUser();

  const checkoutApi = useCheckoutCartApi();
  const checkoutResp = checkoutApi.response;
  const loading = checkoutResp.loading;

  const [modal, setModal] = useState<responseModal>({
    visible: false,
    message: undefined as string | undefined,
  });

  const checkout = () => {
    console.log(localUser?.data)
    if(localUser?.data?.user_id) checkoutApi.trigger({
      user_id: localUser.data.user_id,
      items: props.cartItems.map((item) => ({
        price: item.product_details?.price ?? 0,
        quantity: item.quantity ?? 0,
        product_id: item.product_id ?? '',
      })),
      shipping_address: '',
      payment_method: '',
    });
  }

  const tax = 10;
  const deliveryFee = 10;
  const total = props.totalAmount + tax + deliveryFee;

  useEffect(() => {
    if(checkoutResp.loading === false){
      if(checkoutResp.success){
        props.moveNext();
      }
      else if(checkoutResp.success === false){
        setModal({
          ...modal,
          visible: true,
          message: checkoutResp.error,
          success: false,
        });
      }
    }
  }, [checkoutResp.loading]);
  
  return (
    <View style={combineStyles(GlobalStyles, 'background_soft_blue', 'safeArea')}>
      {/* Cart Items */}
      <ScrollView style={combineStyles(GlobalStyles, 'padding_sm')}>
        {
          props.cartItems.map((item, i) => {
            return (
              <ProductCard5
                key={`${i}_${item.product_id}`}
                item={item}
                onDelete={() => {
                  if(props.removeItem) props.removeItem(i);
                }}
                updateItem={(itemProps) => {
                  if(props.updateItem) props.updateItem(i, itemProps);
                }}
              />
            )
          })
        }
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
                    <View>
                      <Text style={combineStyles(GlobalStyles, 'text_lg')}>{props.selectedAddress?.address_line_1}</Text>
                      <Text style={combineStyles(GlobalStyles, 'margin_t_sm', 'color_gray')}>{props.selectedAddress?.address_line_2}</Text>
                      <Text style={combineStyles(GlobalStyles, 'margin_t_sm', 'text_lg')}>{props.selectedAddress?.city}</Text>
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
            </View>
        </View>
       
        <View style={combineStyles(GlobalStyles, 'margin_t_sm', 'margin_b_sm')}>
            <Text style={combineStyles(GlobalStyles, 'margin_b_xs', 'text_lg')}>Arrives</Text>
            <View style={combineStyles(GlobalStyles, 'background_white', 'padding_sm', 'rounded_xs')}>
                <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between')}>
                    <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
                        
                        <Text style={combineStyles(GlobalStyles, 'text_lg')}>{props.selectedDeliveryOption?.label}</Text>
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
                <Text style={combineStyles(GlobalStyles, 'margin_t_sm', 'color_gray')}>{props.selectedDeliveryOption?.date}</Text>
            </View>
        </View>

        <View style={[combineStyles(GlobalStyles), {width: '100%', height: 50}]}></View>
      </ScrollView>

      {/* Confirm Purchase Button */}
      <View style={combineStyles(GlobalStyles, 'background_white', 'padding_sm')}>
        <TouchableOpacity
          // disabled={!props.cartItems.length || loading}
          style={{
            ...combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm', 'margin_t_xs'),
            opacity: !props.cartItems.length ? 0.6 : undefined,
          }}
          onPress={checkout}
        >
          {
            loading ?
            <ActivityIndicator /> :
            <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Confirm Purchase</Text>
          }
        </TouchableOpacity>
      </View>
      <ResponseModal
        modal={modal}
        onClose={() => {
          setModal({
            ...modal,
            visible: false,
          });
        }}
      />
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
