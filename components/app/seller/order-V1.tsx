import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { combineStyles, height } from '@/lib';
import { GlobalStyles } from '@/styles';
import { orderItem } from '@/hooks/api/user/getCustomerOrders';
import { useLocalSeller } from '../../../context/local-seller/useLocalSeller';

const OrderTabs: React.FC = () => {
  const orderHook = useLocalSeller()?.orders;

  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed' | 'canceled'>('in-progress');

  const renderOrderItem = ({ item, index }: { item: orderItem, index: number }) => (
    <View key={`${index}_${item.order_id}`} style={combineStyles(GlobalStyles, 'background_white')}>
      <View style={combineStyles(GlobalStyles, 'border_b_xs', 'border_gray', 'padding_b_sm')}>
        {item.items?.map((product) => (
          <View key={product.product_id} style={styles.product}>
            <Image
              source={require('../../../assets/images/seller/image 7.png')}
              style={[GlobalStyles.rounded_xs, { width: 100, height: 100 }]}
              resizeMode='contain'
            />
            <View>
              <Text style={combineStyles(GlobalStyles, 'font_bold')}>Fan Blades</Text>
              <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_t_xs')}>
                5 L - ref. 214178 - Engine oil
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
        <Text style={styles.statusText}>{item.shipping_address}</Text>
        <View style={combineStyles(GlobalStyles, 'margin_t_sm', 'flex_row', 'jusify_between')}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.arrivalDate}>Arrives: {item.delivery_option?.estimated_date}</Text>
        </View>
      </View>
    </View>
  );

  const getOrders = () => {
    switch (activeTab) {
      case 'in-progress':
        return orderHook?.inProgressItems;
      case 'completed':
        return orderHook?.completedItems;
      case 'canceled':
        return orderHook?.canceledItems;
      default:
        return [];
    }
  };

  const orderItems = getOrders() ?? [];
  
  useEffect(() => {
    orderHook?.get();
  }, []);

  return (
    <SafeAreaView style={[combineStyles(GlobalStyles,  'background_softer_blue'), {height: height}]}>
        <ScrollView style={combineStyles(GlobalStyles, 'padding_sm' ,)}>
        <View style={styles.tabContainer}>
            <TouchableOpacity
            style={activeTab === 'in-progress' ? styles.activeTab : styles.inactiveTab}
            onPress={() => setActiveTab('in-progress')}
            >
            <Text style={activeTab === 'in-progress' ? styles.activeTabText : styles.inactiveTabText}>In-progress</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={activeTab === 'completed' ? styles.activeTab : styles.inactiveTab}
            onPress={() => setActiveTab('completed')}
            >
            <Text style={activeTab === 'completed' ? styles.activeTabText : styles.inactiveTabText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={activeTab === 'canceled' ? styles.activeTab : styles.inactiveTab}
            onPress={() => setActiveTab('canceled')}
            >
            <Text style={activeTab === 'canceled' ? styles.activeTabText : styles.inactiveTabText}>Canceled</Text>
            </TouchableOpacity>
        </View>

        {
            orderItems.length ?
            <FlatList
                data={getOrders()}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.order_id ?? ''}
                contentContainerStyle={combineStyles(GlobalStyles, 'background_white', 'padding_sm', 'gap_md', 'rounded_xs', 'margin_t_sm')}
            /> :
            <Text style={{textAlign: 'center', marginTop: 20}}>no orders</Text>
        }
        {
          orderHook?.loading ?
          <ActivityIndicator /> :
          <></>
        }
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  activeTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  inactiveTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  inactiveTabText: {
    color: '#888',
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statusBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  statusText: {
    color: '#666',
  },
  arrivalDate: {
    color: '#666',
  },
});

export default OrderTabs;
