import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface BottomTabIconProps {
  icon: 'home' | 'image' | 'user' | string;
  color: string;
  size?: number;
}

export const BottomTabIcon: React.FC<BottomTabIconProps> = ({ 
  icon, 
  color, 
  size = 24 
}) => {
  return (
    <View style={styles.container}>
      <FontAwesome 
        name={icon as any} 
        size={size} 
        color={color} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabIcon;