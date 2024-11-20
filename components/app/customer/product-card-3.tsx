import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { combineStyles, width } from '@/lib';
import { GlobalStyles } from '@/styles';
import { router } from 'expo-router';
import ArtIcon from "react-native-vector-icons/AntDesign";
import { useRemoveCartItemApi } from '@/hooks/api/user-cart/removeCartItem';
import { cartItem } from '@/hooks/api/user-cart/getCartItems';

type ProductCard3Props = {
    item: cartItem;
    onDelete?: () => void;
};

const ProductCard3 = (props: ProductCard3Props) => {
    const deleteApi = useRemoveCartItemApi();
    const deleteResp = deleteApi.response;
    const loading = deleteResp.loading;

    const deleteItem = () => {
        console.log(props.item.cart_id)
        if(props.item.cart_id) deleteApi.trigger({
            cart_id: props.item.cart_id,
        });
    }

    useEffect(() => {
        if(deleteResp.success && props.onDelete) props.onDelete();
    }, [deleteResp.success]);
    return (
        <View style={[combineStyles(GlobalStyles, 'border_soft_blue', 'background_white', 'border_xs', 'rounded_xs', 'padding_xs', 'jusify_center', 'safeArea')]}>
            <TouchableOpacity onPress={() => router.push(`/(customer)/product-details/${props.item.product_id}`)}>
                <View style={[combineStyles(GlobalStyles, 'flex_row', 'items_center')]}>
                    {/* <View >
                        <Image
                            source={item.image}
                            style={[GlobalStyles.rounded_xs, { width: width*0.3, height: 120 }]}
                            resizeMode='contain'
                        />
                    </View> */}
                    <View style={[combineStyles(GlobalStyles, 'margin_l_xs')]}>
                        <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
                            <Image
                            source={require('../../../assets/images/seller/image 6.png')}
                            // source={{ uri: 'https://via.placeholder.com/50' }}
                            style={[{ width: 50, height: 30 }]}
                            resizeMode='cover'
                            />
                            <Text style={combineStyles(GlobalStyles, 'margin_l_xs', 'font_medium')}>{props.item.product_details?.mfrName}</Text>
                        </View>

                        <Text style={[combineStyles(GlobalStyles, 'text_2xl', 'font_medium', 'line_lg', 'margin_t_xs'), {width: width*0.5}]}>{props.item.product_details?.genericArticleDescription}</Text>
                        <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'line_lg', 'margin_t_xs', 'color_gray')}>{props.item.product_details?.assemblyGroupName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={[combineStyles(GlobalStyles, 'background_soft_blue', 'margin_t_sm'), {width: '100%', height: 1}]}></View>
            <View style={[combineStyles(GlobalStyles, 'flex_row', 'margin_t_xs', 'jusify_between', 'safeArea', 'margin_r_xs', 'margin_l_xs')]}>
                <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
                    <Text style={combineStyles(GlobalStyles, 'text_2xl', 'color_gray')}>Total: </Text>
                    <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs')}>{'$'}</Text>
                    <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs', 'font_bold')}>{(props.item.product_details?.price ?? 0) * (props.item.quantity ?? 0)}</Text>
                </View>
                <View style={[combineStyles(GlobalStyles, 'flex_row', 'items_center' )]}>
                    <TouchableOpacity onPress={deleteItem}>
                        <View style={[combineStyles(GlobalStyles, 'margin_r_sm', 'background_softer_blue', 'flex_row', 'items_center' , 'padding_xs', 'rounded_full')]}>
                            {
                                loading ?
                                <ActivityIndicator /> :
                                <ArtIcon name='delete' size={20} color={'#A2112A'} onPress={deleteItem} />
                            }
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={combineStyles(GlobalStyles, 'background_royal_blue', 'padding_t_xs', 'padding_b_xs', 'rounded_full', 'items_center', 'padding_x_xs', 'flex_row')}>
                        <Image
                            source={require('@/assets/images/Group 28_white.png')}
                            style={[{ height: 16 }]}
                            resizeMode='contain'
                        />
                        <Text style={combineStyles(GlobalStyles, 'color_white', 'text_lg', 'margin_l_xs')}>Add To Cart</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </View>
    );
};

export default ProductCard3;
