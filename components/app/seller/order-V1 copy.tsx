import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image, SafeAreaView } from 'react-native';
import { combineStyles, height } from '@/lib';
import { GlobalStyles } from '@/styles';

const OrderTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed' | 'canceled'>('in-progress');

  const inProgressOrders = [
    {
      id: '1',
      products: [
        { id: '1', name: 'QUARTZ INEO FIRST 0W-30', image: require('@/assets/images/seller/image 5.png') },
        { id: '2', name: 'QUARTZ INEO FIRST 0W-30', image: require('@/assets/images/seller/image 5.png') },
      ],
      address: '1234 Main St, Springfield, USA',
      status: 'Shipped',
      arrivalDate: 'Wed, Jun 10',
    },
  ];

  const completedOrders = [
    {
      id: '3',
      products: [
        { id: '4', name: 'MOBIL 1 SYNTHETIC 10W-30', image: require('@/assets/images/seller/image 5.png') },
      ],
      address: '9102 Pine Rd, Springfield, USA',
      status: 'Delivered',
      arrivalDate: 'Mon, Jun 8',
    },
  ];

  const canceledOrders = [
    {
      id: '4',
      products: [
        { id: '5', name: 'PENNZOIL 5W-30', image: require('@/assets/images/seller/image 5.png') },
      ],
      address: '3456 Elm St, Springfield, USA',
      status: 'Canceled',
      arrivalDate: 'Canceled',
    },
  ];

  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={combineStyles(GlobalStyles, 'background_white')}>
      <View style={combineStyles(GlobalStyles, 'border_b_xs', 'border_gray', 'padding_b_sm')}>
        {item.products.map((product: any) => (
          <View key={product.id} style={styles.product}>
            <Image
              source={product.image}
              style={[GlobalStyles.rounded_xs, { width: 100, height: 100 }]}
              resizeMode='contain'
            />
            <View>
              <Text style={combineStyles(GlobalStyles, 'font_bold')}>{product.name}</Text>
              <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_t_xs')}>
                5 L - ref. 214178 - Engine oil
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
        <Text style={styles.statusText}>{item.address}</Text>
        <View style={combineStyles(GlobalStyles, 'margin_t_sm', 'flex_row', 'jusify_between')}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Text style={styles.arrivalDate}>Arrives: {item.arrivalDate}</Text>
        </View>
      </View>
    </View>
  );

  const getOrders = () => {
    switch (activeTab) {
      case 'in-progress':
        return inProgressOrders;
      case 'completed':
        return completedOrders;
      case 'canceled':
        return canceledOrders;
      default:
        return [];
    }
  };

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

        <FlatList
            data={getOrders()}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={combineStyles(GlobalStyles, 'background_white', 'padding_sm', 'gap_md', 'rounded_xs', 'margin_t_sm')}
        />
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
