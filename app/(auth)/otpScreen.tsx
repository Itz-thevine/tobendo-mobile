import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVerifyUserOtpApi } from '@/hooks/api/user/verifyUserOtp';
import OtpTimer from '@/components/OtpTimer';
import { useSendUserOtpApi } from '@/hooks/api/user/sendUserOtp';
import { useLocalUser } from '@/context/local-user/useLocalUser';
import ResponseModal, { responseModal } from '@/components/ResponseModal';

type FormValues = {
  otp: string;
};

const OTPVerificationScreen: React.FC = () => {
  const localUser = useLocalUser();
  const email = localUser?.data?.email;
  const otpType = localUser?.authData.otpType ?? 'email_verification';
  
  // const isSellerHook = useInitializeIsSeller();
  // const [canInitialize, setCanInitialize] = useState(false);

  const verifyApi = useVerifyUserOtpApi();
  const verifyResp = verifyApi.response;
  const verifyLoading = verifyResp.loading;
  
  const sendOtpApi = useSendUserOtpApi();
  const sendOtpResp = sendOtpApi.response;

  const resendOtpLoading = sendOtpResp.loading;

  const { handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      otp: '',
    }
  });

  const [modal, setModal] = useState<responseModal>({});
  const [defaultCountdown, setDefaultCountdown] = useState({
    value: 60,
    key: '',
  });

  const otpRef = useRef<TextInput[]>([]);
  const otpValues = watch('otp').split('');

  const router = useRouter();

  const onSubmit: SubmitHandler<FormValues> = data => {
    if(email) verifyApi.trigger({
        email,
        otp_type: otpType,
        otp_code: data.otp,
    });
  };

  const handleResendOTP = () => {
    if(email) sendOtpApi.trigger({
      email,
      otp_type: otpType,
    });
  };

  const handleOTPChange = (value: string, index: number) => {
    const newOTP = otpValues.slice();
    newOTP[index] = value;
    setValue('otp', newOTP.join(''));

    if (value && index < 5) {
      otpRef.current[index + 1].focus();
    }

    if (index === 5 && value) {
      handleSubmit(onSubmit)();
    }
  };
  const handleCloseModal = () => {
    setModal({
      ...modal,
      visible: false,
    });
    if(verifyResp.success){
      if(localUser?.authData.continueRoute && localUser?.authData.continueRoute) localUser?.updateAuthData({continueRoute: undefined});
      router.push(localUser?.authData.continueRoute ? localUser?.authData.continueRoute : '/(seller)/onboarding-seller');
    };
  }
  // const onIsSellerInitialized = () => {
  //   setModal({
  //     ...modal,
  //     visible: true,
  //     message: 'OTP verified successfully!',
  //     success: true,
  //   });
  // }

  useEffect(() => {
    if(sendOtpResp.loading === false){
      if(sendOtpResp.success){
        setDefaultCountdown({value: 60, key: `${Date.now()}`}); // Reset the countdown timer
        localUser?.update({
          access_token: sendOtpResp.data?.access_token,
        });
        localUser?.updateAuthData({
          otp: sendOtpResp.data?.code,
        });
      }
      else {
        setModal({
          ...modal,
          visible: true,
          success: false,
          message: `OTP resend failed: ${sendOtpResp.error || 'Unknown error'}`,
        });
      }
    }
  }, [sendOtpResp.loading]);
  useEffect(() => {
    const newModal = {...modal};

    if(verifyResp.loading === false){
      // console.log('----otpScreen', verifyResp);
      newModal.visible = true;
      newModal.success = verifyResp.success;
      if(verifyResp.success){
        // newModal.visible = false;
        // setCanInitialize(true);
        newModal.message = 'OTP verified successfully!';
      }
      else {
        // newModal.visible = true;
        newModal.message = `OTP verification failed: ${verifyResp.error || 'Unknown error'}`;
      }
    }
    else {
      newModal.message = undefined;
      newModal.visible = false;
    }

    setModal({...newModal});
  }, [verifyResp.loading]);
  // useEffect(() => {
  //   if(canInitialize && localUser?.data?.access_token){
  //     isSellerHook.initialize();
  //   }
  // }, [canInitialize]);
  // useEffect(() => {
  //   if(isSellerHook.initialized){
  //     onIsSellerInitialized();
  //   }
  // }, [isSellerHook.initialized]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1D6AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify OTP</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Please enter code</Text>
        <Text style={styles.subtitle}>A verification code has been sent to your email</Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.otpContainer}>
          {Array(6).fill(0).map((_, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              ref={(el) => (otpRef.current[index] = el!)}
              onChangeText={(value) => handleOTPChange(value, index)}
              value={otpValues[index] || ''}
            />
          ))}
        </View>
        {errors.otp && <Text style={styles.errorText}>{errors.otp.message}</Text>}

        <OtpTimer
          key={defaultCountdown.key}
          defaultCountdown={defaultCountdown.value}
          otpLoading={resendOtpLoading}
          onResendPress={handleResendOTP}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.verifyButton, otpValues.join('').length < 6 && styles.verifyButtonDisabled]} onPress={handleSubmit(onSubmit)} disabled={otpValues.join('').length < 6 || verifyLoading}>
          {verifyLoading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.verifyButtonText}>Verify</Text>}
        </TouchableOpacity>
      </View>
      
      <ResponseModal
        modal={modal}
        onClose={handleCloseModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30
  },
  headerTitle: {
    fontSize: 16,
    color: '#1D6AFF',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#C4C4C4',
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 12,
  },
  email: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 0,
    borderColor: '#C4C4C4',
    borderRadius: 8,
    textAlign: 'center',
    marginRight: 8,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  footer: {
    marginBottom: 30,
  },
  verifyButton: {
    backgroundColor: '#1D6AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: '#C4C4C4',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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

export default OTPVerificationScreen;
