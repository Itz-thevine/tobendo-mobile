import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import CategoryComponent from '@/components/app/listProducts/addCaetgories';
import AppHeader from '@/components/shared/app-header';
import { combineStyles, height } from '@/lib';
import { GlobalStyles } from '@/styles';
import CharacterCounterInput from '@/components/character-counter-Input';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomModal from '@/components/shared/custom-modal';
import { router, useLocalSearchParams } from 'expo-router';
import CompatibilityCompV2 from '@/components/app/listProducts/compatibility/compatibilty-v2';
import AddBrandToArticle from '@/components/app/listProducts/addBrands';
import { useCreateUserProductsApi } from '@/hooks/api/user/createUserProduct';
import ResponseModal, { responseModal } from '@/components/ResponseModal';
import { partDetailsArticleItem, useGetPartSuggestionDetailsApi } from '@/hooks/api/vehicle/getPartSuggestionDetails';
import { returnNumberFromAny } from '@/hooks/useDigit';
import { convertImageToBase64 } from '@/hooks/useFile';
import { useLocalUser } from '../../../context/local-user/useLocalUser';
import { useLocalSeller } from '../../../context/local-seller/useLocalSeller';


const { width } = Dimensions.get('window');

interface ImageDetails {
  uri: string;
  width: number;
  height: number;
  type: string | undefined;
  // isLocalFile?: boolean;
}


