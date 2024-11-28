import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AppHeader from "@/components/shared/app-header";
import { combineStyles } from "@/lib";
import { GlobalStyles } from "@/styles";
import CustomTabs from "@/components/app/custom-tab";
import { router, useLocalSearchParams } from "expo-router";

type Tabs = "Orders" | "Inventory" | "Earnings";

const SellerScreen: React.FC = () => {
  const { query } = useLocalSearchParams<{ query?: Tabs }>();
  const [selectedTab, setSelectedTab] = useState<Tabs>(query || "Inventory");
  return (
    <View style={{ flex: 1 }}>
      <AppHeader />
      <CustomTabs setSelectedTab={setSelectedTab} selectedTab={selectedTab} />

      {selectedTab === "Earnings" && (
        <View
          style={combineStyles(
            GlobalStyles,
            "background_white",
            "padding_x_sm",
            "padding_y_xs"
          )}
        >
          <TouchableOpacity
            style={combineStyles(
              GlobalStyles,
              "background_royal_blue",
              "items_center",
              "rounded_full",
              "padding_y_sm"
            )}
            onPress={() => router.push("/(seller)/withdraw-earnings")}
          >
            <Text
              style={combineStyles(
                GlobalStyles,
                "text_lg",
                "color_white",
                "font_medium"
              )}
            >
              Withdraw Funds
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SellerScreen;
