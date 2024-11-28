import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { combineStyles } from "@/lib";
import { GlobalStyles } from "@/styles";
import SidebarScreen from "./side-bar";

const AppHeader: React.FC = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View>
      <View
        style={[
          combineStyles(
            GlobalStyles,
            "padding_t_sm",
            "padding_x_sm",
            "background_white",
            "flex_row",
            "items_center",
            "jusify_between"
          ),
          {
            paddingTop: 40,
          },
        ]}
      >
        <Image
          source={require("@/assets/images/mainLogo.png")}
          style={[GlobalStyles.logo]}
          resizeMode="contain"
        />
        <View style={combineStyles(GlobalStyles, "flex_row", "items_center")}>
          <TouchableOpacity
            onPress={() => setSidebarVisible(!isSidebarVisible)}
          >
            <Image
              source={require("@/assets/images/Group 1.png")}
              style={[{ height: 18 }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      {isSidebarVisible && (
        <SidebarScreen
          isVisible={isSidebarVisible}
          onClose={() => setSidebarVisible(false)}
        />
      )}
    </View>
  );
};

export default AppHeader;
