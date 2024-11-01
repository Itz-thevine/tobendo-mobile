import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { DynamicObject } from '@/types';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import { useCategories } from '@/hooks/app/useCategories';
import { ActivityIndicator } from 'react-native-paper';

interface CategoryComponentProps {
  selectedCategories: any
  setSelectedCategories: (value : any) => void
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({selectedCategories, setSelectedCategories }) => {
  
  const [selectedCategory, setSelectedCategory] = useState<any>({});

  const handleAddCategory = () => {
      setSelectedCategories([...selectedCategories, selectedCategory]);
      setSelectedCategory({});
  };

  const { data: categories = {}, isLoading, isError } = useCategories({
    parent_node_id: selectedCategories[selectedCategories.length -1]?.assemblyGroupNodeId  as number,
    hasChild: selectedCategories[selectedCategories.length -1]?.hasChilds as boolean
  })

  return (
    <View style={combineStyles(GlobalStyles, 'background_transparent')}>
      <Text style={[combineStyles(GlobalStyles, 'text_sm', 'margin_b_xs'), { marginTop: 20 }]}>Category</Text>
      <ScrollView horizontal>
        <View style={styles.breadcrumbContainer}>
          {selectedCategories.map((category: any, index: number) => (
            <TouchableOpacity key={index} style={styles.breadcrumbItem}>
              <Text style={styles.breadcrumbText}>{category.assemblyGroupName}</Text>
              {index < selectedCategories.length - 1 && (
                <Ionicons name="chevron-forward" size={16} color="#8F919C" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.controls}>
        <View style={combineStyles(GlobalStyles, 'background_white' , 'rounded_full', 'safeArea', 'margin_r_sm')}>
          <Picker
            selectedValue={selectedCategory.value}
            style={[combineStyles(GlobalStyles, 'safeArea', 'color_gray', ), {height: 40, overflow: 'hidden'}]}
            onValueChange={(itemValue) => {  
              setSelectedCategory(itemValue)          
            }}
          >
            <Picker.Item label={(Object.values(selectedCategory).length > 0 && !isLoading) ? selectedCategory.assemblyGroupName : isLoading ? "Loading" : categories?.data?.array?.length > 0 ? 'Select category' : 'No category'} value="" />
              {
               categories && categories.data && categories.data.array.map((item: any, index: number) => {
                  return (
                    <Picker.Item key={index} label={item.assemblyGroupName} value={item} />
                  )
                })
              }          
          </Picker>

        </View>
        <TouchableOpacity style={combineStyles(GlobalStyles, 'background_royal_blue', 'padding_x_sm', 'padding_y_xs', 'rounded_full')} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
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

export default CategoryComponent;
