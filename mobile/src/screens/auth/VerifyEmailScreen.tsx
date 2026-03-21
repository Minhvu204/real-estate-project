import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from '../../components/common/CustomButton';
import CustomTextInput from '../../components/common/CustomTextInput';
import { useAuth } from '../../hooks/useAuth';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../types/navigation';

type VerifyEmailRouteProp = RouteProp<AuthStackParamList, 'VerifyEmail'>;

const VerifySchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, 'OTP must be exactly 6 digits')
    .required('OTP is required'),
});

export default function VerifyEmailScreen() {
  const { verifyEmail, isVerifying, resendOtp, isResendingOtp } = useAuth();
  const route = useRoute<VerifyEmailRouteProp>();
  const navigation = useNavigation();
  const { userId, email } = route.params;

  const handleVerify = async (values: { otp: string }) => {
    try {
      await verifyEmail({ userId, otp: values.otp });
      // On success, hook automatically sets credentials and redirects
    } catch (error) {
      // Error is handled inside hook
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ userId, email });
    } catch (error) {
      // Error is handled inside hook
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center px-6">
            <View className="mb-10">
              <Text className="text-3xl font-extrabold text-primary mb-2">Verify Email ✉️</Text>
              <Text className="text-gray-500 text-base">
                We sent a 6-digit code to {email}
              </Text>
            </View>

            <Formik
              initialValues={{ otp: '' }}
              validationSchema={VerifySchema}
              onSubmit={handleVerify}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View>
                  <CustomTextInput
                    label="OTP Code"
                    placeholder="Enter 6-digit code"
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={handleChange('otp')}
                    onBlur={handleBlur('otp')}
                    value={values.otp}
                    error={errors.otp}
                    touched={touched.otp}
                  />

                  <View className="mt-4">
                    <CustomButton
                      title="Verify Account"
                      loading={isVerifying}
                      onPress={() => handleSubmit()}
                    />
                  </View>
                </View>
              )}
            </Formik>

            <View className="flex-col items-center mt-6">
              <Text className="text-gray-600 mb-2">Didn't receive the code?</Text>
              <CustomButton
                title="Resend Code"
                outline
                loading={isResendingOtp}
                onPress={handleResend}
              />
              <Text
                className="text-gray-500 underline mt-4"
                onPress={() => navigation.goBack()}
              >
                Back to Sign Up
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
