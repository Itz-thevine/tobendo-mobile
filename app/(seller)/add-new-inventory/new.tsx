import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Button,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CategoryComponent from "@/components/app/listProducts/addCaetgories";
import AppHeader from "@/components/shared/app-header";
import { combineStyles, height } from "@/lib";
import { GlobalStyles } from "@/styles";
import CharacterCounterInput from "@/components/character-counter-Input";
import Icon from "react-native-vector-icons/Ionicons";
import CustomModal from "@/components/shared/custom-modal";
import { router, useLocalSearchParams } from "expo-router";
import CompatibilityCompV2 from "@/components/app/listProducts/compatibility/compatibilty-v2";
import AddBrandToArticle from "@/components/app/listProducts/addBrands";
import { useCreateUserProductsApi } from "@/hooks/api/user/createUserProduct";
import ResponseModal, { responseModal } from "@/components/ResponseModal";
import {
  partDetailsArticleItem,
  useGetPartSuggestionDetailsApi,
} from "@/hooks/api/vehicle/getPartSuggestionDetails";
import { returnNumberFromAny } from "@/hooks/useDigit";
import { convertImageToBase64 } from "@/hooks/useFile";
import {
  useGetVehicleMakesApi,
  vehicleMake,
} from "@/hooks/api/vehicle/getMakes";
import {
  useGetVehicleModelsApi,
  vehicleModel,
} from "@/hooks/api/vehicle/getModels";
import {
  useGetVehicleEnginesApi,
  vehicleEngine,
} from "@/hooks/api/vehicle/getEngines";
import { useLocalBuyer } from "@/context/local-buyer/useLocalBuyer";
import DropdownItem from "@/components/app/customer/drop-down-item";
import { useGetPartLinkWithCarApi } from "@/hooks/api/vehicle/getPartLinkWithCar";
import { c } from "@tanstack/query-core/build/legacy/hydration-BZ2M_xzi";

const { width } = Dimensions.get("window");

interface ImageDetails {
  uri: string;
  width: number;
  height: number;
  type: string | undefined;
}

