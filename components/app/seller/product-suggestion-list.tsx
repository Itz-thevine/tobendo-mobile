import React, { useState } from 'react';
import { View, Text, Dimensions, SafeAreaView, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import Autocomplete from '../auto-complete';
import ProductSuggestionItem from './product-suggestion-list-item';
import { useAutoCompleteSuggestions } from '@/hooks/app/useAutoCompleteSuggestions';
import { useDebounce } from 'use-debounce';
import { useGetPartSuggestions } from '../../../hooks/useGetPartSuggestions';

const { width } = Dimensions.get('window');



const ProductSuggestion: React.FC<{setIsVisible: (value: boolean) => void}> = ({setIsVisible}) => {
    const hook = useGetPartSuggestions();
    const isLoading = hook.loading;
    const articles = hook.data;

    const [searchOptionUp, setSearchOptionUp] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<string>('');

    const [debouncedSearchValue] = useDebounce(searchQuery, 1000);
    const { data: searchResults = {}, isFetching } = useAutoCompleteSuggestions(debouncedSearchValue);

    const handleSearchChange = (query: string) => {
        if(!searchQuery){
            hook.get({
                search_query: '',
                page: 1,
            });
        };
        setSearchQuery(query);
        if(!searchOptionUp) setSearchOptionUp(true)
      };

    const handleOutsideClick = () => {
        Keyboard.dismiss();
        setSearchOptionUp(false)
    };

    const handleSearchSelect = (selectedItem: string) => {
        hook.updateFilters({
            searchQuery: selectedItem,
        });
        if(searchOptionUp) setSearchOptionUp(false)
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
                    onScroll={hook.handleScroll}
                >
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
                    {
                        isLoading && (
                            <View style={{flex: 1, margin: 60, marginLeft: 0, marginRight: 0}}>
                                <ActivityIndicator size="small" color="#000" />
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default ProductSuggestion;