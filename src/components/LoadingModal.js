import React, {useState} from 'react';
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingModal = ({ visible }) => {
  const [modalVisible, setVisible] = useState(visible)
  return(
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {setVisible(false)}}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    </Modal>
  )
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default LoadingModal;
