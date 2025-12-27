import React from 'react';
import Svg, { Path, Circle, Rect, Defs, Stop, LinearGradient as SvgLinearGradient } from 'react-native-svg';
import { colors } from '../../theme/ThemeContext';


export const AetherLogo = ({ size = 60 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 60 60">
        <Defs>
            <SvgLinearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor={colors.lavender} />
                <Stop offset="1" stopColor={colors.lavenderLight} />
            </SvgLinearGradient>
        </Defs>
        <Circle cx="30" cy="30" r="28" stroke="url(#logoGrad)" strokeWidth="2" fill="none" />
        <Path d="M30 12 L42 42 L30 36 L18 42 Z" fill="url(#logoGrad)" />
        <Circle cx="30" cy="24" r="4" fill={colors.white} />
    </Svg>
);

export const BackIcon = ({ dark = false }: { dark?: boolean }) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M15 18L9 12L15 6" stroke={dark ? colors.white : colors.black} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const BellIcon = ({ dark = true }: { dark?: boolean }) => (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <Path d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={dark ? colors.grayLight : colors.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const MenuIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M4 6h16M4 12h16M4 18h16" stroke={colors.grayLight} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

export const ChatIcon = ({ dark = true }: { dark?: boolean }) => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={dark ? colors.grayLight : colors.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const EmailIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={colors.gray} strokeWidth="1.5" />
        <Path d="M22 6l-10 7L2 6" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
);

export const LockIcon = ({ size = 20 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="11" width="18" height="11" rx="2" stroke={colors.gray} strokeWidth="1.5" />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
);

export const UserIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke={colors.gray} strokeWidth="1.5" />
        <Path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
);

export const GoogleIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 24 24">
        <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </Svg>
);

