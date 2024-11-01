import * as React from 'react';
import { ScrollView, View, StyleSheet, Dimensions, LayoutAnimation, Platform, UIManager, TouchableOpacity, Text } from 'react-native';
import { List, Provider as PaperProvider } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from 'react';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import { useFetchPartRelatedWithCar } from '@/hooks/app/useFetchPartRelatedWithCar';
import { cCategories } from '@/static';
import CategoryItem from '../../customer/category-item';
import { useFetchVehicleById } from '@/hooks/app/useFetchVehicleById';
import CustomModal from '@/components/shared/custom-modal';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Compatibility {
  id: number;
  selectedCompatibilities: any,
  setCompatibilities: (value : any) => void
}
const CompatibilityCompV2: React.FC<Compatibility> = ({selectedCompatibilities, setCompatibilities,  id }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false)

  const [staticcompatibility, setStaticcompatibility] = useState([
    { category: 'Make', subCategories: [] },
    {  category: 'Model', subCategories: [] },
    { category: 'Engine', subCategories: [] },
  ])

  const { data: relatedCarsId = [], isLoading, isError } = useFetchPartRelatedWithCar({
    legacy_article_id: id,
  });

  const { data: compatibleVehicles, isLoading: compatibleVehiclesLoading } = useFetchVehicleById({
    car_ids: relatedCarsId.length > 0 ? relatedCarsId.slice(0, 25) : [],
  });

  React.useEffect(() => {
    if (compatibleVehicles) {
      setCompatibilities(compatibleVehicles);
    }
  }, [compatibleVehicles]);

  React.useEffect(() => {
    if (selectedCompatibilities.length > 0) {
      const makeSet = new Set(); // To avoid duplicates
      const modelSet = new Set();
      const engineSet = new Set();
  
      selectedCompatibilities.forEach((item: any) => {
        makeSet.add(item.vehicleDetails.manuName); // Make
        modelSet.add(item.vehicleDetails.modelName); // Model
        engineSet.add(`${item.vehicleDetails.typeName} - ${item.vehicleDetails.powerHpFrom}HP`); // Engine
      });
  
      setStaticcompatibility((prev : any) => {
        return prev.map((category : any) => {
          if (category.category === 'Make') {
            return { ...category, subCategories: Array.from(makeSet) };
          }
          if (category.category === 'Model') {
            return { ...category, subCategories: Array.from(modelSet) };
          }
          if (category.category === 'Engine') {
            return { ...category, subCategories: Array.from(engineSet) };
          }
          return category;
        });
      });
    }
  }, [selectedCompatibilities]);

  const handlePress = (category: string) => {
    setOpenCategory((prev) => (prev === category ? null : category));
  };

  const handleSelectCompatibility = (item: any) => {
    const isSelected = selectedCompatibilities.some(
      (compatibility : any) => compatibility.vehicleDetails.carId === item.vehicleDetails.carId
    );

    if (isSelected) {
      // Remove from selected list
      setCompatibilities((prevCompatibilities: any) =>
        prevCompatibilities.filter((compatibility: any) => compatibility.vehicleDetails.carId !== item.vehicleDetails.carId)
      );
    } else {
      // Add to selected list
      setCompatibilities((prevCompatibilities : any) => [...prevCompatibilities, item]);
    }
  };

  const isSelected = (item: any) => {
    return selectedCompatibilities.some(
      (compatibility: any) => compatibility.vehicleDetails.carId === item.vehicleDetails.carId
    );
  };

  return (
    <PaperProvider>
      <CustomModal
        isVisible={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        back={true}
        title='Compatible Vehicles'
      >
        <ScrollView style={styles.container}>
          <Text style={[combineStyles(GlobalStyles, 'background_softer_blue', 'padding_sm'), {
            marginBottom: 12
          }]}>Selected Vehicles </Text>
          <View style={combineStyles(GlobalStyles, 'background_white', 'rounded_full', 'safeArea')}>
            {compatibleVehiclesLoading ? (
              <Text>Loading...</Text>
            ) : (
              selectedCompatibilities &&
              selectedCompatibilities.length > 0 && (
                selectedCompatibilities.map((item: any, index: number) => {
                  const vehicleName = `${item.vehicleDetails.manuName} ${item.vehicleDetails.modelName} ${item.vehicleDetails.typeName}`;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.pickerItem}
                      onPress={() => handleSelectCompatibility(item)}
                    >
                      {/* Radio button */}
                      <View style={styles.radioButtonContainer}>
                        <View style={[styles.radioButton, isSelected(item) && styles.radioButtonSelected]} />
                      </View>
                      <Text>{vehicleName}</Text>
                    </TouchableOpacity>
                  );
                })
              )
            )}
          </View>
        </ScrollView>
      </CustomModal>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setIsModelModalOpen(true)} style={[{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFF4DE', 
          borderRadius: 10,
          padding: 15
        }]}>
          <View style={combineStyles(GlobalStyles, 'flex_row', 'items_center')}>
            <Text style={{ fontSize: 16}}>{'Vehicle'}</Text>
          </View>
          <MaterialIcons name={"keyboard-arrow-down"} size={24} color="#888" />
        </TouchableOpacity>
        <View>
          {staticcompatibility.map(({ category, subCategories }) => {
            return (
              <CategoryItem
                // image={icon}
                key={category}
                category={category}
                subCategories={subCategories}
                isOpen={openCategory === category}
                onPress={() => handlePress(category)}
              />
            );
          })}
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 18,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  radioButtonContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  radioButtonSelected: {
    backgroundColor: '#007bff', // Color when selected
  },
  accordionWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 16,
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  brandAccordion: {
    backgroundColor: 'white',
    height: 60,
    width: width * 0.75,
    paddingHorizontal: 0,
  },
  modelAccordion: {
    backgroundColor: 'white',
    height: 60,
    width: width * 0.7,
    paddingLeft: 20,
  },
  carItem: {
    backgroundColor: 'white',
    height: 60,
    width: width * 0.65,
    paddingLeft: 40,
  },
  iconContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 32,
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default CompatibilityCompV2;

