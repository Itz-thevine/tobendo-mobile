import { combineStyles } from '@/lib';
import { GlobalStyles } from '@/styles';
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface CharacterCounterInputProps {
  maxLength: number;
  placeholder: string;
  value?: string;
  setValue: (value : string) => void
}

const CharacterCounterInput: React.FC<CharacterCounterInputProps> = ({value = '', setValue, maxLength, placeholder }) => {

  
  return (
    <View style={combineStyles(GlobalStyles, 'background_transparent', 'margin_t_sm')}>
      <TextInput
        style={[combineStyles(GlobalStyles, 'border_gray', 'border_b_xs', 'text_lg', 'padding_x_xs') , {height: 40}]}
        placeholder={placeholder}
        placeholderTextColor="black"
        value={value}
        onChangeText={(value) => setValue(value)}
        maxLength={maxLength}
      />
      <View style={combineStyles(GlobalStyles, 'background_transparent', 'margin_t_xs', 'items_end')}>
        <Text style={combineStyles(GlobalStyles, 'text_lg', 'color_gray')}>{`${value.length} / ${maxLength}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  counterText: {
    fontSize: 12,
    color: '#C0C0C7',
  },
});

export default CharacterCounterInput;
