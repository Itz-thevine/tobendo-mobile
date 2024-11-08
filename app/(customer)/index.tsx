import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Image, ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { combineStyles, width } from '@/lib';
import { GlobalStyles } from '@/styles';
import CustomerAppHeader from '@/components/shared/customers-app-header';
import SearchBar from '@/components/app/customer/search-bar';
import VehicleSelector from '@/components/app/customer/vehicle-selector';
import DropdownItem from '@/components/app/customer/drop-down-item';
import PromoItem from '@/components/app/customer/promo-item';
import ManufacturerItem from '@/components/app/customer/manufacturer-item';
import { MarqueeImages } from '@/static';
import Marquee from '@/components/shared/marquee';
import CustomModal from '@/components/shared/custom-modal';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetVehicleMakesApi, vehicleMake } from '@/hooks/api/vehicle/getMakes';
import { useGetVehicleModelsApi, vehicleModel } from '@/hooks/api/vehicle/getModels';
import { useGetVehicleEnginesApi, vehicleEngine } from '@/hooks/api/vehicle/getEngines';
import SubCategoryItems from '@/components/app/customer/sub-category-items';


const CustomerScreen: React.FC = () => {
  const getMakesApi = useGetVehicleMakesApi();
  const getModelsApi = useGetVehicleModelsApi();
  const getEnginesApi = useGetVehicleEnginesApi();

  const getMakesResp = getMakesApi.response;
  const getModelsResp = getModelsApi.response;
  const getEnginesResp = getEnginesApi.response;

  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [make, setMake] = useState<vehicleMake | undefined>(undefined);
  const [model, setModel] = useState<vehicleModel | undefined>(undefined);
  const [engine, setEngine] = useState<vehicleEngine | undefined>(undefined);

  // const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isMakeModalOpen, setIsMakeModalOpen] = useState(false)
  const [isModelModalOpen, setIsModelModalOpen] = useState(false)
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false)

  const router = useRouter()
  
  useEffect(() => {
    const modeCheck = async () => {
      if (await AsyncStorage.getItem('currentMode') === 'seller') {
          router.push('/(seller)/seller')
      }
    }

    modeCheck()
    getMakesApi.trigger();
  }, [])
  useEffect(() => {
    if(make?.id){
      getModelsApi.trigger({
        brand_id: make.id,
      });
    }
  }, [make?.id]);
  useEffect(() => {
    if(make?.id && model?.id){
      getEnginesApi.trigger({
        brand_id: make.id,
        model_id: model.id,
      });
    }
  }, [make?.id, model?.id]);
  
  return (
    <SafeAreaView style={combineStyles(GlobalStyles, 'safeArea')}>
      {/* modals */}

      <CustomModal
        isVisible={isMakeModalOpen}
        onClose={() => setIsMakeModalOpen(false)}
        // height={height - 70}
        back={true}
        title='Choose Make'
      >
        <View style={combineStyles(GlobalStyles, 'padding_xs')}>
          {/* <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'color_gray')}>Popular Makes</Text>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            {
              // [ "Mercedes-Benz", "Audi", "BMW", "Peugeot", "Toyota", "Volkswagen", "Opel", "Renault", "Kia", "Honda"
              // ]
              getMakesResp.data?.counts?.map((make, i) => (
                <TouchableOpacity key={`${i}_${make.id}`} onPress={() => {
                  setMake(make)
                  setIsMakeModalOpen(false)
                }}>
                  <Text style={combineStyles(GlobalStyles, 'margin_b_xs')} >{make.name}</Text >
                </TouchableOpacity>
              ))
            }
          </View> */}

          <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'color_gray', 'margin_t_sm')}>All Makes</Text>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            {
              // [ "Mercedes-Benz", "Audi", "BMW", "Peugeot", "Toyota", "Volkswagen", "Opel", "Renault", "Kia", "Honda"
              // ]
              getMakesResp.data?.counts?.map((make, i) => (
                <TouchableOpacity key={`${i}_${make.id}`} onPress={() => {
                  setMake(make)
                  setIsMakeModalOpen(false)
                }}>
                  <Text style={combineStyles(GlobalStyles, 'margin_b_xs')} >{make.name}</Text >
                </TouchableOpacity>
              ))
            }
          </View>
        </View>
      </CustomModal>
      <CustomModal
        isVisible={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        // height={height - 70}
        back={true}
        title='Choose Model'
      >
        <View style={combineStyles(GlobalStyles, 'padding_xs')}>
          <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'color_gray')}>A-Class</Text>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            {
              //  [ "A-CLASS (W168) (07/1997 - 08/2004)", "A-CLASS (W169) (09/2004 - 06/2012)", "A-CLASS (W177) (03/2018 - ...)", "A-CLASS SALOON (W177) (09/2018 - ...)"
              // ]
              getModelsResp.data?.counts?.map((model, i) => (
                <TouchableOpacity key={`${i}_${model.id}`} onPress={() => {
                  setModel(model)
                  setIsModelModalOpen(false)
                }}>
                  <Text style={combineStyles(GlobalStyles, 'margin_b_xs')} >{model.name}</Text >
                </TouchableOpacity>
              ))
            }
          </View>

          {/* <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'color_gray', 'margin_t_sm')}>AMG GT</Text>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            {
              // [ "AMG GT (C190) (10/2014 - ...)", "AMG GT ROADSTER (R190) (11/2016 - ...)", "AMG GT (X290) (07/2018 - ...)", "A-CLASS (W168) (07/1997 - 08/2004)"
              // ]
              getModelsResp.data?.counts?.map((model, i) => (
                <TouchableOpacity key={`${i}_${model.id}`} onPress={() => {
                  setModel(model)
                  setIsModelModalOpen(false)
                }}>
                  <Text style={combineStyles(GlobalStyles, 'margin_b_xs')} >{model.name}</Text >
                </TouchableOpacity>
              ))
            }
          </View>
         
          <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'color_gray', 'margin_t_sm')}>B-CLASS</Text>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            {
              // [ "B-CLASS (W245) (03/2005 - 11/2011)", "B-CLASS (W246, W242) (10/2011 - 12/2018)", "B-CLASS (W247) (12/2018 - ...)"
              // ]
              getModelsResp.data?.counts?.map((model, i) => (
                <TouchableOpacity key={`${i}_${model.id}`} onPress={() => {
                  setModel(model)
                  setIsModelModalOpen(false)
                }}>
                  <Text style={combineStyles(GlobalStyles, 'margin_b_xs')} >{model.name}</Text >
                </TouchableOpacity>
              ))
            }
          </View> */}
        </View>
      </CustomModal>
      <CustomModal
        isVisible={isEngineModalOpen}
        onClose={() => setIsEngineModalOpen(false)}
        // height={height - 70}
        back={true}
        title='Choose Engine'
      >
        <View style={combineStyles(GlobalStyles, 'padding_xs')}>
          <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'color_gray')}>Diesel</Text>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            {
              //  ["A 160 CDI 1.7 (168.006) (55 KW / 75 HP) (02/2001 - 08/2004)", "A 160 CDI 1.7 (168.007) (44 KW / 60 HP) (07/1998 - 02/2001)", "A 170 CDI 1.7 (168.008) (66 KW / 90 HP) (07/1998 - 02/2001)", "A 160 CDI 1.7 (168.007) (44 KW / 60 HP) (07/1998 - 02/2001)"
              // ]
              getEnginesResp.data?.counts?.map((engine, i) => (
                <TouchableOpacity key={`${i}_${engine.mfrId}`} onPress={() => {
                  console.log(engine.description)
                  setEngine(engine)
                  setIsModelModalOpen(false)
                }}>
                  <Text style={combineStyles(GlobalStyles, 'margin_b_xs')} >{engine.description}</Text >
                </TouchableOpacity>
              ))
            }
          </View>

          {/* <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_medium', 'color_gray', 'margin_b_sm', 'margin_t_sm')}>Diesel</Text>
          {
              //  ["A 160 CDI 1.7 (168.006) (55 KW / 75 HP) (02/2001 - 08/2004)", "A 160 CDI 1.7 (168.007) (44 KW / 60 HP) (07/1998 - 02/2001)", "A 170 CDI 1.7 (168.008) (66 KW / 90 HP) (07/1998 - 02/2001)", "A 160 CDI 1.7 (168.007) (44 KW / 60 HP) (07/1998 - 02/2001)"
              // ]
              getEnginesResp.data?.counts?.map((engine, i) => (
                <TouchableOpacity key={`${i}_${engine.mfrId}`} onPress={() => {
                  setEngine(engine)
                  setIsModelModalOpen(false)
                }}>
                  <Text style={combineStyles(GlobalStyles, 'margin_b_xs')} >{engine.description}</Text >
                </TouchableOpacity>
              ))
            } */}
         
        </View>
      </CustomModal>

      <CustomerAppHeader />
      <ScrollView style={combineStyles(GlobalStyles, 'background_softer_blue')}>
        <View style={combineStyles(GlobalStyles, 'background_dark_blue', 'margin_b_sm')}>
          <SearchBar />
          <ImageBackground source={require('@/assets/images/customer/Home.png')} resizeMode="contain">
            <View style={GlobalStyles.padding_sm}>
              <View style={GlobalStyles.margin_b_sm}>
                <Text style={[combineStyles(GlobalStyles, 'font_lighter', 'text_4xl', 'color_white')]}>
                  Shop for <Text style={combineStyles(GlobalStyles, 'font_bold', 'text_italic')}>Cars, Trucks</Text>
                </Text>
                <Text style={[combineStyles(GlobalStyles, 'font_lighter', 'text_4xl', 'color_white')]}>
                  <Text style={combineStyles(GlobalStyles, 'font_bold', 'text_italic')}>& Motorcycles</Text> Parts
                </Text>
                <Text style={[combineStyles(GlobalStyles, 'font_lighter', 'text_5xl', 'color_white')]}>& Products!</Text>
              </View>
            </View>
          </ImageBackground>

          <View style={combineStyles(GlobalStyles, 'background_white', 'padding_sm', 'margin_sm', 'rounded_xs')}>
            <VehicleSelector selectedVehicle={selectedVehicle} setSelectedVehicle={setSelectedVehicle} />

            <DropdownItem
              label={
                getMakesResp.loading ? 'loading...' :
                (make && make?.id) ? make.name : `Select Make`
              } 
              onPress={() => {
                if(!getMakesResp.loading) setIsMakeModalOpen(true);
              }}
            />
            <DropdownItem
              label={
                getModelsResp.loading ? 'loading...' :
                (model && model?.id) ? model.name : `Select Model`
              }  
              onPress={() => {
                if(!getModelsResp.loading) setIsModelModalOpen(true);
              }} 
            />
            <DropdownItem
              label={
                getEnginesResp.loading ? 'loading...' :
                (engine && engine?.mfrId) ? engine.description : `Select Engine`
              }   
              onPress={() => {
                if(!getEnginesResp.loading) setIsEngineModalOpen(true);
              }}
            />
          </View>

          <View style={[combineStyles(GlobalStyles, 'flex_row', 'jusify_center'), { marginBottom: -50 }]}>
            <TouchableOpacity
              style={[
                combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'margin_sm', 'padding_sm', 'rounded_full'),
                { width: "90%" },
              ]}
              onPress={() => router.push('/(customer)/explore')}
            >
              <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white')}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={combineStyles(GlobalStyles, 'margin_t_sm')}></View>

        <View style={combineStyles(GlobalStyles, 'flex_row', 'jusify_between', 'margin_sm')}>
          <PromoItem image={require('@/assets/images/customer/Group 3.png')} text="Guaranteed Products" />
          <PromoItem image={require('@/assets/images/customer/Group 2.png')} text="Fast Delivery" />
          <PromoItem image={require('@/assets/images/customer/Group 1.png')} text="Online Payment" />
        </View>

        <View style={combineStyles(GlobalStyles, 'margin_sm', 'items_center')}>
          <Image source={require('@/assets/images/customer/promo.png')} style={[{ width: width *0.9 , height: 230 }]} resizeMode="contain" />
        </View>

        <View style={combineStyles(GlobalStyles, 'safeArea', 'jusify_center', 'items_center', )}>
          <Marquee images={MarqueeImages} />
        </View>

        <SubCategoryItems />

        <View style={combineStyles(GlobalStyles, 'items_center', 'margin_t_sm')}> 
          <TouchableOpacity style={combineStyles(GlobalStyles, 'background_soft_blue', 'items_center', 'rounded_full', 'padding_x_sm', 'padding_t_xs', 'padding_b_xs' )}> 
              <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_gray')}>More</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.manufacturerContainer}>
          <Text style={styles.sectionHeader}>Top Manufacturers</Text>
          <View style={styles.manufacturerLogos}>
            {[{
              brand: 'Mercedes',
              icon: require('@/assets/images/customer/Mercedes-Logo.png')
            },
            {
              brand: 'Mazda',
              icon: require('@/assets/images/customer/BMW_logo_(gray).png')
            },{
              brand: 'Nissan',
              icon: require('@/assets/images/customer/nissan.png')
            },{
              brand: 'Hyundai',
              icon: require('@/assets/images/customer/KIA_logo2.png')
            },].map((brand, index) => (
              <ManufacturerItem key={index} icon={brand.icon} brand={brand.brand} />
            ))}
          </View>
          <View style={combineStyles(GlobalStyles)}>
            {['Mercedes', 'BMW', 'Nissan', 'Fiat', 'Mazda', 'Hyundai', 'Audi', 'Alfa Romeo', 'Kia', 'Ford', 'Opel'].map((brand, index) => (
              <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_b_xs')} key={index}>{brand}</Text>
            ))}
          </View>
        </View>

        <View style={styles.searchesContainer}>
          <Text style={styles.sectionHeader}>Top Searches</Text>
          {['SEO Keywords', 'SEO Keywords', 'SEO Keywords', 'SEO Keywords'].map((search, index) => (
            <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_b_xs')} key={index}>
              {search}
            </Text>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  categoryContainer: {
    margin: 20,
    marginBottom: 0,
  },
  manufacturerContainer: {
    margin: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  manufacturerLogos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchesContainer: {
    margin: 20,
  },
  searchText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
});

export default CustomerScreen;