export const ShieldIcon = ({ size = 48 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill={colors.lavender + '33'} stroke={colors.lavender} strokeWidth="1.5" />
        <Path d="M9 12l2 2 4-4" stroke={colors.lavender} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const DepositIcon = ({ color = colors.white }: { color?: string }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const WithdrawIcon = ({ color = colors.white }: { color?: string }) => (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path d="M12 20V8m0 0l4 4m-4-4l-4 4M4 4h16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const HomeNavIcon = ({ active = false }: { active?: boolean }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={active ? colors.black : colors.gray} strokeWidth="1.5" fill={active ? colors.black : 'none'} />
    </Svg>
);

export const TransferNavIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path d="M7 16l-4-4m0 0l4-4m-4 4h18M17 8l4 4m0 0l-4 4m4-4H3" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const WalletNavIcon = ({ active = false }: { active?: boolean }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Rect x="2" y="6" width="20" height="14" rx="2" stroke={active ? colors.black : colors.gray} strokeWidth="1.5" fill={active ? colors.white : 'none'} />
        <Path d="M16 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0" fill={active ? colors.black : colors.gray} />
    </Svg>
);

type IconProps = {
  size?: number;
  color?: string;
};

export const ChartNavIcon = ({ size = 24, color = colors.gray }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <Path
      d="M3 3v18h18M7 14l4-4 4 4 5-6"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


export const SettingsNavIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="3" stroke={colors.gray} strokeWidth="1.5" />
        <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={colors.gray} strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
);

export const AppleIcon = ({ size = 22 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={colors.white}>
        <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.98-.45-2.05-.48-3 0-.98.48-1.95.55-2.92.4-1.9-1.35-3.48-5.32-1.4-8.9 1.02-1.78 2.85-2.9 4.88-2.9 1.15.02 2.2.8 2.9.8.65 0 1.95-.82 3.28-.75 1.35.1 2.38.7 3.02 1.65-2.65 1.65-2.2 5.55.5 6.65-.55 1.45-1.35 2.85-2.18 4.05-.9 1.32-1.58 2.3-2 1.6zM15.5 6.05c.5-3.05-2.58-5.55-5.35-5.55-.28 3.2 2.7 5.75 5.35 5.55z" />
    </Svg>
);

export const AmazonIcon = ({ size = 22 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={colors.white}>
        <Path d="M15.5 13.5c0 .7-.5 1.3-1.2 1.3H9.7c-.7 0-1.2-.6-1.2-1.3v-1c0-.7.5-1.3 1.2-1.3h4.6c.7 0 1.2.6 1.2 1.3v1zm3-3c0 .7-.5 1.3-1.2 1.3h-4.6c-.7 0-1.2-.6-1.2-1.3v-1c0-.7.5-1.3 1.2-1.3h4.6c.7 0 1.2.6 1.2 1.3v1zm-6-4c0 .7-.5 1.3-1.2 1.3H6.7c-.7 0-1.2-.6-1.2-1.3v-1c0-.7.5-1.3 1.2-1.3h4.6c.7 0 1.2.6 1.2 1.3v1z" />
        <Path d="M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z" fillOpacity={0} stroke={colors.white} strokeWidth={1.5} />
    </Svg>
);

export const BitcoinBIcon = ({ size = 22 }: { size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={colors.white}>
        <Path d="M16.5 11.5c.5-.5.8-1.2.8-2 0-1.5-1.2-2.8-2.8-2.9V5h-2v1.5h-1V5h-2v1.5H7v2h1.5c.3 0 .5.2.5.5v7c0 .3-.2.5-.5.5H7v2h2.5V20h2v-1.5h1V20h2v-1.6c1.6 0 3-1.4 3-3 0-1.3-.8-2.4-2-2.9zM12 8.5h2c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-2v-3zm2.5 7h-2.5v-3h2.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5z" />
    </Svg>
);

export const UserAvatarIcon = ({ color }: { color: string }) => (
    <Svg width={44} height={44} viewBox="0 0 44 44">
        <Circle cx="22" cy="22" r="22" fill={colors.cardLight} stroke={colors.background} strokeWidth="2" />
        <Circle cx="22" cy="18" r="8" fill={color} />
        <Path d="M10 36c0-6.6 5.4-12 12-12s12 5.4 12 12" fill={color} fillOpacity={0.5} />
    </Svg>
);

export const MT5Icon = ({ size = 24, color = colors.white }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="18" height="18" rx="4" fill={colors.lavender} fillOpacity={0.2} stroke={colors.lavender} strokeWidth={1.5} />
        <Path d="M7 8h10M7 12h8M7 16h6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
);

export const SignalIcon = ({ color = colors.white, size = 20 }: { color?: string; size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <Path d="M2 20h20v-20h-20v20zm2-18h16v16h-16v-16z" fillOpacity={0} />
        <Path d="M12 4v16" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Path d="M6 10v10" stroke={color} strokeWidth={2} strokeLinecap="round" />
        <Path d="M18 14v6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
);

export const ConstructionIcon = ({ color = colors.white, size = 24 }: { color?: string; size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M10.29 2.61L1.67 17.52h20.66l-8.62-14.91h0z" />
        <Path d="M12 8v4" />
        <Path d="M12 16h.01" />
    </Svg>
);

export const SunIcon = ({ size = 22, color = colors.lavender }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="5" />
        <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </Svg>
);

export const MoonIcon = ({ size = 22, color = colors.lavender }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
);
export const ChartSquareIcon = ({ color = colors.lavender, size = 24 }: { color?: string; size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="3" width="18" height="18" rx="5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.1} />
        <Path d="M7.5 13.5L10.5 16.5L16.5 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16.5 16.5V7.5H7.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.5} />
    </Svg>
);

export const BarChartIcon = ({ color = colors.green, size = 24 }: { color?: string; size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M8 17V10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M12 17V6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity={0.7} />
        <Path d="M16 17V12" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeOpacity={0.5} />
    </Svg>
);

export const WalletTwoToneIcon = ({ color = colors.green, size = 24 }: { color?: string; size?: number }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="6" width="18" height="14" rx="4" stroke={color} strokeWidth="1.5" fill={color} fillOpacity={0.1} />
        <Path d="M17 13H19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Circle cx="19" cy="13" r="2" fill={color} />
        <Path d="M3 9C3 7 5 6 7 6H17C19 6 21 7 21 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={0.5} />
    </Svg>
);

export const NotificationsIcon = ({ dark = false }: { dark?: boolean }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill={dark ? colors.white : colors.black} />
    </Svg>
);

export const AlertIcon = ({ size = 24, color = colors.lavender }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={color + '40'} strokeWidth="1.5" />
        <Path d="M12 8V12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <Path d="M12 16H12.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
);

export const PlusIcon = ({ size = 24, color = colors.lavender }: { size?: number; color?: string }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path d="M12 5V19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);
