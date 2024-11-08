import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AppHeader from '@/components/shared/app-header';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import CustomTabs from '@/components/app/custom-tab';
import { router } from 'expo-router';

type Order = {
  id: string;
  name: string;
  items: string;
  date: string;
  image: string;
};

const Tab = createMaterialTopTabNavigator();

const SellerScreen: React.FC = () => {
    const [isProductListModal, setIsProductListModal] = useState(false)
    const [selectedTab, setSelectedTab] = useState<'Orders' | 'Inventory' | 'Earnings'>('Inventory');
  return (
    <View style={{ flex: 1 }}>
       
      <AppHeader/>
      <CustomTabs setSelectedTab={setSelectedTab} selectedTab={selectedTab}/>
    
      {
        selectedTab === 'Earnings' && (
          <View style={combineStyles(GlobalStyles, 'background_white', 'padding_x_sm', 'padding_y_xs')}>
                <TouchableOpacity style={combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm')} onPress={() =>router.push('/(seller)/withdraw-earnings')}>
                    <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Withdraw Funds</Text>
                </TouchableOpacity>
            </View>
        )
      }
    </View>
  );
};



export default SellerScreen;
