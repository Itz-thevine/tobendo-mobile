import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import ArtIcon from "react-native-vector-icons/AntDesign";
import { useRemoveCartItemApi } from '@/hooks/api/user-cart/removeCartItem';
import { cartItem } from '@/hooks/api/user-cart/getCartItems';
import Counter from '@/components/shared/counter';

type ProductCard5Props = {
    item: cartItem;
    onDelete?: () => void;
    updateItem?: (itemProps: Partial<cartItem>) => void;
};

const ProductCard5 = (props: ProductCard5Props) => {
    const deleteApi = useRemoveCartItemApi();
    const deleteResp = deleteApi.response;
    const loading = deleteResp.loading;

    const deleteItem = () => {
        if(props.item.cart_id) deleteApi.trigger({
            cart_id: props.item.cart_id,
        });
    }

    useEffect(() => {
        if(deleteResp.success && props.onDelete) props.onDelete();
    }, [deleteResp.success]);
    return (
        <View style={combineStyles(GlobalStyles, 'flex_row', 'margin_b_sm', 'items_center')}>
          <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/seller/image 5.png')}
            style={[GlobalStyles.rounded_xs, {width: 100, height: 100 }]}
            resizeMode='contain'
          />
            {/* <Image src={item.image} style={styles.productImage} alt={item.name} /> */}
          </View>
          <View style={combineStyles(GlobalStyles, 'safeArea', 'margin_l_sm')}>
            <Text style={combineStyles(GlobalStyles, 'font_bold')}>{props.item.product_details?.genericArticleDescription}</Text>
            <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_t_xs')}>
              {props.item.product_details?.assemblyGroupName}
            </Text>
            <View style={combineStyles(GlobalStyles, 'flex_row', 'gap_sm', 'margin_t_sm')}>
              <View style={[combineStyles(GlobalStyles), {width : 85}]}>
                <Counter count={props.item.quantity ?? 0} setCount={(newCount) => {
                  if(props.updateItem) props.updateItem({quantity: newCount || 1});
                }} />
              </View>
              <TouchableOpacity onPress={() => {
                deleteItem();
              }}>
                <View style={[combineStyles(GlobalStyles, 'margin_r_sm', 'background_softer_blue', 'flex_row', 'items_center' , 'padding_xs', 'rounded_full')]}>
                  {
                      loading ?
                      <ActivityIndicator /> :
                      <ArtIcon name='delete' size={20} color={'#A2112A'} />
                  }
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
            <Text style={combineStyles(GlobalStyles, 'margin_t_xs', 'text_lg', 'font_bold')}>
              ${props.item.product_details?.price ?? 0}
            </Text>
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
});


export default ProductCard5;
