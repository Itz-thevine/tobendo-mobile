import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Keyboard,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { combineStyles } from "@/lib";
import { GlobalStyles } from "@/styles";
import Autocomplete from "../auto-complete";
import ProductSuggestionItem from "./product-suggestion-list-item";
import { useAutoCompleteSuggestions } from "@/hooks/app/useAutoCompleteSuggestions";
import { useDebounce } from "use-debounce";
import { useProducts } from "@/hooks/app/useProducts";
import { partDetailsArticleItem } from "@/hooks/api/vehicle/getPartSuggestionDetails";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const ProductSuggestion: React.FC<{
  setIsVisible: (value: boolean) => void;
}> = ({ setIsVisible }) => {
  const [searchOptionUp, setSearchOptionUp] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [debouncedSearchValue] = useDebounce(searchQuery, 1000);
  const [page, setPage] = useState<number>(1);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();
  const { data: searchResults = {}, isFetching } =
    useAutoCompleteSuggestions(debouncedSearchValue);

  const {
    data: productsData = {},
    isLoading,
    isError,
  } = useProducts({
    search_query: searchQuery.length > 0 ? selectedProduct : "",
    page,
    per_page: 10,
    lang: "en",
    include_all: false,
    search_type: "99",
  });

  useEffect(() => {
    if (productsData?.articles) {
      setProducts((prevProducts) => [
        ...prevProducts,
        ...productsData.articles,
      ]);
    }
  }, [productsData]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSearchOptionUp(true);
  };

  const handleOutsideClick = () => {
    Keyboard.dismiss();
    setSearchOptionUp(false);
  };

  const handleSearchSelect = (selectedItem: string) => {
    setSearchOptionUp(false);
    setSearchQuery(selectedItem);
    setSelectedProduct(selectedItem);
    setPage(1);
    setProducts([]);
  };

  const handleFabPress = () => {
    router.push("/(seller)/add-new-inventory/new");
  };
  const handleLoadMore = () => {
    if (!isLoading && productsData?.articles?.length > 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <SafeAreaView
      style={{
        position: "relative",
      }}
    >
      <View>
        <View
          style={[
            combineStyles(
              GlobalStyles,
              "safeArea",
              "items_center",
              "jusify_end"
            ),
            { zIndex: 2 },
          ]}
        >
          <View
            style={[combineStyles(GlobalStyles, "padding_t_sm"), { width }]}
          >
            <Autocomplete
              searchQuery={searchQuery}
              searchResults={searchResults?.suggestions ?? []}
              searchOptionUp={searchOptionUp}
              onSearchChange={handleSearchChange}
              onSearchSelect={handleSearchSelect}
              handleOutsideClick={handleOutsideClick}
              isFetching={isFetching}
              setSearchOptionUp={setSearchOptionUp}
            />
          </View>
        </View>

        <ScrollView
          style={{
            marginTop: 80,
            padding: 0,
            margin: 0,
          }}
          showsVerticalScrollIndicator={false}
        >
          {isLoading && page === 1 && (
            <View style={{ flex: 1, height: height - 40 }}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          )}
          {products.length === 0 && !isLoading ? (
            <View>
              <Text>No products found</Text>
            </View>
          ) : (
            <FlatList
              data={products}
              renderItem={({ item }) => (
                <ProductSuggestionItem
                  item={item}
                  selectedProduct={selectedProduct}
                  setIsVisible={setIsVisible}
                />
              )}
              keyExtractor={(item, index) => `${index}`}
              numColumns={1}
              contentContainerStyle={combineStyles(GlobalStyles, "gap_md")}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isLoading && page > 1 ? (
                  <View style={{ padding: 10 }}>
                    <ActivityIndicator size="small" color="#000" />
                  </View>
                ) : null
              }
            />
          )}
        </ScrollView>
      </View>
      <FAB onPress={handleFabPress} />
    </SafeAreaView>
  );
};

export default ProductSuggestion;

const FAB: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity
    style={[
      combineStyles(GlobalStyles, "background_royal_blue"),
      {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,

        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
      },
    ]}
    onPress={onPress}
  >
    <Ionicons name="add" size={24} color="white" />
  </TouchableOpacity>
);
