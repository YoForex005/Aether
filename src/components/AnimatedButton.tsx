import React, { useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';

const AnimatedButton = ({ children, onPress, style, disabled = false }: any) => {
    const scale = useRef(new Animated.Value(1)).current;
    return (
        <TouchableOpacity
            activeOpacity={1}
            disabled={disabled}
            onPress={onPress}
            onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        >
            <Animated.View style={[style, { transform: [{ scale }], opacity: disabled ? 0.5 : 1 }]}>{children}</Animated.View>
        </TouchableOpacity>
    );
};

export default AnimatedButton;
