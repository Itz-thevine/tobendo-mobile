import React, { useState } from 'react';
import { View, Text, Dimensions, FlatList, SafeAreaView, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InventoryItem } from '@/types';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import { inventoryData } from '@/static';
import Autocomplete from '../auto-complete';
import ProductSuggestionItem from './product-suggestion-list-item';
import { useAutoCompleteSuggestions } from '@/hooks/app/useAutoCompleteSuggestions';
import { useDebounce } from 'use-debounce';
import { useProducts } from '@/hooks/app/useProducts';

const { width } = Dimensions.get('window');



const ProductSuggestion: React.FC<{setIsVisible: (value: boolean) => void}> = ({setIsVisible}) => {
    const [searchOptionUp, setSearchOptionUp] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [debouncedSearchValue] = useDebounce(searchQuery, 1000);

    const { data: searchResults = {}, isFetching } = useAutoCompleteSuggestions(debouncedSearchValue);

    const { data: productsData = {}, isLoading, isError } = useProducts({
        search_query: searchQuery.length > 0 ? selectedProduct : '',
        page: 1,
        per_page: 10,
        lang: 'en',
        include_all: false,
        search_type: '99',
      });
    
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setSearchOptionUp(true)
      };

    const handleOutsideClick = () => {
        Keyboard.dismiss();
        setSearchOptionUp(false)
    };

    const handleSearchSelect = (selectedItem: string) => {
        setSearchOptionUp(false)
        setSearchQuery(selectedItem);
        setSelectedProduct(selectedItem)
    };

    return (
        <SafeAreaView>
            <View>
                <View style={[combineStyles(GlobalStyles, 'safeArea', 'items_center', 'jusify_end'), { zIndex: 2 }]}>
                    <View style={[combineStyles(GlobalStyles, 'padding_t_sm'), { width }]}>
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
                        margin:0
                    }}
                    showsVerticalScrollIndicator={false}
                >

                    {
                        isLoading && (
                            <View style={{flex: 1}}>
                                <ActivityIndicator size="small" color="#000" />
                            </View>
                        )
                    }
                    {productsData?.articles?.length === 0 ? (
                        <View>
                            <Text>No products found</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={productsData?.articles}
                            renderItem={({ item }) => (
                                <ProductSuggestionItem item={item} selectedProduct={selectedProduct} setIsVisible={setIsVisible} />
                            )}
                            keyExtractor={(item, index) => `${index}`}
                            numColumns={1}
                            contentContainerStyle={combineStyles(GlobalStyles, 'gap_md')}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default ProductSuggestion;
