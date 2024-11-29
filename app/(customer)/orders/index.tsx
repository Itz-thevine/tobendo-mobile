import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import CustomerAppHeader from '@/components/shared/customers-app-header';
import { useLocalBuyer } from '../../../context/local-buyer/useLocalBuyer';
import { ActivityIndicator } from 'react-native-paper';

const OrderScreen: React.FC = () => {
  const orderHook = useLocalBuyer()?.orders;
  const [activeTab, setActiveTab] = useState<'in-progress' | 'completed' | 'canceled'>('in-progress');

  useEffect(() => {
    orderHook?.get();
  }, []);

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

  return (
    <SafeAreaView style={combineStyles(GlobalStyles, 'safeArea', 'background_softer_blue')}>
      <CustomerAppHeader/>
      <View style={combineStyles(GlobalStyles, 'padding_sm')}>
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

        <View style={combineStyles(GlobalStyles, 'background_white', 'padding_sm', 'gap_md', 'rounded_xs', 'margin_t_sm')}>
          {
            orderItems.length ?
            orderItems.map((item, i) => {
              return (
                <View key={`${i}_${item.order_id}`} style={combineStyles(GlobalStyles, 'background_white', )}>
                  <View style={combineStyles(GlobalStyles, 'border_b_xs', 'border_gray', 'padding_b_sm')}>
                    {item.items?.map((product) => (
                      <View key={product.product_id} style={styles.product}>
                        {/* <Image
                          source={product.image}
                          style={[GlobalStyles.rounded_xs, {width: 100, height: 100 }]}
                          resizeMode='contain'
                        /> */}
                        <View>
                          <Text style={combineStyles(GlobalStyles, 'font_bold')}>No name</Text>
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
                        <Text style={styles.arrivalDate}>Arrives: {item.placed_at}</Text>
                      </View>
                    </View>
                </View>
              )
            }) :
            <Text style={{textAlign: 'center'}}>no items</Text>
          }
          {
            orderHook?.loading ?
            <ActivityIndicator /> :
            <></>
          }
        </View>
      </View>
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
  ordersList: {
    paddingHorizontal: 10,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  productsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productName: {
    color: '#333',
    fontSize: 14,
  },
  address: {
    color: '#666',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default OrderScreen;