const ProductListing = () => {
  const { id } = useLocalSearchParams();
  const exploreHook = useLocalBuyer()?.explore;

  const createApi = useCreateUserProductsApi();
  const createResp = createApi.response;
  const loading = createResp.loading;
  const getMakesApi = useGetVehicleMakesApi();
  const getModelsApi = useGetVehicleModelsApi();
  const getEnginesApi = useGetVehicleEnginesApi();

  const getMakesResp = getMakesApi.response;
  const getModelsResp = getModelsApi.response;
  const getEnginesResp = getEnginesApi.response;

  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [make, setMake] = useState<vehicleMake | undefined>(undefined);
  const [model, setModel] = useState<vehicleModel | undefined>(undefined);
  const [engine, setEngine] = useState<vehicleEngine | undefined>(undefined);

  // const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [isMakeModalOpen, setIsMakeModalOpen] = useState(false);
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);

  const [modal, setModal] = useState<responseModal>({});

  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [mainImage, setMainImage] = useState<ImageDetails | null>(null);
  const [additionalImages, setAdditionalImages] = useState<ImageDetails[]>([]);
  const [agreeToTAC, setAgreeToTAC] = useState(false);
  const [isAddInventoryModal, setIsAddInventoryModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [selectedCompatibilities, setCompatibilities] = useState<any[]>([]);
  const getPartDetailsApi = useGetPartLinkWithCarApi();
  const partDetailsResp = getPartDetailsApi.response;

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
      });
    }
  };

  const addAdditionalImage = (image: ImageDetails) => {
    setAdditionalImages([...additionalImages, image]);
  };

  const handleSubmit = async () => {
    // if (!productArticle) {
    //   console.error("No product data available");
    //   return;
    // }

    let mainImageBase64: string | undefined;
    if (mainImage) {
      mainImageBase64 = (await convertImageToBase64(mainImage.uri))
        .base64String;
    }

    let additionalImagesBase64: string[] = [];
    if (additionalImages.length > 0) {
      for (let i = 0; i < additionalImages.length; i++) {
        const image = additionalImages[i];
        const base64 = (await convertImageToBase64(image.uri)).base64String;
        if (base64) {
          additionalImagesBase64.push(base64);
        }
      }
    }

    createApi.trigger({
      dataSupplierId: 0,
      mfrName: "",
      genericArticleDescription: title,
      itemDescription: "",
      detailDescription: {},
      legacyArticleId: "",
      assemblyGroupNodeId:
        selectedCategories.length > 0
          ? returnNumberFromAny(
              selectedCategories[selectedCategories?.length - 1]
                .assemblyGroupNodeId
            )
          : 0,
      assemblyGroupName:
        selectedCategories.length > 0
          ? selectedCategories[selectedCategories?.length - 1]
              .assemblyGroupName ?? ""
          : "",
      linkageTargetTypes: [],
      condition: "new",
      currency: "usd",
      count: returnNumberFromAny(quantity),
      price: returnNumberFromAny(price),
      gtins: [],
      tradeNumbers: [],
      oemNumbers: [],
      images: [
        ...(mainImageBase64 ? [mainImageBase64] : []),
        ...additionalImagesBase64,
      ],
      car_ids: selectedCompatibilities.map((car) => car.carId) || [],
      criteria: [],
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
  };

  //   useEffect(() => {
  //     getPartDetailsApi.trigger({
  //       legacy_article_ids: parseInt(id as string),
  //       search_query: "",
  //       page: 1,
  //       per_page: 1,
  //       lang: "en",
  //       include_all: true,
  //       search_type: 99,
  //     });
  //   }, []);
  //   useEffect(() => {
  //     if (productArticle) {
  //       const articleImages = productArticle.images;
  //       if (Array.isArray(articleImages) && articleImages?.length > 0) {
  //         setMainImage({
  //           uri: articleImages[0]?.imageURL400,
  //           width: 400,
  //           height: 400,
  //           type: "image/jpeg",
  //         });
  //       }

  //       // Set the item title from the backend if available
  //       if (productArticle.genericArticles?.length) {
  //         setTitle(
  //           productArticle.genericArticles[0].genericArticleDescription ?? ""
  //         );
  //       }
  //     }
  //   }, [productArticle]);
  useEffect(() => {
    if (createResp.loading === false) {
      if (createResp.success) {
        setIsAddInventoryModal(true);
      } else {
        setModal({
          ...modal,
          visible: true,
          success: false,
          message: createResp.error ?? "something went wrong",
        });
      }
    }
  }, [createResp.loading]);

  const removeAdditionalImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
  };
  useEffect(() => {
    getMakesApi.trigger();
  }, []);
  useEffect(() => {
    if (make?.id) {
      getModelsApi.trigger({
        brand_id: make.id,
      });
    }
  }, [make?.id]);
  useEffect(() => {
    if (make?.id && model?.id) {
      getEnginesApi.trigger({
        brand_id: make.id,
        model_id: model.id,
      });
    }
  }, [make?.id, model?.id]);

  useEffect(() => {
    console.log("engine", engine);
    if (engine) {
      getPartDetailsApi.trigger({
        legacyArticleId: engine?.linkageTargetId as number,
      });
    }
    console.log(typeof engine?.linkageTargetId);
  }, [engine]);
  useEffect(() => {
    if (partDetailsResp.loading === false) {
      if (partDetailsResp.success) {
        console.log("partDetailsResp", partDetailsResp);
      } else {
        console.log("partDetailseer", partDetailsResp.error);
      }
    }
  }, [partDetailsResp.loading]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomModal
        isVisible={isMakeModalOpen}
        onClose={() => setIsMakeModalOpen(false)}
        // height={height - 70}
        back={true}
        title="Choose Make"
      >
        <View style={combineStyles(GlobalStyles, "padding_xs")}>
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

          <Text
            style={combineStyles(
              GlobalStyles,
              "text_lg",
              "font_medium",
              "color_gray",
              "margin_t_sm"
            )}
          >
            All Makes
          </Text>
          <FlatList
            data={getMakesResp.data?.counts}
            keyExtractor={(item, index) => `${index}_${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setMake(item);
                  setIsMakeModalOpen(false);
                  exploreHook?.updateFilters({
                    make: item,
                  });
                }}
              >
                <Text style={combineStyles(GlobalStyles, "margin_b_xs")}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={combineStyles(GlobalStyles, "margin_t_sm")}
          />
        </View>
      </CustomModal>
      <CustomModal
        isVisible={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        // height={height - 70}
        back={true}
        title="Choose Model"
      >
        <View style={combineStyles(GlobalStyles, "padding_xs")}>
          <Text
            style={combineStyles(
              GlobalStyles,
              "text_lg",
              "font_medium",
              "color_gray"
            )}
          >
            A-Class
          </Text>
          <ScrollView style={combineStyles(GlobalStyles, "margin_t_sm")}>
            {
              //  [ "A-CLASS (W168) (07/1997 - 08/2004)", "A-CLASS (W169) (09/2004 - 06/2012)", "A-CLASS (W177) (03/2018 - ...)", "A-CLASS SALOON (W177) (09/2018 - ...)"
              // ]
              getModelsResp.data?.counts?.map((model, i) => (
                <TouchableOpacity
                  key={`${i}_${model.id}`}
                  onPress={() => {
                    setModel(model);
                    setIsModelModalOpen(false);
                    exploreHook?.updateFilters({
                      model,
                    });
                  }}
                >
                  <Text style={combineStyles(GlobalStyles, "margin_b_xs")}>
                    {model.name}
                  </Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>

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
        title="Choose Engine"
      >
        <View style={combineStyles(GlobalStyles, "padding_xs")}>
          <Text
            style={combineStyles(
              GlobalStyles,
              "text_lg",
              "font_medium",
              "color_gray"
            )}
          >
            Diesel
          </Text>
          <ScrollView style={combineStyles(GlobalStyles, "margin_t_sm")}>
            {
              //  ["A 160 CDI 1.7 (168.006) (55 KW / 75 HP) (02/2001 - 08/2004)", "A 160 CDI 1.7 (168.007) (44 KW / 60 HP) (07/1998 - 02/2001)", "A 170 CDI 1.7 (168.008) (66 KW / 90 HP) (07/1998 - 02/2001)", "A 160 CDI 1.7 (168.007) (44 KW / 60 HP) (07/1998 - 02/2001)"
              // ]
              getEnginesResp.data?.counts?.map((engine, i) => (
                <TouchableOpacity
                  key={`${i}_${engine.mfrId}`}
                  onPress={() => {
                    setEngine(engine);
                    setIsEngineModalOpen(false);
                    exploreHook?.updateFilters({
                      engine,
                    });
                  }}
                >
                  <Text style={combineStyles(GlobalStyles, "margin_b_xs")}>
                    {engine.description}
                  </Text>
                </TouchableOpacity>
              ))
            }
          </ScrollView>

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

      <CustomModal
        isVisible={isAddInventoryModal}
        onClose={() => setIsAddInventoryModal(false)}
        contentBackground={"transparent"}
        hasCloseBtn={false}
      >
        <View
          style={combineStyles(
            GlobalStyles,
            "padding_sm",
            "items_center",
            "jusify_center",
            "safeArea"
          )}
        >
          <Image
            source={require("@/assets/images/success.png")}
            style={[{ width: 180, height: 180 }, GlobalStyles.margin_sm]}
            resizeMode="contain"
          />
          <Text
            style={[
              combineStyles(
                GlobalStyles,
                "text_5xl",
                "font_medium",
                "color_white",
                "text_center",
                "line_5xl",
                "margin_b_sm",
                "margin_t_sm"
              ),
              { width: 300 },
            ]}
          >
            Your Request has been submitted successfully
          </Text>

          <Text
            style={[
              combineStyles(
                GlobalStyles,
                "color_white",
                "font_medium",
                "text_lg",
                "margin_t_sm",
                "text_center",
                "line_lg"
              ),
              {
                width: 250,
              },
            ]}
          >
            We will review your request and activate your account shortly!
          </Text>

          <View style={combineStyles(GlobalStyles, "margin_t_sm")}>
            <TouchableOpacity
              style={[
                combineStyles(
                  GlobalStyles,
                  "background_royal_blue",
                  "padding_y_sm",
                  "rounded_full",
                  "items_center"
                ),
                { width: 300, marginTop: 100 },
              ]}
              onPress={() => {
                router.push("/(seller)");
                setIsAddInventoryModal(false);
              }}
            >
              <Text
                style={combineStyles(
                  GlobalStyles,
                  "color_white",
                  "font_medium"
                )}
              >
                Check Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CustomModal>

      <View
        style={{
          position: "relative",
        }}
      >
        <AppHeader />

        <ScrollView style={combineStyles(GlobalStyles, "background_soft_blue")}>
          <View
            style={combineStyles(GlobalStyles, "padding_x_sm", "padding_t_sm")}
          >
            <Text
              style={combineStyles(GlobalStyles, "padding_x_xs", "text_2xl")}
            >
              List your product
            </Text>
          </View>

          <View
            style={combineStyles(GlobalStyles, "padding_sm", "items_center")}
          >
            <TouchableOpacity
              style={[
                combineStyles(GlobalStyles, "margin_b_sm", "rounded_xs"),
                { width: width - 40, height: 200, overflow: "hidden" },
              ]}
              onPress={() => pickImage(setMainImage)}
            >
              {mainImage ? (
                <Image
                  source={{ uri: mainImage.uri }}
                  style={[
                    GlobalStyles.rounded_xs,
                    { width: "100%", height: "100%" },
                  ]}
                />
              ) : (
                <View
                  style={[
                    combineStyles(
                      GlobalStyles,
                      "border_gray",
                      "rounded_xs",
                      "border_sm",
                      "background_white",
                      "items_center",
                      "jusify_center",
                      "padding_sm"
                    ),
                    { width: width - 40, height: 200 },
                  ]}
                >
                  <Ionicons name="image-outline" size={50} color="#ccc" />
                  <Text style={styles.uploadText}>Upload Cover Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.imageRow}>
              {additionalImages.map((image, index) => (
                <View
                  style={{
                    position: "relative",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => removeAdditionalImage(index)}
                    style={[
                      combineStyles(
                        GlobalStyles,
                        "background_danger",
                        "rounded_full",

                        "absolute"
                      ),
                      {
                        zIndex: 10,
                        minHeight: 20,
                        width: 20,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        X
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Image
                    key={index}
                    source={{ uri: image.uri }}
                    style={styles.uploadedImageSmall}
                  />
                </View>
              ))}

              {[...Array(4 - additionalImages.length)].map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    combineStyles(
                      GlobalStyles,
                      "border_sm",
                      "items_center",
                      "jusify_center",
                      "background_white",
                      "rounded_xs",
                      "border_gray"
                    ),
                    { width: (width - 80) / 4, height: 80 },
                  ]}
                  onPress={() => pickImage(addAdditionalImage)}
                >
                  <Ionicons name="image-outline" size={30} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={combineStyles(GlobalStyles, "padding_x_sm")}>
            <CharacterCounterInput
              maxLength={90}
              value={title}
              setValue={setTitle}
              placeholder="Enter Item Title"
            />
          </View>

          <View style={combineStyles(GlobalStyles, "padding_x_sm")}>
            <CategoryComponent
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </View>

          <View
            style={combineStyles(GlobalStyles, "padding_x_sm", "margin_b_sm")}
          >
            <AddBrandToArticle
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </View>

          <View
            style={[
              combineStyles(GlobalStyles, "padding_sm", "rounded_xs"),
              { backgroundColor: "#EEF1F9" },
            ]}
          >
            <Text
              style={[
                combineStyles(GlobalStyles, "text_sm", "margin_b_sm"),
                { marginTop: 20 },
              ]}
            >
              Compatibility
            </Text>
            <DropdownItem
              label={
                getMakesResp.loading
                  ? "loading..."
                  : make && make?.id
                  ? make.name
                  : `Select Make`
              }
              onPress={() => {
                if (!getMakesResp.loading) setIsMakeModalOpen(true);
              }}
            />
            <DropdownItem
              style={{
                backgroundColor: "#fff",
              }}
              label={
                getModelsResp.loading
                  ? "loading..."
                  : model && model?.id
                  ? model.name
                  : `Select Model`
              }
              onPress={() => {
                if (!getModelsResp.loading) setIsModelModalOpen(true);
              }}
            />
            <DropdownItem
              label={
                getEnginesResp.loading
                  ? "loading..."
                  : engine && engine?.mfrId
                  ? engine.description
                  : `Select Engine`
              }
              onPress={() => {
                if (!getEnginesResp.loading) setIsEngineModalOpen(true);
              }}
            />
          </View>

          <View style={combineStyles(GlobalStyles, "padding_x_sm")}>
            {/* <CharacterCounterInput maxLength={450} placeholder="Enter Item Description" /> */}
          </View>

          <View
            style={combineStyles(
              GlobalStyles,
              "flex_row",
              "margin_t_sm",
              "gap_sm",
              "margin_l_sm",
              "margin_r_sm"
            )}
          >
            <View
              style={[
                styles.inputContainer,
                combineStyles(GlobalStyles, "padding_b_xs", "padding_t_xs"),
              ]}
            >
              <Text
                style={[
                  combineStyles(GlobalStyles, "color_gray"),
                  styles.label,
                  { marginTop: 5 },
                ]}
              >
                Quantity
              </Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                // placeholder="Quantity"
                keyboardType="numeric"
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                combineStyles(GlobalStyles, "padding_b_xs", "padding_t_xs"),
              ]}
            >
              <Text
                style={[
                  combineStyles(GlobalStyles, "color_gray"),
                  styles.label,
                  { marginTop: 5 },
                ]}
              >
                Price
              </Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                // placeholder="Price"
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={combineStyles(GlobalStyles, "flex_row", "margin_sm")}>
            <TouchableOpacity onPress={() => setAgreeToTAC(!agreeToTAC)}>
              <Icon
                name={agreeToTAC ? "checkbox-outline" : "square-outline"}
                size={20}
                color="#1D6AFF"
              />
            </TouchableOpacity>
            <Text
              style={combineStyles(
                GlobalStyles,
                "text_sm",
                "margin_l_xs",
                "margin_b_sm"
              )}
            >
              I agree to Tobendo’s{" "}
              <Text style={combineStyles(GlobalStyles, "color_royal_blue")}>
                Terms & Policy
              </Text>
              .
            </Text>
          </View>
          <View
            style={{
              height: 200,
            }}
          ></View>
        </ScrollView>

        <View
          style={[
            combineStyles(
              GlobalStyles,
              "background_white",
              "padding_x_sm",
              "padding_y_xs",
              "fixed"
            ),
            { top: -height * 0.23, width: width },
          ]}
        >
          <TouchableOpacity
            style={combineStyles(
              GlobalStyles,
              "background_royal_blue",
              "items_center",
              "rounded_full",
              "padding_y_sm"
            )}
            onPress={() => handleSubmit()}
          >
            {loading ? (
              <ActivityIndicator size={15} color={"white"} />
            ) : (
              <Text
                style={combineStyles(
                  GlobalStyles,
                  "text_lg",
                  "color_white",
                  "font_medium"
                )}
              >
                Add New Inventory
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ResponseModal modal={modal} onClose={handleCloseModal} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1F243A",
    zIndex: 10,
    paddingTop: Platform.OS === "ios" ? 40 : 40,
    justifyContent: "space-between",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
  headerIcons: {
    flexDirection: "row",
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: "medium",
    color: "white",
    marginLeft: 20,
  },

  uploadText: {
    color: "#ccc",
    marginTop: 10,
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: "50%",
    borderColor: "#ccc",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignSelf: "stretch",
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    width: "60%",
    height: 40,
    borderWidth: 0,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 24,
    textAlign: "right",
  },
  searchIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#EAE9E5",
    justifyContent: "center",
  },
  searchTextInput: {
    flex: 1,
    paddingLeft: 10,
    color: "black",
    alignItems: "center",
  },
  textArea: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  categoryText: {
    color: "white",
    fontWeight: "bold",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#EAE9E5",
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    textAlign: "left",
    marginVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 20,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
});

const ProductListingPage = () => {
  return <ProductListing />;
};

export default ProductListingPage;
