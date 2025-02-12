import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { height, width } from '@/lib';
import { countries } from '@/lib/countries';
import { parsePhoneNumberFromString, getCountryCallingCode, CountryCode } from 'libphonenumber-js';

type FormValues = {
  email: string;
  phone_number: string;
  name: string;
  password: string;
};

const SignUpScreen: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      email: '',
      phone_number: '',
      name: '',
      password: '',
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>('US'); // Default to US

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setLoading(true);
    setModalVisible(false);
    try {
      const phoneNumber = parsePhoneNumberFromString(data.phone_number, countryCode as CountryCode);
      const formattedPhoneNumber = phoneNumber?.formatInternational();

      const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...data, username: formattedPhoneNumber }),
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        setModalMessage('Sign up successful!');
        setIsSuccess(true);

        // Make the second request to resend OTP
        const otpResponse = await fetch(`${process.env.REACT_APP_API_URL}/profile/resend-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: data.email,
            otp_type: 'email_verification',
          }),
        });

        const otpResult = await otpResponse.json();

        if (otpResponse.ok) {
          router.push('/(auth)/otpScreen');
        } else {
          setModalMessage(`OTP resend failed: ${otpResult.detail || 'Unknown error'}`);
          setIsSuccess(false);
          setModalVisible(true);
        }
      } else {
        setModalMessage(`Sign up failed: ${result.detail || 'Unknown error'}`);
        setIsSuccess(false);
        setModalVisible(true);
      }
    } catch (error) {
      setLoading(false);
      setModalMessage('Sign up failed: Network error');
      setIsSuccess(false);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color="#1D6AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register</Text>
      </View>

      <Image source={require('@/assets/images/mainLogo.png')} style={styles.logo} />

      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#C4C4C4" style={styles.icon} />
        <Controller
          control={control}
          name="email"
          rules={{ required: 'Email is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#C4C4C4"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <View style={[styles.inputContainer, {paddingLeft: 0}]}>
        <View style={styles.countryCodeContainer}>
          <Picker
            selectedValue={countryCode}
            style={styles.picker}
            onValueChange={(itemValue) => setCountryCode(itemValue as CountryCode)}
          >
            {countries.map((country, index) => (
              <Picker.Item key={index} label={`${country.label}`} value={country.value} />
            ))}
          </Picker>
        </View>
        <Controller
          control={control}
          name="phone_number"
          rules={{ required: 'Phone number is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#C4C4C4"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
            />
          )}
        />
      </View>
      {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number.message}</Text>}

      <View style={styles.inputContainer}>
        <Icon name="user" size={20} color="#C4C4C4" style={styles.icon} />
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#C4C4C4"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
      </View>
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#C4C4C4" style={styles.icon} />
        <Controller
          control={control}
          name="password"
          rules={{ required: 'Password is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#C4C4C4"
              secureTextEntry={!showPassword}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="#C4C4C4" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.signUpButtonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/(auth)/signin')}>
          <Text style={styles.signInButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon
              name={isSuccess ? "check-circle" : "times-circle"}
              size={50}
              color={isSuccess ? "green" : "red"}
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
  logo: {
    alignSelf: 'center',
    marginBottom: 20,
    width: width * 0.3,
    height: height * 0.2,
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 0,
    borderColor: '#E8E8E8',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#333333',
    borderWidth: 0,
    borderColor: 'white'
  },
  countryCodeContainer: {
    marginRight: 10,
  },
  picker: {
    width: Platform.OS === 'ios' ? undefined : 140,
    height: 50,
    color: '#333333',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 12,
  },
  signUpButton: {
    backgroundColor: '#1D6AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInButton: {
    borderColor: '#1D6AFF',
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#1D6AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F9F9F9',
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

export default SignUpScreen;
