import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

type OtpTimerProps = {
    otpLoading?: boolean;
    defaultCountdown: number;
    onResendPress?: () => void;
}

const OtpTimer = (props: OtpTimerProps) => {
  const [countdown, setCountdown] = useState<number | undefined>(undefined);

  useEffect(() => {
    setCountdown(props.defaultCountdown);
  }, [props.defaultCountdown]);
  useEffect(() => {
    if (typeof countdown === 'number' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <>
        <Text style={styles.countdown}>
        {countdown && countdown > 0 ? `Don't receive code? Resend (${countdown}s)` : 'You can resend the OTP now.'}
        </Text>

        {props.otpLoading ? <ActivityIndicator /> : (
        <TouchableOpacity onPress={props.onResendPress} disabled={(countdown && countdown > 0) ? true : false}>
            <Text style={[
                styles.resendText,
                ...((countdown && countdown > 0) ? [styles.resendTextDisabled] : [])
            ]}>Resend OTP</Text>
        </TouchableOpacity>
        )}
    </>
  );
};

const styles = StyleSheet.create({
  countdown: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 16,
    color: '#1D6AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  resendTextDisabled: {
    color: '#C4C4C4',
  },
});

export default OtpTimer;