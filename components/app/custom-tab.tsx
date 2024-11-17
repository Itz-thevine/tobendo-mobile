// CustomTabs.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Inventory from './seller/inventory-V1';
import Earnings from './seller/earnings-V1';
import OrderTabs from './seller/order-V1';


interface sellerTab {
  selectedTab : 'Orders' | 'Inventory' | 'Earnings';
  setSelectedTab : (value : 'Orders' | 'Inventory' | 'Earnings') => void
}

const CustomTabs: React.FC<sellerTab> = ({selectedTab, setSelectedTab}) => {
 
  const renderContent = () => {
    switch (selectedTab) {
      case 'Orders':
        return <OrderTabs/>;
      case 'Inventory':
        return( 
          <Inventory/>
        );
      case 'Earnings':
        return <Earnings/>;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Orders' && styles.activeTab]}
          onPress={() => setSelectedTab('Orders')}
        >
          <Text style={[styles.tabText, selectedTab === 'Orders' && styles.activeTabText]}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Inventory' && styles.activeTab]}
          onPress={() => setSelectedTab('Inventory')}
        >
          <Text style={[styles.tabText, selectedTab === 'Inventory' && styles.activeTabText]}>Inventory</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'Earnings' && styles.activeTab]}
          onPress={() => setSelectedTab('Earnings')}
        >
          <Text style={[styles.tabText, selectedTab === 'Earnings' && styles.activeTabText]}>Earnings</Text>
        </TouchableOpacity>
      </View>
      <View>
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f1c40f',
  },
  tabText: {
    color: '#333',
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    fontSize: 18,
  },
});

export default CustomTabs;
