import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type responseModal = {
    visible?: boolean;
    message?: string;
    success?: boolean;
}
type ResponseModalProps = {
    modal: responseModal;
    onClose?: () => void;
}
const ResponseModal = (props: ResponseModalProps) => {
    
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modal.visible}
      onRequestClose={props.onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Ionicons
            name={props.modal.success ? "checkmark-circle" : "close-circle"}
            size={50}
            color={props.modal.success ? "green" : "red"}
            style={styles.modalIcon}
          />
          <Text>{props.modal.message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={props.onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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

export default ResponseModal;