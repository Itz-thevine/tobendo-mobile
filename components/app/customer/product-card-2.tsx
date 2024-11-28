import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import { userProductItem } from '@/hooks/api/user/getUserProducts';
import { useAddItemToCartApi } from '@/hooks/api/user-cart/addItemToCart';
import { getImagesFromProductItem } from '@/hooks/useProductItem';
import ResponseModal, { responseModal } from '@/components/ResponseModal';

type InventoryItemCardProps = {
  item: userProductItem;
};

const ProductCard2: React.FC<InventoryItemCardProps> = ({ item }) => {
  const addItemApi = useAddItemToCartApi();
  const addItemResp = addItemApi.response;
  const loading = addItemResp.loading;
  
  const [itemAdded, setItemAdded] = useState(false);
  const [modal, setModal] = useState<responseModal>({});
  const productId = item.product_id;
  const getImages = getImagesFromProductItem(item);

  const addItem = () => {
      addItemApi.trigger({
        product_id: `${productId}`,
        quantity: 1,
      });
  }
  useEffect(() => {
      if(addItemResp.success){
          setItemAdded(true);
      }
      else if(addItemResp.success === false){
        setModal({
          ...modal,
          success: false,
          visible: true,
          message: addItemResp.error,
        });
      }
  }, [addItemResp.loading]);
  return (
    <View style={[combineStyles(GlobalStyles, 'border_soft_blue', 'border_xs', 'rounded_xs', 'padding_xs', 'jusify_center', 'items_center', 'background_white'), { width: 250 }]}>
      <Image
        source={getImages.image1}
        style={[GlobalStyles.rounded_xs, { width: 220, height: 180 }]}
        resizeMode='contain'
      />
      <View style={combineStyles(GlobalStyles, 'margin_t_sm', 'margin_b_xs')}>
        <Image
          source={getImages.image2}
          style={[{ width: 70, height: 25 }]}
          resizeMode='contain'
        />
        <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'line_lg', 'margin_t_xs')}>{item.genericArticleDescription}</Text>
        <View style={combineStyles(GlobalStyles, 'flex_row')}>
          <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs')}>{'$'}</Text>
          <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs', 'font_bold')}>{item.price}</Text>
        </View>
        <TouchableOpacity
          style={{
            ...combineStyles(GlobalStyles, 'background_royal_blue', 'padding_t_xs', 'padding_b_xs', 'rounded_full', 'items_center', 'padding_x_xs', 'flex_row', 'jusify_center'),
            ...{opacity: itemAdded ? 0.6 : undefined},
          }}
          onPress={() => {
            if(!itemAdded) addItem();
          }}
        >
            <Image
                source={require('@/assets/images/Group 28_white.png')}
                style={[{ height: 16 }]}
                resizeMode='contain'
            />
            {
                loading ?
                <ActivityIndicator style={{marginLeft: 10}} /> :
                <Text style={combineStyles(GlobalStyles, 'text_lg', 'margin_l_xs', 'margin_r_xs', 'color_white')}>
                  {itemAdded ? 'Added' : 'Add To Cart'}
                </Text>
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

export default ProductCard2;
