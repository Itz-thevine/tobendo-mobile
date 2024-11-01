import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { DynamicObject } from '@/types';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import { useCategories } from '@/hooks/app/useCategories';
import { ActivityIndicator } from 'react-native-paper';
import { useArticleBrand } from '@/hooks/app/useArticleBrand';

interface AddBrandToArticleProps {
  selectedCategories: any
  setSelectedCategories: (value : any) => void
}

const AddBrandToArticle: React.FC<AddBrandToArticleProps> = ({selectedCategories, setSelectedCategories }) => {
  
  const [selectedBrand, setSelectedBrand] = useState<any>('');

  const handleAddCategory = () => {
      setSelectedCategories([...selectedCategories, selectedBrand]);
      setSelectedBrand('');
  };

  const { data: articleBrand = {}, isLoading, isError } = useArticleBrand({
    lang: 'en'
  })
  return (
    <View style={combineStyles(GlobalStyles, 'background_transparent')}>
      <Text style={[combineStyles(GlobalStyles, 'text_sm')]}>Brand</Text>
      <View style={styles.controls}>
        <View style={combineStyles(GlobalStyles, 'background_white' , 'rounded_full', 'safeArea')}>
          <Picker
            selectedValue={selectedBrand}
            style={[combineStyles(GlobalStyles, 'safeArea', 'color_gray', ), {height: 40, overflow: 'hidden'}]}
            onValueChange={(itemValue) => {  
              setSelectedBrand(itemValue)          
            }}
          >
            <Picker.Item label={(Object.values(selectedBrand).length > 0 && !isLoading) ? selectedBrand.assemblyGroupName : isLoading ? "Loading" : articleBrand.length > 0 ? 'Select brand' : 'No category'} value="" />
                {
                  articleBrand.length > 0 && articleBrand.map((item: any, index: number) => {
                    return (
                      <Picker.Item key={index} label={item} value={item} />
                    )
                  })
                }          
            </Picker>
        </View>
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    color: '#007BFF',
    fontSize: 18,
    marginRight: 5,
    fontWeight: '400'
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },

  addButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 32,
    marginLeft: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1F243A',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddBrandToArticle;
