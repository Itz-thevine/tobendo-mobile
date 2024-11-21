import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { combineStyles } from '@/lib'; // Assuming this is a utility function for combining styles
import { GlobalStyles } from '@/styles'; // Assuming this is your global styles file
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this or another vector icons package
import { addressProps } from '@/hooks/api/address/getAddresses';
import CustomModal from '@/components/shared/custom-modal';

export type deliveryOption = {
  label: string;
  date: string;
  type: 'standard' | 'express-up';
  fee?: number;
}
interface CartAddressSummaryProps {
  totalAmount: number;
  addressList?: addressProps[];
  selectedAddress?: addressProps;
  selectedDeliveryOption?: deliveryOption;
  moveNext: () => void;
  onSelectAddress: (address: addressProps) => void;
  onSelectDeliveryOption: (deliveryOption: deliveryOption) => void;
}
type addressOptions = {
  [addressId: string]: addressProps;
}
  
const CartAddressSummary = (props: CartAddressSummaryProps) => {

  const [openAddresses, setOpenAddresses] = useState(false);
  const [addressOptions, setAddressOptions] = useState<addressOptions>({
    one: {
      address_id: 'one',
      address_line_1: 'Line one',
      city: 'One City',
      state: 'One State',
    },
    two: {
      address_id: 'two',
      address_line_1: 'Line One',
      address_line_2: 'Address Line 2',
      state: 'Two State',
    },
    three: {
      address_id: 'three',
      address_line_1: 'Line three',
      country: 'Three Country',
    },
  });
  const deliveryOptions: deliveryOption[] = [
    {
      type: 'standard',
      label: `Standard`,
      date: `Wed, Jun 10`,
    },
    {
      type: 'express-up',
      label: `ExpressUP`,
      date: `Tomorrow`,
      fee: 11,
    },
  ];
  
  return (
    <SafeAreaView style={combineStyles(GlobalStyles, 'safeArea')}>
      <CustomModal
        isVisible={openAddresses}
        onClose={() => setOpenAddresses(false)}
        back={true}
        title='Choose Address'
      >
        <View style={combineStyles(GlobalStyles, 'padding_xs')}>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            {
              props.addressList?.length ?
              <>
                {
                  props.addressList?.map((address, i) => (
                    <TouchableOpacity key={`${i}_${address.address_id}`} onPress={() => {
                      setAddressOptions({
                        ...addressOptions,
                        [address.address_id ?? '']: address,
                      });
                      setOpenAddresses(false);
                    }}>
                      <Text style={combineStyles(GlobalStyles, 'margin_b_xs')} >{address.address_line_1}</Text >
                    </TouchableOpacity>
                  ))
                }
              </> :
              <Text style={{textAlign: 'center'}}>no address</Text>
            }
          </View>
        </View>
      </CustomModal>
        <ScrollView style={combineStyles(GlobalStyles, 'padding_sm', 'background_softer_blue', 'safeArea')}>
        {/* Address Section */}
        <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_b_sm')}>Address</Text>
        <View>
          {
            Object.entries(addressOptions).map(([addressId, address], i) => {
              const addressNames = [
                ...(address.city ? [address.city] : []),
                ...(address.state ? [address.state] : []),
                ...(address.country ? [address.country] : []),
              ].join(', ');
              const addressLines = [
                ...(address.address_line_1 ? [address.address_line_1] : []),
                ...(address.address_line_2 ? [address.address_line_2] : []),
              ].join(', ');

              return (
                <TouchableOpacity 
                  key={`${i}_${addressId}`}
                  style={address.address_id === props.selectedAddress?.address_id ? styles.selectedOption : styles.option} 
                  onPress={() => {
                    props.onSelectAddress(address);
                  }}
                >
                  <View style={styles.optionContent}>
                  <Text style={combineStyles(GlobalStyles, 'font_bold', 'text_lg')}>{addressNames}</Text>
                  <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_t_xs')}>
                      {addressLines}
                  </Text>
                  </View>
                  {address.address_id === props.selectedAddress?.address_id && <MCIIcon name="check-circle" size={24} color="#007bff" />}
                </TouchableOpacity>
                )
            })
          }
        </View>
        <TouchableOpacity style={combineStyles(GlobalStyles, 'rounded_full', 'background_soft_blue', 'padding_sm', 'items_center', 'margin_t_xs')}
          onPress={() => setOpenAddresses(true)}
        >
            <Text style={combineStyles(GlobalStyles, 'text_lg')}>Add New Address</Text>
        </TouchableOpacity>

        {/* Delivery Options Section */}
        <Text style={combineStyles(GlobalStyles, 'text_2xl', 'margin_t_sm', 'margin_b_sm')}>Delivery Options</Text>
        {
          deliveryOptions.map((deliveryOption, i) => (
            <TouchableOpacity
              key={i}
              style={deliveryOption.type === props.selectedDeliveryOption?.type ? styles.selectedOption : styles.option} 
              onPress={() => {
                if(props.onSelectDeliveryOption) props.onSelectDeliveryOption(deliveryOption);
              }}
            >
              <View style={styles.optionContent}>
                <Text style={combineStyles(GlobalStyles, 'font_bold', 'text_lg')}>{deliveryOption.label}</Text>
                <Text style={combineStyles(GlobalStyles, 'color_gray', 'margin_t_xs')}>{deliveryOption.date}</Text>
                {
                  deliveryOption.fee ?
                  <Text style={combineStyles(GlobalStyles, 'text_lg', 'font_bold')}>${deliveryOption.fee}</Text> :
                  <></>
                }
              </View>
              {deliveryOption.type === props.selectedDeliveryOption?.type && <MCIIcon name="check-circle" size={24} color="#007bff" />}
            </TouchableOpacity>
          ))
        }

        {/* Total and Next Button Section */}
        <View style={{width : '100%', height: 200}}></View>
        </ScrollView>
        <View style={combineStyles(GlobalStyles, 'absolute', 'background_white', 'bottom_0', 'right_0', 'left_0', 'padding_y_xs', 'padding_x_sm')}>
        <View style={[combineStyles(GlobalStyles, 'flex_row', 'jusify_between')]}>
          <Text style={combineStyles(GlobalStyles, 'text_2xl')}>Total</Text>
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_bold')}>{`$${props.totalAmount}`}</Text>
        </View>
        <TouchableOpacity
          style={{
            ...combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm', 'margin_t_xs'),
            opacity: !props.selectedAddress?.address_id || !props.selectedDeliveryOption ? 0.6 : undefined,
          }}
          onPress={props.moveNext}
          disabled={!props.selectedAddress?.address_id || !props.selectedDeliveryOption}
        >
          <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Next</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 10,
    padding: 25,
    marginBottom: 10,
  },
  selectedOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 10,
    padding: 25,
    marginBottom: 10,
    backgroundColor: '#e6f7ff',
  },
  optionContent: {
    flex: 1,
  },
  addNewButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
});

export default CartAddressSummary;
