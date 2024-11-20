import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { combineStyles, width } from '@/lib';
import { GlobalStyles } from '@/styles';
import Counter from '@/components/shared/counter';
import { router } from 'expo-router';
import { useAddItemToCartApi } from '@/hooks/api/user-cart/addItemToCart';
import { userProductItem } from '@/hooks/api/user/getUserProducts';

type productCard = {
  item: userProductItem;
};

const ProductCard: React.FC<productCard> = ({ item }) => {
    const addItemApi = useAddItemToCartApi();
    const addItemResp = addItemApi.response;
    const loading = addItemResp.loading;

    const [count, setCount] = useState(1);
    const [itemAdded, setItemAdded] = useState(false);

    const itemImages = item.images || [];
    const itemImageUrl = itemImages[0];
    
    const productId = item.product_id;

    const addItem = () => {
        addItemApi.trigger({
            product_id: `${productId}`,
            quantity: count,
        });
    }
    useEffect(() => {
        if(addItemResp.success){
            setItemAdded(true);
        }
    }, [addItemResp.success]);
    
  return (
    <TouchableOpacity onPress={() => router.push(`/(customer)/product-details/${productId}`)} style={[combineStyles(GlobalStyles, 'border_soft_blue', 'background_white', 'border_xs', 'rounded_xs', 'padding_xs', 'jusify_center', 'safeArea')]}>
        <View style={[combineStyles(GlobalStyles, 'flex_row', 'items_center')]}>
            <View >
                <Image
                    source={require('../../../assets/images/seller/image 7.png')}
                    // source={{uri: itemImageUrl}}
                    style={[GlobalStyles.rounded_xs, { width: width*0.3, height: 120 }]}
                    resizeMode='contain'
                />
            </View>
            <View style={[combineStyles(GlobalStyles, 'margin_l_xs')]}>
                <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
                    <Image
                    source={require('../../../assets/images/seller/image 6.png')}
                    // source={{ uri: itemImageUrl}}
                    style={[{ width: 50, height: 30 }]}
                    resizeMode='cover'
                    />
                    <Text style={combineStyles(GlobalStyles, 'margin_l_xs', 'font_medium')}>{item.mfrName}</Text>
                </View>

                <Text style={[combineStyles(GlobalStyles, 'text_2xl', 'font_medium', 'line_lg', 'margin_t_xs'), {width: width*0.5}]}>{item.itemDescription || item.genericArticleDescription}</Text>
                <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'line_lg', 'margin_t_xs', 'color_gray')}>{item.assemblyGroupName}</Text>
            </View>
        </View>
        <View style={[combineStyles(GlobalStyles, 'background_soft_blue', 'margin_t_sm'), {width: '100%', height: 1}]}></View>
        <View style={[combineStyles(GlobalStyles, 'flex_row', 'margin_t_xs', 'jusify_between', 'safeArea', 'margin_r_xs', 'margin_l_xs')]}>
            <View style={combineStyles(GlobalStyles, 'flex_row')}>
                <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs')}>{'$'}</Text>
                <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs', 'font_bold')}>{item.price}</Text>
            </View>
            <View style={[combineStyles(GlobalStyles, 'flex_row', 'items_center' )]}>
                <View style={[combineStyles(GlobalStyles, 'margin_r_sm')]}>
                    <Counter count={count} setCount={setCount}/>
                </View>
                <View style={{opacity: count > 0 ? undefined : 0.6}}>
                    <TouchableOpacity
                        style={combineStyles(GlobalStyles, 'background_royal_blue', 'padding_t_xs', 'padding_b_xs', 'rounded_full', 'items_center', 'padding_x_xs', 'flex_row')}
                        onPress={() => {
                            if(!itemAdded && count > 0) addItem();
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
                            <>
                                <Text style={combineStyles(GlobalStyles, 'color_white', 'text_lg', 'margin_l_xs')}>
                                    {
                                        itemAdded ? 'Added' :
                                        'Add To Cart'
                                    }
                                </Text>
                            </>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
