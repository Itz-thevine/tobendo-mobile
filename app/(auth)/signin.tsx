import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useAuth } from '@/context/auth';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parsePhoneNumberFromString, CountryCode, getCountryCallingCode } from 'libphonenumber-js';
import { height, width } from '@/lib';
import { countries } from '@/lib/countries'; // Ensure this path is correct

type FormValues = {
  emailOrPhone: string;
  password: string;
};

const SignInScreen: React.FC = () => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      emailOrPhone: '',
      password: '',
    }
  });

  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>('US'); // Default to US
  const [rememberPassword, setRememberPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email'); // State to track the selected login method

  useEffect(() => {
    // Load remembered credentials from AsyncStorage
    const loadCredentials = async () => {
      try {
        const savedEmailOrPhone = await AsyncStorage.getItem('emailOrPhone');
        const savedPassword = await AsyncStorage.getItem('password');
        const savedCountryCode = await AsyncStorage.getItem('countryCode') as CountryCode;
        if (savedEmailOrPhone && savedPassword && savedCountryCode) {
          setValue('emailOrPhone', savedEmailOrPhone);
          setValue('password', savedPassword);
          setCountryCode(savedCountryCode);
          setRememberPassword(true);
        }
      } catch (error) {
        console.error('Failed to load saved credentials:', error);
      }
    };
    loadCredentials();
  }, [setValue]);

  const onSubmit: SubmitHandler<FormValues> = async data => {
    setLoading(true);
    setModalVisible(false);
    try {
      let formattedInput: string;
      if (loginMethod === 'phone') {
        const phoneNumber = parsePhoneNumberFromString(data.emailOrPhone, countryCode);
        formattedInput = phoneNumber?.formatInternational() || `${getCountryCallingCode(countryCode)}${data.emailOrPhone}`;
      } else {
        formattedInput = data.emailOrPhone;
      }

      const formData = new FormData();
      formData.append('username', formattedInput);
      formData.append('password', data.password);

      const response = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/profile/token`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setLoading(false);

      if (response.ok) {
        login(result);  // Update the auth context
        setModalMessage('Sign in successful!');
        setIsSuccess(true);
        router.push('(tabs)/home');

        if (rememberPassword) {
          // Save credentials to AsyncStorage
          await AsyncStorage.setItem('emailOrPhone', data.emailOrPhone);
          await AsyncStorage.setItem('password', data.password);
          await AsyncStorage.setItem('countryCode', countryCode);
        } else {
          // Clear saved credentials
          await AsyncStorage.removeItem('emailOrPhone');
          await AsyncStorage.removeItem('password');
          await AsyncStorage.removeItem('countryCode');
        }
      } else {
        setModalMessage(`Sign in failed: ${result.detail || 'Unknown error'}`);
        setIsSuccess(false);
      }
      setModalVisible(true);
    } catch (error) {
      setLoading(false);
      setModalMessage('Sign in failed: Network error');
      setIsSuccess(false);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1D6AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
      </View>

      <Image source={require('@/assets/images/mainLogo.png')} style={styles.logo} />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, loginMethod === 'email' && styles.activeTab]}
          onPress={() => setLoginMethod('email')}
        >
          <Text style={[styles.tabText, loginMethod === 'email' && styles.activeTabText]}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, loginMethod === 'phone' && styles.activeTab]}
          onPress={() => setLoginMethod('phone')}
        >
          <Text style={[styles.tabText, loginMethod === 'phone' && styles.activeTabText]}>Phone</Text>
        </TouchableOpacity>
      </View>

      {loginMethod === 'email' ? (
        <View style={[styles.inputContainer, {paddingLeft: 16}]}>
          <Icon name="envelope" size={20} color="#C4C4C4" style={styles.icon} />
          <Controller
            control={control}
            name="emailOrPhone"
            rules={{ required: 'Email is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                placeholderTextColor="#C4C4C4"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <View style={styles.countryCodeContainer}>
            <Picker
              selectedValue={countryCode}
              style={styles.picker}
              onValueChange={(itemValue) => setCountryCode(itemValue)}
            >
              {countries.map((country, index) => (
                <Picker.Item key={index} label={country.label} value={country.value} />
              ))}
            </Picker>
          </View>
          <Controller
            control={control}
            name="emailOrPhone"
            rules={{ required: 'Phone number is required' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#C4C4C4"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
              />
            )}
          />
        </View>
      )}
      {errors.emailOrPhone && <Text style={styles.errorText}>{errors.emailOrPhone.message}</Text>}

      <View style={[styles.inputContainer, { paddingLeft: 20 }]}>
        <Icon name="lock" size={20} color="#C4C4C4" style={styles.icon} />
        <Controller
          control={control}
          name="password"
          rules={{ required: 'Password is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digits password"
              placeholderTextColor="#C4C4C4"
              secureTextEntry={!showPassword}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="#C4C4C4" />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setRememberPassword(!rememberPassword)}>
          <Ionicons name={rememberPassword ? "checkbox-outline" : "square-outline"} size={20} color="#1D6AFF" />
        </TouchableOpacity>
        <Text style={styles.checkboxText}>Remember Password</Text>
      </View>

      <View style={styles.flexGrow}>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.signInButton} onPress={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.signInButtonText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.createAccountButton} onPress={() => router.push('(auth)/signup')}>
          <Text style={styles.createAccountButtonText}>Create a new account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => router.push('/(auth)/forgotPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
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
            <Ionicons
              name={isSuccess ? "checkmark-circle" : "close-circle"}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#1D6AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#C4C4C4',
  },
  activeTabText: {
    color: '#1D6AFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingRight: 12,
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
    width: Platform.OS === 'ios' ? undefined : 145,
    height: 50,
    color: '#333333',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1D6AFF',
    fontSize: 12,
  },
  signInButton: {
    backgroundColor: '#1D6AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    borderColor: '#1D6AFF',
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createAccountButtonText: {
    color: '#1D6AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  helpText: {
    color: '#333333',
  },
  helpLink: {
    color: '#1D6AFF',
    marginLeft: 4,
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
    backgroundColor: '#1D6AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxText: {
    color: '#333333',
    marginLeft: 8,
  },
  flexGrow: {
    flex: 1,
  },
  footer: {
    marginBottom: 30,
  },
});

export default SignInScreen;
