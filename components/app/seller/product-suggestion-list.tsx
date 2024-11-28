import React, { useState } from 'react';
import { View, Text, Dimensions, SafeAreaView, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import Autocomplete from '../auto-complete';
import ProductSuggestionItem from './product-suggestion-list-item';
import { useAutoCompleteSuggestions } from '@/hooks/app/useAutoCompleteSuggestions';
import { useDebounce } from 'use-debounce';
import { useProducts } from '@/hooks/app/useProducts';
import { partDetailsArticleItem } from '@/hooks/api/vehicle/getPartSuggestionDetails';

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
    const articles = productsData?.articles as partDetailsArticleItem[] | undefined;
    
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
                    {articles?.length === 0 ? (
                        <View>
                            <Text>No products found</Text>
                        </View>
                    ) : (
                        <View style={combineStyles(GlobalStyles, 'gap_md')}>
                            {
                                articles?.map((item, i) => {
                                    return (
                                        <ProductSuggestionItem
                                            key={`${i}`}
                                            item={item}
                                            selectedProduct={selectedProduct}
                                            setIsVisible={setIsVisible}
                                        />
                                    )
                                })
                            }
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default ProductSuggestion;