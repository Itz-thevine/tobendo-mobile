import React, { useRef, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { combineStyles, height } from "@/lib";
import { GlobalStyles } from "@/styles";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalUser } from "@/context/local-user/useLocalUser";

const screenWidth = Dimensions.get("window").width;

const Sidebar: React.FC<{ isVisible: boolean; onClose: () => void }> = ({
  isVisible,
  onClose,
}) => {
  const localUser = useLocalUser();
  const sidebarAnim = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: isVisible ? 0 : -screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const containerStyles = useMemo(
    () => [styles.sidebar, { transform: [{ translateX: sidebarAnim }] }],
    [sidebarAnim]
  );
  //TODO:  fix sidebar redirects
  return (
    <Animated.View style={containerStyles}>
      <ScrollView
        style={[combineStyles(GlobalStyles, "safeArea"), styles.container]}
        contentContainerStyle={styles.contentContainer}
      >
        <View
          style={combineStyles(
            GlobalStyles,
            "flex_row",
            "items_center",
            "jusify_between",
            "margin_r_sm",
            "margin_l_sm"
          )}
        >
          <Image
            source={require("@/assets/images/mainLogo-white.png")}
            style={[GlobalStyles.logo]}
            resizeMode="contain"
          />
          <View style={combineStyles(GlobalStyles, "flex_row", "items_center")}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={combineStyles(GlobalStyles, "padding_l_sm", "padding_r_sm")}
        >
          <Image
            source={require("@/assets/images/Group 41.png")}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </View>

        {localUser?.data?.email && (
          <View
            style={[
              combineStyles(GlobalStyles, "padding_l_sm", "padding_r_sm"),
              styles.emailContainer,
            ]}
          >
            <TouchableOpacity onPress={() => router.push("/(seller)/profile")}>
              <Text style={styles.email}>{localUser?.data?.email}</Text>
            </TouchableOpacity>
            <EntypoIcon name="chevron-right" size={24} color="white" />
          </View>
        )}

        <View
          style={[
            combineStyles(
              GlobalStyles,
              "padding_t_sm",
              "padding_b_sm",
              "margin_b_sm"
            ),
            { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          ]}
        >
          <MenuContainer>
            <MenuItem
              title="Orders"
              icon="cart-outline"
              onPress={() => router.push("/(seller)/seller")}
            />
            <MenuItem
              title="Inventory"
              icon="clipboard-list-outline"
              onPress={() => router.push("/(seller)/seller")}
            />
            <MenuItem
              title="Earnings"
              icon="currency-usd"
              onPress={() => router.push("/(seller)/seller")}
            />
          </MenuContainer>
        </View>

        <MenuContainer>
          <MenuItem
            title="Switch to Buyer"
            onPress={() => {
              AsyncStorage.setItem("currentMode", "customer");
              router.push("/(customer)");
            }}
          />
          <MenuItem
            title="Help & Support"
            onPress={() => router.push("/(seller)/profile")}
          />
        </MenuContainer>

        <View
          style={[styles.footer, combineStyles(GlobalStyles, "padding_sm")]}
        >
          <LanguageButton />
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const MenuContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <View
    style={[
      combineStyles(GlobalStyles, "padding_l_sm", "padding_r_sm"),
      styles.menuContainer,
    ]}
  >
    {children}
  </View>
);

const MenuItem: React.FC<{
  title: string;
  onPress: () => void;
  icon?: string;
}> = ({ title, onPress, icon }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={combineStyles(GlobalStyles, "flex_row", "items_center")}>
      {icon && (
        <MaIcon
          name={icon}
          size={24}
          color="white"
          style={combineStyles(GlobalStyles, "margin_r_sm")}
        />
      )}
      <Text style={combineStyles(GlobalStyles, "text_lg", "color_white")}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

const LanguageButton: React.FC = () => (
  <TouchableOpacity
    style={[combineStyles(GlobalStyles, "padding_sm"), styles.languageButton]}
  >
    <MaIcon name="web" color="white" size={16} />
    <Text style={styles.languageText}>English</Text>
    <EntypoIcon name="chevron-down" color="white" size={24} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: screenWidth,
    backgroundColor: "#1A1D2D",
    zIndex: 1000,
    height: height,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  contentContainer: {
    paddingBottom: 20, // Ensures content doesn't cut off
  },
  bannerImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButton: {
    marginLeft: "auto",
  },
  emailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 30,
  },
  email: {
    color: "white",
    fontSize: 16,
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 15,
  },
  footer: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  helpText: {
    color: "white",
    fontSize: 20,
    marginTop: 60,
  },
  languageButton: {
    marginTop: 10,
    backgroundColor: "#333",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  languageText: {
    color: "white",
    fontSize: 16,
  },
});

export default Sidebar;
