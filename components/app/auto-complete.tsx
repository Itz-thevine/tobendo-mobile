import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, TextInput, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AutocompleteInput from 'react-native-autocomplete-input';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';

const { width } = Dimensions.get('window');

type AutocompleteProps = {
    searchQuery: string;
    searchResults: string[];
    searchOptionUp: boolean;
    onSearchChange: (query: string) => void;
    onSearchSelect: (item: string) => void;
    handleOutsideClick?: () => void;
    isFetching: boolean,
    setSearchOptionUp: (value: boolean) => void
};

const Autocomplete: React.FC<AutocompleteProps> = ({ searchQuery, searchResults, searchOptionUp, onSearchChange, onSearchSelect, handleOutsideClick, isFetching, setSearchOptionUp }) => {
    const SearchSuggestions = ({ item }: { item: string }) => (
        <TouchableOpacity onPress={() => onSearchSelect(item)}>
            <Text>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <TouchableWithoutFeedback onPress={handleOutsideClick}>
            <View style={{ position: 'relative', zIndex: 20, marginHorizontal: 10 }}>
                <View>
                    <AutocompleteInput
                        data={searchResults}
                        defaultValue={searchQuery}
                        onChangeText={onSearchChange}
                        inputContainerStyle={[combineStyles(GlobalStyles, 'flex_row', 'items_center', 'background_soft_blue', 'rounded_xs', 'jusify_center', 'padding_sm', 'rounded_full'), { height: 55, borderWidth: 0, marginBottom: 20 }]}
                        renderTextInput={(props) => (
                            <View style={combineStyles(GlobalStyles, 'safeArea')}>
                                <Ionicons name="search" size={20} color="#C0C0C7" style={[combineStyles(GlobalStyles, 'absolute'), { right: 8, top: -1 }]} />
                                <TextInput
                                    {...props}
                                    style={[combineStyles(GlobalStyles, 'safeArea', 'padding_l_xs',)]}
                                    placeholder="Search Part Name or Number"
                                    placeholderTextColor="#C0C0C7"
                                    onFocus={() =>setSearchOptionUp(true)}
                                />
                            </View>
                        )}
                        flatListProps={{
                            keyExtractor: (item, index) => index.toString(),
                            renderItem: () => null,
                        }}
                        style={{
                            borderWidth: 0
                        }}
                    />
                </View>

                {
                    (isFetching && searchOptionUp) && (
                        <View style={{ position: 'absolute', top: 60, width: width   }}>
                            <View style={[combineStyles(GlobalStyles, 'rounded_xs', 'padding_sm', 'background_soft_blue', 'margin_x_auto', 'absolute'), { width: width * 0.94, zIndex: 20 }]}>
                                <Text style={combineStyles(GlobalStyles)}>Loading...</Text>
                            </View>
                        </View>
                    )
                }
                {(searchResults.length === 0 && searchOptionUp && !isFetching) && (
                    <View style={{ position: 'absolute', top: 60, width: width   }}>
                        <View style={[combineStyles(GlobalStyles, 'rounded_xs', 'padding_sm', 'background_soft_blue', 'margin_x_auto', 'absolute'), { width: width * 0.94, zIndex: 20 }]}>
                            <Text style={combineStyles(GlobalStyles)}>No product found</Text>
                        </View>
                    </View>
                )}
                {(searchResults.length > 0 && searchOptionUp  && !isFetching) && (
                    <View style={{ position: 'absolute', top: 60, width: width }}>
                        <View style={[combineStyles(GlobalStyles, 'rounded_xs', 'padding_sm', 'background_soft_blue', 'margin_x_auto', 'absolute'), { width: width * 0.94, zIndex: 20 }]}>
                            <FlatList
                                data={searchResults}
                                renderItem={SearchSuggestions}
                                keyExtractor={(item) => item}
                                numColumns={1}
                                contentContainerStyle= {combineStyles(GlobalStyles, 'gap_sm')}
                            />
                        </View>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Autocomplete;
