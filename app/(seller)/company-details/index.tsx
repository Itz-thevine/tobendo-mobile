import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, ScrollView, Pressable, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomModal from '@/components/shared/custom-modal';
import { router } from 'expo-router';
import AppHeader from '@/components/shared/app-header';
import { useAddCompanyDetailsApi } from '@/hooks/api/user/addCompanyDetails';
import { Ionicons } from '@expo/vector-icons';

const CompanyDetailsScreen = () => {
  const companyApi = useAddCompanyDetailsApi();
  const companyResp = companyApi.response;

  const [form, setForm] = useState({
    name: '',
    number: '',
    licenseType: 'License Type',
  });
  const [modal, setModal] = useState({
    visible: false,
    message: '',
  });
  const setFormValue = (formKey: keyof typeof form, formValue: string) => {
    setForm({
      ...form,
      [formKey]: formValue,
    });
  }
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false)
  const lincenses = ['license 1', 'license 2', 'license 3', 'license 4']

  const handleSubmit = () => {
    console.log(form)
    companyApi.trigger({
      company_name: form.name,
      registered_number: form.number,
      license_type: form.licenseType,
    });
  }
  useEffect(() => {
    if(companyResp.loading === false){
      if(companyResp.success){
        router.push('/bank-details')
      }
      else {
        setModal({
          visible: true,
          message: `Error: ${companyResp.error || 'Unknown error'}`,
        });
      }
    }
  }, [companyResp.loading]);
  
  return (
    <SafeAreaView style={combineStyles(GlobalStyles, 'safeArea')}>
      <CustomModal
        isVisible={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      >
        <View style={combineStyles(GlobalStyles, 'padding_sm')}>
          <Text style={combineStyles(GlobalStyles, 'text_2xl', 'font_medium')}>License Types</Text>
          <View style={combineStyles(GlobalStyles, 'margin_t_sm')}>
            {
              lincenses.map((license, i) => (
                <Pressable key={i} onPress={() => {setFormValue('licenseType', license); setIsLicenseModalOpen(false)}}>
                  <Text style={combineStyles(GlobalStyles, 'text_lg', 'padding_y_xs')}>{license}</Text>
                </Pressable>
              ))
            }
          </View>
        </View>
      </CustomModal>

      <AppHeader/>
      <ScrollView style={[combineStyles(GlobalStyles, 'background_soft_blue')]}>
        <View style={combineStyles(GlobalStyles, 'safeArea', 'padding_sm')}>
          <Text style={combineStyles(GlobalStyles, 'text_4xl', 'margin_t_sm')}>Enter your company’s </Text>
          <Text style={combineStyles(GlobalStyles, 'text_4xl', 'margin_b_sm')}>details</Text>

          <View style={combineStyles(GlobalStyles, 'margin_b_sm', 'margin_t_sm')}>
            <Text style={combineStyles(GlobalStyles, 'text_sm', 'color_gray')}>Company Name</Text>
            <TextInput onChangeText={(text) => setFormValue('name', text)} style={combineStyles(GlobalStyles, 'text_lg', 'margin_t_xs', 'border_b_xs', 'border_gray', 'padding_b_xs')} placeholder="Alameya Auto Parts" />
          </View>

          <View style={combineStyles(GlobalStyles, 'margin_b_sm', 'margin_t_sm')}>
            <Text style={combineStyles(GlobalStyles, 'text_sm', 'color_gray')}>Registration Number</Text>
            <TextInput onChangeText={(text) => setFormValue('number', text)} style={combineStyles(GlobalStyles, 'text_lg', 'margin_t_xs', 'border_b_xs', 'border_gray', 'padding_b_xs')} placeholder="5859584-205-HM" />
          </View>

          <TouchableOpacity style={[combineStyles(GlobalStyles, 'background_white', 'rounded_full', 'flex_row', 'jusify_between', 'padding_sm', 'margin_t_sm')]} onPress={() => setIsLicenseModalOpen(true)}>
            <Text style={combineStyles(GlobalStyles, 'text_lg')}>{form.licenseType}</Text>
            <Icon name={ 'chevron-down'} size={20} style={combineStyles(GlobalStyles, 'color_gray')}/>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={combineStyles(GlobalStyles, 'absolute', 'background_white', 'bottom_0', 'right_0', 'left_0', 'padding_y_xs', 'padding_x_sm' )}>
        <TouchableOpacity style={combineStyles(GlobalStyles, 'background_royal_blue', 'items_center', 'rounded_full', 'padding_y_sm')} onPress={handleSubmit}>
                  {
                    companyResp.loading ?
                    <ActivityIndicator color="#FFFFFF" /> :
                    <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_white', 'font_medium')}>Next</Text>
                  }
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal.visible}
        onRequestClose={() => setModal({...modal, visible: false})}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name={companyResp.success ? "checkmark-circle" : "close-circle"}
              size={50}
              color={companyResp.success ? "green" : "red"}
              style={styles.modalIcon}
            />
            <Text>{modal.message}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModal({...modal, visible: false})}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#1D6AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default CompanyDetailsScreen;
