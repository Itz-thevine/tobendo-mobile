import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useSendUserOtpApi } from '@/hooks/api/user/sendUserOtp';
import { useLocalUser } from '@/context/local-user/useLocalUser';

type FormValues = {
  email: string;
};

const ForgotPasswordScreen = () => {
  const localUser = useLocalUser();

  const sendOtpApi = useSendUserOtpApi();
  const sendOtpResp = sendOtpApi.response;
  const loading = sendOtpResp.loading;

  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      email: '',
    }
  });

  const toggleInputMethod = () => {
    setUsePhone(!usePhone);
  };

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setEmail(data.email);
    sendOtpApi.trigger({
      email: data.email,
      otp_type: 'forgot_password',
    });
  };

  useEffect(() => {
    if(sendOtpResp.loading === false){
      if(sendOtpResp.success){
        // console.log('----forgotPass', sendOtpResp)
        localUser?.update({
          access_token: sendOtpResp.data?.access_token,
          email,
        });
        localUser?.updateAuthData({
          otp: sendOtpResp.data?.code,
          otpType: 'forgot_password',
          continueRoute: '/(auth)/resetPassword',
        });
        
        router.push('/(auth)/otpScreen');
      }
      else {
        setModalMessage(`Error: ${sendOtpResp.error || 'Unknown error'}`);
        setModalVisible(true);
      }
    }
  }, [sendOtpResp.loading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let’s Help You Recover Access</Text>
      <Text style={styles.subtitle}>Welcome back, You’ve been missed!</Text>

      <View style={styles.inputContainer}>
        <Icon
          name={usePhone ? "phone" : "envelope"}
          size={20}
          color="#C4C4C4"
          style={styles.icon}
        />
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email address'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder={usePhone ? "Enter Phone Number" : "Enter Email"}
              placeholderTextColor="#C4C4C4"
              value={value ?? ''} // Ensure the value is always a string
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType={usePhone ? "phone-pad" : "email-address"}
            />
          )}
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <TouchableOpacity style={styles.toggleButtonContainer} onPress={toggleInputMethod}>
        <Text style={styles.toggleButtonText}>
          {usePhone ? "Use Email" : "Use Phone Number"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.continueButtonText}>Continue</Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name="times-circle"
              size={50}
              color="red"
              style={styles.modalIcon}
            />
            <Text>{modalMessage}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#C4C4C4',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#333333',
  },
  toggleButtonContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  toggleButtonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#3FB9AA',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 12,
  },
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
    backgroundColor: '#3FB9AA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
