import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import CustomerAppHeader from '@/components/shared/customers-app-header';
import ProgressBar from '@/components/shared/progress-bar';
import CartSummary from '@/components/app/customer/cart-summary';
import CartAddressSummary, { deliveryOption } from '@/components/app/customer/cart-address-summary';
import PaymentMethod from '@/components/app/customer/cart-payment-summary';
import CartConfirmation from '@/components/app/customer/cart-confirmation';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import CustomModal from '@/components/shared/custom-modal';
import { router } from 'expo-router';
import { cartItem, useGetCartItemsApi } from '@/hooks/api/user-cart/getCartItems';
import { useGetProductSuggestionsApi } from '@/hooks/api/user/getProductSuggestions';
import { addressProps, useGetAddressesApi } from '@/hooks/api/address/getAddresses';

const CartScreen = () => {
  const getCartItemsApi = useGetCartItemsApi();
  const getCartItemsResp = getCartItemsApi.response;
  
  const getSuggestionsApi = useGetProductSuggestionsApi();
  const getSuggestionsResp = getSuggestionsApi.response;
  const relatedItems = getSuggestionsResp.data?.result || [];

  const getAddressesApi = useGetAddressesApi();
  const getAddressesResp = getAddressesApi.response;
  
  const [cartItems, setCartItems] = useState(getCartItemsResp.data || []);
  const [totalAmount, setTotalAmout] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<addressProps | undefined>(undefined);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<deliveryOption | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | undefined>(undefined);
  const steps = ['Cart', 'Delivery', 'Payment', 'Confirm'];
  
  const moveNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  const movePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  const removeItem = (itemIndex: number) => {
    const newItems = [...cartItems];
    newItems.splice(itemIndex, 1);
    setCartItems([...newItems]);
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CartSummary
            totalAmount={totalAmount}
            cartItems={cartItems}
            relatedItems={relatedItems}
            loading={getCartItemsResp.loading}
            moveNext={moveNext}
            removeItem={removeItem}
          />
        );
      case 1:
        return <CartAddressSummary
          totalAmount={totalAmount}
          addressList={getAddressesResp.data}
          selectedAddress={selectedAddress}
          selectedDeliveryOption={selectedDeliveryOption}
          onSelectDeliveryOption={setSelectedDeliveryOption}
          onSelectAddress={setSelectedAddress}
          moveNext={moveNext}
        />;
      case 2:
        return <PaymentMethod
          totalAmount={totalAmount}
          moveNext={moveNext}
          onPaymentMethodChange={setSelectedPaymentMethod}
        />;
      case 3:
        return <CartConfirmation
          cartItems={cartItems}
          totalAmount={totalAmount}
          selectedAddress={selectedAddress}
          selectedDeliveryOption={selectedDeliveryOption}
          moveNext={() => setIsConfirmationModalOpen(true)}
          updateItem={updateItem}
          removeItem={removeItem}
        />;
      default:
        return null;
    }
  };
  const getTotalAmount = (items: cartItem[]) => {
    let newTotalAmount = 0;
      items.map((item) => {
        newTotalAmount += (item.product_details?.price ?? 0) * (item.quantity ?? 0);
      });

    return newTotalAmount;
  }
  const updateItem = (itemIndex: number, itemProps: Partial<cartItem>) => {
    const newItems = [...cartItems];
    const item = newItems[itemIndex];
    if(item){
      newItems[itemIndex] = {
        ...item,
        ...itemProps,
      };
    }
    setCartItems(newItems);
    setTotalAmout(getTotalAmount(newItems));
  }

  useEffect(() => {
    getCartItemsApi.trigger();
  }, []);
  useEffect(() => {
    if(getCartItemsResp.success){
      setCartItems(getCartItemsResp.data || []);
    }
  }, [getCartItemsResp.success]);
  useEffect(() => {
    setTotalAmout(getTotalAmount(cartItems));
  }, [cartItems.length]);

  return (
    <SafeAreaView style={combineStyles(GlobalStyles, 'safeArea')}>
        <CustomModal
        isVisible={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        contentBackground={'transparent'}
        hasCloseBtn={false}
      >
        <View style={combineStyles(GlobalStyles, 'padding_sm', 'items_center', 'jusify_center', 'safeArea')}>
            <Image
                source={require('@/assets/images/success.png')}
                style={[{width: 180, height: 180}, GlobalStyles.margin_sm]}
                resizeMode="contain"
            />
            <Text style={[combineStyles(GlobalStyles, 'text_5xl', 'font_medium', 'color_white', 'text_center', 'line_5xl', 'margin_b_sm', 'margin_t_sm'), {width: 300}]}>Your order is Successfully Placed!</Text>
            
           
            <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
                <TouchableOpacity style={[combineStyles(GlobalStyles, 'background_royal_blue', 'padding_y_sm', 'rounded_full', 'items_center'), {width: 300, marginTop: 100}]} onPress={() =>{
                  router.push('/orders')
                  setIsConfirmationModalOpen(false)
                }}>
                    <Text style={combineStyles(GlobalStyles, 'color_white', 'font_medium')}>Track your Order</Text>
                </TouchableOpacity>
            </View>
          
        </View>
      </CustomModal>
      <CustomerAppHeader />
      <ProgressBar currentStep={currentStep} steps={steps} moveNext={moveNext} movePrevious={movePrevious} />
      {renderCurrentStep()}
    </SafeAreaView>
  );
};

export default CartScreen;
