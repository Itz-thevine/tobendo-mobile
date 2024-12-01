import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InventoryItem } from '@/types';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import { router } from 'expo-router';

type ProductSuggestionItemProps = {
    item: InventoryItem;
    selectedProduct: InventoryItem | null;
    onSelect: (item: InventoryItem) => void;
    setIsVisible: (item: boolean) => void;
};

const ProductSuggestionItem: React.FC<any> = ({ item, setIsVisible }) => {
    const productImage = item?.images?.big ? {uri : item.images.big} : require('@/assets/images/no-image.jpg');    
    return (
        <TouchableOpacity
            onPress={() => {
                router.push(`/(seller)/add-new-inventory/${item.legacyArticleId}}`);
                setIsVisible(false);
            }}
        >
            <View 
                style={[combineStyles(GlobalStyles, 'border_xs', 'padding_xs', 'border_gray', 'flex_row', 'rounded_xs', 'items_center'), { backgroundColor: "#FFF4DE", overflow: 'hidden' }]}
            >
                {/* Product Image */}
                <Image
                    source={productImage}
                    style={{ width: '30%', height: 120 }}
                    resizeMode='cover'
                />

                <View style={combineStyles(GlobalStyles, 'padding_x_sm')}>
                    {/* Product Description */}
                    <Text style={[combineStyles(GlobalStyles, 'text_2xl', 'font_medium'), { flex: 1, width: "75%", marginTop: 10 }]}>
                        {item.Description}
                    </Text>
                    
                    {/* Price and Manufacturer */}
                    {/* <View style={combineStyles(GlobalStyles, 'flex_row', 'margin_t_xs')}>
                        <Text style={[combineStyles(GlobalStyles, 'background_warning', 'color_white', 'padding_x_xs', 'rounded_md'), { paddingVertical: 5 }]}>
                            {'$'}
                        </Text>
                        <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_l_xs')}>
                            {'500,000'}
                        </Text>
                    </View> */}
                    
                    {/* Manufacturer Info */}
                    <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center', 'margin_t_xs')}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={combineStyles(GlobalStyles, 'margin_l_xs')}>{item.mfrName}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductSuggestionItem;