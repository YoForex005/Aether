import React from 'react';
import { View, StatusBar } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { SCREEN_WIDTH } from '../constants';

const Layout = ({ children, dark = true, style = {} }: { children: React.ReactNode; dark?: boolean; style?: any }) => {
    const { colors, isDark } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: isDark ? colors.background : colors.white }}>
            <View style={{ flex: 1, maxWidth: SCREEN_WIDTH, alignSelf: 'center', width: '100%', ...style }}>
                <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
                {children}
            </View>
        </View>
    );
};

export default Layout;
