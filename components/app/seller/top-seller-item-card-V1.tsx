import React from 'react';
import { View, Text, Image } from 'react-native';
import StockStatus from '@/components/stock-status';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import { customerProductItem } from '@/hooks/api/user/getCustomerProducts';
import { getImagesFromProductItem } from '@/hooks/useProductItem';
import { router } from 'expo-router';

type InventoryItemCardProps = {
  item: customerProductItem;
};

const TopSellerItemCard: React.FC<InventoryItemCardProps> = ({ item }) => {
  const getImages = getImagesFromProductItem(item);

  return (
    <TouchableOpacity
        onPress={() => router.push(`/(seller)/product-details/${item.product_id}`)}
    >
      <View style={[combineStyles(GlobalStyles, 'border_soft_blue', 'border_xs', 'rounded_xs', 'padding_xs', 'background_white'), { width: 250 }]}>
        <View style={[combineStyles(GlobalStyles, 'jusify_start', 'safeArea', 'margin_t_xs', 'margin_b_sm'), { width: 220 }]}>
          <StockStatus stock={item.count ?? 0} />
        </View>
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
          <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'line_lg', 'margin_t_xs')}>{item.assemblyGroupName}</Text>
          <View style={combineStyles(GlobalStyles, 'flex_row')}>
            <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs')}>{'$'}</Text>
            <Text style={combineStyles(GlobalStyles, 'text_3xl', 'margin_t_xs', 'margin_b_xs', 'font_bold')}>{item.price ?? 0}</Text>
          </View>
          {/* <View>
            <TouchableOpacity style={combineStyles(GlobalStyles, 'background_warning', 'padding_t_xs', 'padding_b_xs', 'rounded_full', 'items_center')}>
              <Text style={combineStyles(GlobalStyles, 'color_white', 'text_lg')}>Add New Stock</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TopSellerItemCard;