const ProductListing = () => {
  const { id } = useLocalSearchParams();
  const localUser = useLocalUser();
  const sellerHook = useLocalSeller();

  const createApi = useCreateUserProductsApi();
  const createResp = createApi.response;
  const loading = createResp.loading;

  const getPartDetailsApi = useGetPartSuggestionDetailsApi();
  const getPartDetailsResp = getPartDetailsApi.response;
  const articleLoading = getPartDetailsResp.loading;
  const articles = getPartDetailsResp.data?.articles || [];
  const productArticle = articles[0] as partDetailsArticleItem | undefined;

  const [modal, setModal] = useState<responseModal>({});

  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [mainImage, setMainImage] = useState<ImageDetails | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ImageDetails[]>([]);
  const [agreeToTAC, setAgreeToTAC] = useState(false)
  const [isAddInventoryModal, setIsAddInventoryModal] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedCompatibilities, setCompatibilities] = useState<any[]>([]);

  const pickImage = async (setImage: (image: ImageDetails) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const pickedImage = result.assets[0];
      setImage({
        uri: pickedImage.uri,
        width: pickedImage.width,
        height: pickedImage.height,
        type: pickedImage.type,
        // isLocalFile: true,
      });
    }
  };

  const addAdditionalImage = (image: ImageDetails) => {
    setAdditionalImages([...additionalImages, image]);
  };
  
  const handleSubmit = async () => {
    console.log('1')
    if (!productArticle) {
      console.error("No product data available");
      return;
    }
  console.log('2');
    let mainImageBase64: string | undefined;
    if (mainImage?.uri) {
      console.log(mainImage)
      mainImageBase64 = (await convertImageToBase64(mainImage.uri)).base64String;
    }
  
    console.log('3');
    let additionalImagesBase64: string[] = [];
    if (additionalImages.length > 0) {
      for(let i = 0; i < additionalImages.length; i++){
        const image = additionalImages[i];
        if(image.uri){
          const base64 = (await convertImageToBase64(image.uri)).base64String;
          if(base64){
            additionalImagesBase64.push(base64);
          }
        }
      }
    }

    console.log('4')
    createApi.trigger({
      store_name: localUser?.company?.company_name ?? '',
      articleNumber: returnNumberFromAny(productArticle.articleNumber),
      dataSupplierId: 0,
      mfrName: productArticle?.mfrName ?? '',
      genericArticleDescription: title,
      itemDescription: '',
      detailDescription: {},
      legacyArticleId: '',
      assemblyGroupNodeId: (
        selectedCategories.length > 0 ?
        returnNumberFromAny(selectedCategories[selectedCategories?.length - 1].assemblyGroupNodeId) :
        0
      ),
      assemblyGroupName: (
        selectedCategories.length > 0 ?
        (selectedCategories[selectedCategories?.length - 1].assemblyGroupName ?? '') :
        ''
      ),
      linkageTargetTypes: [],
      condition: "new",
      currency: "usd",
      count: returnNumberFromAny(quantity),
      price: returnNumberFromAny(price),
      gtins: [],
      tradeNumbers: [],
      oemNumbers: [],
      images: [
        ...(
          mainImageBase64 ? [mainImageBase64] : []
        ),
        ...additionalImagesBase64
      ],
      car_ids: selectedCompatibilities.map((car) => car.carId) || [],
      criteria: productArticle?.articleCriteria || [],
    });
  
    // Call the mutation
    // mutate(
    //   { article },
    //   {
    //     onSuccess: (value) => {
    //       console.log("Request succeeded:", value);
    //       setIsAddInventoryModal(true);
    //       setIsSubmitting(false);
    //     },
    //     onError: (error) => {
    //       console.log("Request failed:", error);
    //       if (error instanceof AxiosError) {
    //         processError(error);
    //       }
    //       setIsSubmitting(false); // Stop loading state on error
    //     },
    //   }
    // );
  };
  const handleCloseModal = () => {
    setModal({
      ...modal,
      visible: false,
    });
  }
  

  useEffect(() => {
    getPartDetailsApi.trigger({
      legacy_article_ids: parseInt(id as string),
      search_query:'',
      page: 1,
      per_page: 1,
      lang: 'en',
      include_all: true,
      search_type: 99,
    });
  }, []);
  useEffect(() => {
    if (productArticle) {
      const articleImages = productArticle.images;
      if (Array.isArray(articleImages) && articleImages?.length > 0) {
        setMainImage({
          uri: articleImages[0]?.imageURL400, 
          width: 400,
          height: 400,
          type: "image/jpeg"
        });
      }

      // Set the item title from the backend if available
      if (productArticle.genericArticles?.length) {
        setTitle(productArticle.genericArticles[0].genericArticleDescription ?? '');
      }
    }
  }, [productArticle]);
  useEffect(() => {
    if(createResp.loading === false){
      if(createResp.success){
        setIsAddInventoryModal(true);
        sellerHook?.inventory.resetStates();
        sellerHook?.inventory.getProducts();
      }
      else {
        setModal({
          ...modal,
          visible: true,
          success: false,
          message: createResp.error ?? 'something went wrong',
        });
      }
    }
  }, [createResp.loading]);


  

  return (
    <SafeAreaView style={{flex: 1}}>

      <CustomModal
        isVisible={isAddInventoryModal}
        onClose={() => setIsAddInventoryModal(false)}
        contentBackground={'transparent'}
        hasCloseBtn={false}
      >
        <View style={combineStyles(GlobalStyles, 'padding_sm', 'items_center', 'jusify_center', 'safeArea')}>
            <Image
                source={require('@/assets/images/success.png')}
                style={[{width: 180, height: 180}, GlobalStyles.margin_sm]}
                resizeMode="contain"
            />
            <Text style={[combineStyles(GlobalStyles, 'text_5xl', 'font_medium', 'color_white', 'text_center', 'line_5xl', 'margin_b_sm', 'margin_t_sm'), {width: 300}]}>Your Request has been submitted successfully</Text>
            
            <Text style={[combineStyles(GlobalStyles, 'color_white', 'font_medium', 'text_lg' ,'margin_t_sm', 'text_center', 'line_lg'), {
                width: 250
            }]}>We will review your request and activate your account shortly!</Text>
           
            <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
                <TouchableOpacity style={[combineStyles(GlobalStyles, 'background_royal_blue', 'padding_y_sm', 'rounded_full', 'items_center'), {width: 300, marginTop: 100}]} onPress={() =>{
                  router.push('/(seller)')
                  setIsAddInventoryModal(false)
                }}>
                    <Text style={combineStyles(GlobalStyles, 'color_white', 'font_medium')}>Check Account</Text>
                </TouchableOpacity>
            </View>
          
        </View>
      </CustomModal>

      <View style={{
        position: 'relative'
      }}>
        <AppHeader/>

        {
          articleLoading ? (
            <View style={[combineStyles(GlobalStyles, 'background_soft_blue', 'padding_y_sm'), {height}]}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          ) : (
            <ScrollView style={combineStyles(GlobalStyles, 'background_soft_blue')}>
              
              <View style={combineStyles(GlobalStyles, 'padding_x_sm', 'padding_t_sm' )}>
                <Text style={combineStyles(GlobalStyles, 'padding_x_xs', 'text_2xl' )}>List your product</Text>
              </View>

              <View style={combineStyles(GlobalStyles, 'padding_sm', 'items_center' )}>
                <TouchableOpacity style={[combineStyles(GlobalStyles, 'margin_b_sm', 'rounded_xs'), {width: width - 40, height: 200, overflow: 'hidden'}]} onPress={() => pickImage(setMainImage)}>
                  {mainImage ? (
                    <Image source={{ uri: mainImage.uri }} style={[GlobalStyles.rounded_xs, {width: "100%", height: "100%"}]} />
                  ) : (
                    <View style={[combineStyles(GlobalStyles, 'border_gray', 'rounded_xs', 'border_sm', 'background_white',  'items_center', 'jusify_center', 'padding_sm' ), {width:  width - 40, height: 200}]}>
                      <Ionicons name="image-outline" size={50} color="#ccc" />
                      <Text style={styles.uploadText}>Upload Cover Photo</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.imageRow}>
                  {additionalImages.map((image, index) => (
                    <Image key={index} source={{ uri: image.uri }} style={styles.uploadedImageSmall} />
                  ))}
            
                  {[...Array(4 - additionalImages.length)].map((_, index) => (
                    <TouchableOpacity key={index} style={ [combineStyles(GlobalStyles, 'border_sm', 'items_center', 'jusify_center', 'background_white', 'rounded_xs', 'border_gray'),{width: (width - 80)/ 4, height: 80}]} onPress={() => pickImage(addAdditionalImage)}>
                      <Ionicons name="image-outline" size={30} color="#ccc" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View> 

              <View style={combineStyles(GlobalStyles, 'padding_x_sm')}>
              <CharacterCounterInput maxLength={90} value={title} setValue={setTitle} placeholder="Enter Item Title" />
              </View>

              <View style={combineStyles(GlobalStyles, 'padding_x_sm')}>
                <CategoryComponent
                  selectedCategories= {selectedCategories}
                  setSelectedCategories= {setSelectedCategories}
                />
              </View>

              <View style={combineStyles(GlobalStyles, 'padding_x_sm', 'margin_b_sm')}>
                <AddBrandToArticle
                  selectedCategories= {selectedCategories}
                  setSelectedCategories= {setSelectedCategories}
                />
              </View>

              <View style={[combineStyles(GlobalStyles, 'padding_sm', 'rounded_xs'), {backgroundColor: '#EEF1F9'}]}>
                  
              <Text style={[combineStyles(GlobalStyles, 'text_sm', 'margin_b_sm'), { marginTop: 20 }]}>Compatibility</Text>
                <CompatibilityCompV2
                 selectedCompatibilities={selectedCompatibilities} 
                 id={parseInt(id as string)}
                 setCompatibilities={setCompatibilities}
                />

              </View>


              <View style={combineStyles(GlobalStyles, 'padding_x_sm')}>
              {/* <CharacterCounterInput maxLength={450} placeholder="Enter Item Description" /> */}
              </View>

              <View style={combineStyles(GlobalStyles, 'flex_row', 'margin_t_sm', 'gap_sm', 'margin_l_sm', 'margin_r_sm')}>
                <View style={[styles.inputContainer, combineStyles(GlobalStyles, 'padding_b_xs', 'padding_t_xs')]}>
                  <Text style={[combineStyles(GlobalStyles, 'color_gray'), styles.label, {marginTop: 5}]}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={setQuantity}
                    // placeholder="Quantity"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputContainer, combineStyles(GlobalStyles, 'padding_b_xs', 'padding_t_xs')]}>
                  <Text style={[combineStyles(GlobalStyles, 'color_gray'), styles.label,  {marginTop: 5}]}>Price</Text>
                  <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={setPrice}
                    // placeholder="Price"
                    keyboardType="numeric"
                  />
                </View>
              </View>
              <View style={combineStyles(GlobalStyles, 'flex_row', 'margin_sm')}>
                <TouchableOpacity onPress={() => setAgreeToTAC(!agreeToTAC)}>
                    <Icon name={agreeToTAC ? "checkbox-outline" : "square-outline"} size={20} color="#1D6AFF" />
                </TouchableOpacity>
                <Text style={combineStyles(GlobalStyles, 'text_sm', 'margin_l_xs', 'margin_b_sm')}>I agree to Tobendo’s <Text style={combineStyles(GlobalStyles, 'color_royal_blue')}>Terms & Policy</Text>.</Text>
              </View>
              <View style={{
                height: 200
              }}></View>
            </ScrollView>
          )
        }
        <View style={[combineStyles(GlobalStyles, 'background_white', 'padding_x_sm', 'padding_y_xs', 'fixed'), {top : -height * 0.23, width: width}]}>
        <TouchableOpacity 
          style={combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm')} 
          onPress={() => handleSubmit()}
        >
          {
            loading ? (
              <ActivityIndicator size={15} color={'white'}/>
            ): (
              <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Add New Inventory</Text>
            )
          }
           
        </TouchableOpacity>
        </View>
      </View>

      <ResponseModal
        modal={modal}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F243A',
    zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? 40 : 40,
    justifyContent: 'space-between',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: 'medium',
    color: 'white',
    marginLeft: 20,
  },
  
  uploadText: {
    color: '#ccc',
    marginTop: 10,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
  },
 
  uploadedImageSmall: {
    width: (width - 80) / 4,
    height: 80,
    borderRadius: 8,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '50%',
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius : 100,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignSelf:'stretch',
    flex: 1
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: '60%',
    height: 40,
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 24,
    textAlign: 'right'
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#EAE9E5",
    justifyContent: 'center',
  },
  searchTextInput: {
    flex: 1,
    paddingLeft: 10,
    color: 'black',
    alignItems: 'center',
  },
  textArea: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#EAE9E5",
    justifyContent: 'center',
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#f0f0f0',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    textAlign: 'left',
    marginVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});

const ProductListingPage = () => {
  return <ProductListing />;
};

export default ProductListingPage;