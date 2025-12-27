import  { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import Layout from '../../components/layout/Layout';

import {
    BackIcon,
    ChartNavIcon,
    WalletNavIcon,
    TransferNavIcon,  
    HomeNavIcon,
    SettingsNavIcon,
    ShieldIcon,
    LockIcon
} from '../../components/icons/Icons';
import { AuthContext } from '../../contexts/AuthContext';
import { MT5Account, MT5Plan, getMT5AccountList, getMT5GroupList, createMT5Account } from '../../services/mt5/mt5Service';
import { Screen } from '../../types';



type ScreenView = 'empty' | 'plans' | 'form';
type AccountType = 'demo' | 'real';

const MT5AccountScreen = ({ kycLevel, onNavigate }: { kycLevel: number; onNavigate: (s: Screen) => void }) => {
    const { colors, isDark } = useTheme();
    const { token } = useContext(AuthContext);
    
    // View state management
    const [currentView, setCurrentView] = useState<ScreenView>('empty');
    const [accountType, setAccountType] = useState<AccountType>('demo');
    
    // Account data
    const [accounts, setAccounts] = useState<MT5Account[]>([]);
    const [hasAccounts, setHasAccounts] = useState(false);
    
    // Plan data
    const [plans, setPlans] = useState<MT5Plan[]>([]);
    const [demoPlans, setDemoPlans] = useState<MT5Plan[]>([]);
    const [realPlans, setRealPlans] = useState<MT5Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<MT5Plan | null>(null);
    
    // Form fields
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedLeverage, setSelectedLeverage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    
    // UI states
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const [isLoadingPlans, setIsLoadingPlans] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const isLevel2Verified = kycLevel >= 2;

    // Fetch accounts on mount
    useEffect(() => {
        fetchAccounts();
    }, []);

    // Fetch plans when navigating to plans view
    useEffect(() => {
        console.log('Current View Changed:', currentView);
        if (currentView === 'plans') {
            console.log('Fetching plans...');
            fetchPlans();
        }
    }, [currentView]);

    // Update password strength
    useEffect(() => {
        updatePasswordStrength();
    }, [password]);

    // Fetch MT5 accounts from API
    const fetchAccounts = async () => {
        if (!token) {
            console.log('No token available');
            return;
        }

        setIsLoadingAccounts(true);
        const result = await getMT5AccountList(token, 1, 20);
        setIsLoadingAccounts(false);

        if (result.success && result.data) {
            const accountList = result.data.mt5AccountList;
            setAccounts(accountList);
            setHasAccounts(accountList.length > 0);
            
            // If accounts exist, show list view instead of empty state
            if (accountList.length > 0) {
                setCurrentView('empty'); // We'll rename this to 'list' later, but keeping 'empty' for now to show accounts
            }
        } else {
            setHasAccounts(false);
            console.error('Failed to fetch accounts:', result.message);
        }
    };

    // Fetch MT5 plans from API
    const fetchPlans = async () => {
        if (!token) {
            Alert.alert('Error', 'Authentication token not found');
            return;
        }

        setIsLoadingPlans(true);
        const result = await getMT5GroupList(token, 1, 20);
        setIsLoadingPlans(false);

        if (result.success && result.data) {
            const allPlans = result.data.groupList;
            setPlans(allPlans);
            setDemoPlans(allPlans.filter(plan => plan.type === 'DEMO'));
            setRealPlans(allPlans.filter(plan => plan.type === 'REAL'));
        } else {
            Alert.alert('Error', result.message || 'Failed to fetch plans');
        }
    };

    // Get filtered plans based on account type
    const filteredPlans = accountType === 'demo' ? demoPlans : realPlans;

    // Calculate password strength
    const updatePasswordStrength = () => {
        let strength = 0;
        if (password.length >= 8 && password.length <= 15) strength++;
        if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        setPasswordStrength(strength);
    };

    // Generate leverage options based on selected plan
    const getLeverageOptions = (): string[] => {
        if (!selectedPlan?.leverage || selectedPlan.leverage <= 0) {
            return [];
        }
        const options: string[] = [];
        for (let i = 100; i <= selectedPlan.leverage; i += 100) {
            options.push(`1:${i}`);
        }
        return options;
    };

    // Check profile completion before proceeding to plans
    const checkAndProceedToPlans = () => {
        console.log('Add New button clicked, KYC Level:', kycLevel, 'isLevel2Verified:', isLevel2Verified);
        
        if (!isLevel2Verified) {
            Alert.alert(
                'Verification Required',
                'Level 2 KYC verification is required to create an MT5 account.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Verify Now', onPress: () => onNavigate('kycForm') }
                ]
            );
            return;
        }
        
        console.log('Navigating to plans view');
        setCurrentView('plans');
    };

    // Switch account type (Demo/Real)
    const switchAccountType = (type: AccountType) => {
        setAccountType(type);
    };

    // Select plan and move to form
    const selectPlan = (plan: MT5Plan) => {
        setSelectedPlan(plan);
        setSelectedLeverage(null); // Reset leverage
        setCurrentView('form');
    };

    // Validate and create account
    const validateAndCreateAccount = async () => {
        if (!selectedPlan || !selectedLeverage || !password) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (password.length < 8 || password.length > 15) {
            Alert.alert('Invalid Password', 'Password must be between 8-15 characters');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match');
            return;
        }

        if (passwordStrength < 4) {
            Alert.alert('Weak Password', 'Password does not meet all requirements');
            return;
        }

        if (!token) {
            Alert.alert('Error', 'Authentication token not found');
            return;
        }

        setIsCreating(true);
        const leverageValue = selectedLeverage.split(':')[1]; // Extract "100" from "1:100"
        const result = await createMT5Account(token, selectedPlan.id, leverageValue, password);
        setIsCreating(false);

        Alert.alert(
            result.success ? 'Success' : 'Error',
            result.message,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        if (result.success) {
                            // Reset form
                            setPassword('');
                            setConfirmPassword('');
                            setSelectedLeverage(null);
                            setSelectedPlan(null);
                            
                            // Refresh account list
                            fetchAccounts();
                            
                            // Navigate back to account list
                            setCurrentView('empty');
                        }
                    }
                }
            ]
        );
    };

    // Get title and back handler for current view
    const getHeaderConfig = () => {
        switch (currentView) {
            case 'empty':
                return { 
                    title: hasAccounts ? 'My MT5 Accounts' : 'MT5 Account', 
                    onBack: () => onNavigate('home') 
                };
            case 'plans':
                return { title: 'Select Account Plan', onBack: () => setCurrentView('empty') };
            case 'form':
                return { title: 'Create Account', onBack: () => setCurrentView('plans') };
        }
    };

    const headerConfig = getHeaderConfig();

    // Password requirements
    const passwordRequirements = [
        { text: 'Between 8–15 characters', met: password.length >= 8 && password.length <= 15 },
        { text: 'Upper and lower case letters', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
        { text: 'At least one number', met: /\d/.test(password) },
        { text: 'At least one special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = [colors.red, colors.red, colors.green, colors.green];
    const currentStrength = strengthLabels[Math.min(passwordStrength, 3)];
    const currentStrengthColor = strengthColors[Math.min(passwordStrength, 3)];

    return (
        <Layout>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
                <TouchableOpacity
                    style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center' }}
                    onPress={headerConfig.onBack}
                >
                    <BackIcon dark={isDark} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>
                    {headerConfig.title}
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {isLoadingAccounts && currentView === 'empty' ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                        <ActivityIndicator size="large" color={colors.lavender} />
                        <Text style={{ marginTop: 12, fontSize: 14, color: colors.gray }}>
                            Loading accounts...
                        </Text>
                    </View>
                ) : (
                    <>
                        {currentView === 'empty' && (hasAccounts ? renderAccountsList() : renderEmptyState())}
                        {currentView === 'plans' && renderPlanSelection()}
                        {currentView === 'form' && renderPasswordForm()}
                    </>
                )}
            </ScrollView>

            {/* Bottom Nav */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 70, backgroundColor: isDark ? colors.cardDark : colors.white, paddingHorizontal: 8, paddingBottom: 8, borderTopWidth: 1, borderTopColor: colors.grayLight + '22' }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('wallet')}><WalletNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('transfer')}><TransferNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('home')}><HomeNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('plans')}><ChartNavIcon /></TouchableOpacity>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} onPress={() => onNavigate('settings')}><SettingsNavIcon /></TouchableOpacity>
            </View>
        </Layout>
    );

    // ============ RENDER METHODS ============

    function renderEmptyState() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, marginTop: 80 }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.lavender + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <ChartNavIcon size={40} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 }}>
                    No MT5 Account
                </Text>
                <Text style={{ fontSize: 14, color: colors.gray, textAlign: 'center', marginBottom: 32 }}>
                    You don't have any MT5 account yet. Create one to start trading.
                </Text>

                {!isLevel2Verified && (
                    <TouchableOpacity
                        style={{ backgroundColor: colors.red + '10', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.red + '22', marginBottom: 20, width: '100%' }}
                        onPress={() => onNavigate('kycForm')}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.red + '22', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldIcon size={20} />
                            </View>
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.red }}>Level 2 Verification Required</Text>
                                <Text style={{ fontSize: 12, color: colors.gray, marginTop: 2 }}>Complete verification to create account</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        backgroundColor: isLevel2Verified ? colors.lavender : colors.grayLight,
                        borderRadius: 14,
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        opacity: isLevel2Verified ? 1 : 0.6,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: isLevel2Verified ? 0.1 : 0,
                        shadowRadius: 4,
                        elevation: isLevel2Verified ? 3 : 0,
                    }}
                    onPress={() => {
                        console.log('Open New Account button pressed!');
                        checkAndProceedToPlans();
                    }}
                    disabled={!isLevel2Verified}
                >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: isLevel2Verified ? colors.black : colors.gray }}>
                        Open New Account
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderAccountsList() {
        return (
            <View style={{ paddingHorizontal: 16 }}>
                {/* Header with Add Button */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
                        My Accounts ({accounts.length})
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: colors.lavender,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 12,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                        onPress={() => {
                            console.log('Add New button pressed!');
                            checkAndProceedToPlans();
                        }}
                    >
                        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black, marginRight: 6 }}>
                            Add New
                        </Text>
                        <Text style={{ fontSize: 18, color: colors.black, fontWeight: 'bold' }}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Account Cards */}
                {accounts.map((account) => (
                    <View
                        key={account.id}
                        style={{
                            marginBottom: 16,
                            borderRadius: 20,
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderColor: colors.grayLight + '22'
                        }}
                    >
                        {/* Account Header with Gradient */}
                        <LinearGradient
                            colors={[colors.cardDark, colors.cardLight]}
                            style={{ padding: 20 }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 12,
                                        backgroundColor: colors.lavender + '22',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <ChartNavIcon />
                                    </View>
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.white }}>
                                            {account.group.name}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: colors.gray }}>
                                            Login: {account.Login}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{
                                    backgroundColor: account.accountType === 'DEMO' 
                                        ? colors.green + '22' 
                                        : colors.lavender + '22',
                                    paddingHorizontal: 10,
                                    paddingVertical: 4,
                                    borderRadius: 10
                                }}>
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '600',
                                        color: account.accountType === 'DEMO' ? colors.green : colors.lavender
                                    }}>
                                        {account.accountType}
                                    </Text>
                                </View>
                            </View>

                            {/* Balance Section */}
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 20,
                                paddingTop: 16,
                                borderTopWidth: 1,
                                borderTopColor: colors.cardLight
                            }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 11, color: colors.gray }}>Balance</Text>
                                    <Text style={{ fontSize: 20, fontWeight: '700', color: colors.white, marginTop: 4 }}>
                                        ${parseFloat(account.Balance).toFixed(2)}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text style={{ fontSize: 11, color: colors.gray }}>Credit</Text>
                                    <Text style={{ fontSize: 20, fontWeight: '700', color: colors.green, marginTop: 4 }}>
                                        ${parseFloat(account.Credit).toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Account Details */}
                        <View style={{
                            backgroundColor: isDark ? colors.cardDark : colors.white,
                            padding: 16
                        }}>
                            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                                <View style={{
                                    flex: 1,
                                    backgroundColor: isDark ? colors.cardLight : colors.lavender + '10',
                                    borderRadius: 12,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: colors.grayLight + '22'
                                }}>
                                    <Text style={{ fontSize: 11, color: colors.gray }}>Leverage</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 4 }}>
                                        1:{account.Leverage}
                                    </Text>
                                </View>
                                <View style={{
                                    flex: 1,
                                    backgroundColor: isDark ? colors.cardLight : colors.lavender + '10',
                                    borderRadius: 12,
                                    padding: 12,
                                    borderWidth: 1,
                                    borderColor: colors.grayLight + '22'
                                }}>
                                    <Text style={{ fontSize: 11, color: colors.gray }}>Equity Prev Day</Text>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginTop: 4 }}>
                                        ${parseFloat(account.EquityPrevDay).toFixed(2)}
                                    </Text>
                                </View>
                            </View>

                            {/* Account Info Grid */}
                            <View style={{
                                backgroundColor: isDark ? colors.cardLight : colors.lavender + '05',
                                borderRadius: 12,
                                padding: 12,
                                borderWidth: 1,
                                borderColor: colors.grayLight + '22'
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ fontSize: 12, color: colors.gray }}>Name</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>
                                        {account.Name}
                                    </Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: colors.grayLight + '22', marginVertical: 8 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ fontSize: 12, color: colors.gray }}>Email</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }} numberOfLines={1}>
                                        {account.Email}
                                    </Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: colors.grayLight + '22', marginVertical: 8 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ fontSize: 12, color: colors.gray }}>Country</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>
                                        {account.Country}
                                    </Text>
                                </View>
                                <View style={{ height: 1, backgroundColor: colors.grayLight + '22', marginVertical: 8 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 12, color: colors.gray }}>Created</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.grayDark }}>
                                        {new Date(account.createdAt).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: colors.lavender,
                                        borderRadius: 12,
                                        paddingVertical: 12,
                                        alignItems: 'center'
                                    }}
                                    onPress={() => onNavigate('deposit')}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.black }}>
                                        Deposit
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: isDark ? colors.cardDark : colors.white,
                                        borderRadius: 12,
                                        paddingVertical: 12,
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: colors.lavender
                                    }}
                                    onPress={() => onNavigate('withdraw')}
                                >
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.lavender }}>
                                        Withdraw
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    function renderPlanSelection() {
        return (
            <View style={{ paddingHorizontal: 16 }}>
                {/* Account Type Tabs */}
                <View style={{ marginBottom: 20, padding: 4, backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 12, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 8,
                                backgroundColor: accountType === 'demo' ? colors.lavender : 'transparent',
                                alignItems: 'center'
                            }}
                            onPress={() => switchAccountType('demo')}
                        >
                            <Text style={{
                                fontSize: 14,
                                fontWeight: accountType === 'demo' ? '600' : '500',
                                color: accountType === 'demo' ? colors.black : colors.gray
                            }}>
                                DEMO
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                paddingVertical: 12,
                                borderRadius: 8,
                                backgroundColor: accountType === 'real' ? colors.lavender : 'transparent',
                                alignItems: 'center'
                            }}
                            onPress={() => switchAccountType('real')}
                        >
                            <Text style={{
                                fontSize: 14,
                                fontWeight: accountType === 'real' ? '600' : '500',
                                color: accountType === 'real' ? colors.black : colors.gray
                            }}>
                                REAL
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Plans List or Loading */}
                {isLoadingPlans ? (
                    <View style={{ alignItems: 'center', marginTop: 60 }}>
                        <ActivityIndicator size="large" color={colors.lavender} />
                        <Text style={{ marginTop: 12, fontSize: 14, color: colors.gray }}>
                            Loading plans...
                        </Text>
                    </View>
                ) : filteredPlans.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 60 }}>
                        <Text style={{ fontSize: 16, color: colors.gray }}>
                            No {accountType === 'demo' ? 'Demo' : 'Real'} plans available
                        </Text>
                    </View>
                ) : (
                    filteredPlans.map((plan) => (
                        <View
                            key={plan.id}
                            style={{
                                marginBottom: 16,
                                padding: 16,
                                backgroundColor: isDark ? colors.cardDark : colors.white,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: colors.grayLight + '22'
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary }}>
                                        {plan.name}
                                    </Text>
                                    <View style={{
                                        marginLeft: 8,
                                        paddingHorizontal: 8,
                                        paddingVertical: 2,
                                        backgroundColor: plan.type === 'DEMO' ? colors.green + '15' : colors.red + '15',
                                        borderRadius: 6
                                    }}>
                                        <Text style={{
                                            fontSize: 10,
                                            fontWeight: '600',
                                            color: plan.type === 'DEMO' ? colors.green : colors.red
                                        }}>
                                            {plan.type}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: colors.grayLight + '22' }}>
                                    <Text style={{ fontSize: 12, color: colors.gray }}>{plan.chipLabel}</Text>
                                </View>
                            </View>

                            <View style={{ height: 1, backgroundColor: colors.grayLight + '22', marginVertical: 8 }} />

                            {renderPlanDetail('Min Deposit', plan.minDeposit)}
                            <View style={{ height: 1, backgroundColor: colors.grayLight + '22', marginVertical: 8 }} />
                            {renderPlanDetail('Spread', plan.spread)}
                            <View style={{ height: 1, backgroundColor: colors.grayLight + '22', marginVertical: 8 }} />
                            {renderPlanDetail('Commission', plan.commission)}
                            <View style={{ height: 1, backgroundColor: colors.grayLight + '22', marginVertical: 8 }} />
                            {renderPlanDetail('Max Leverage', plan.leverage?.toString() || '0')}

                            <TouchableOpacity
                                style={{
                                    marginTop: 16,
                                    paddingVertical: 12,
                                    backgroundColor: colors.lavender,
                                    borderRadius: 12,
                                    alignItems: 'center'
                                }}
                                onPress={() => selectPlan(plan)}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
                                    Select Plan
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </View>
        );
    }

    function renderPlanDetail(label: string, value: string) {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 }}>
                <Text style={{ fontSize: 14, color: colors.gray }}>{label}</Text>
                <Text style={{ fontSize: 14, color: colors.grayDark }}>{value}</Text>
            </View>
        );
    }

    function renderPasswordForm() {
        const leverageOptions = getLeverageOptions();

        return (
            <View style={{ paddingHorizontal: 16 }}>
                {/* Plan Summary */}
                <View style={{
                    padding: 16,
                    backgroundColor: isDark ? colors.cardDark : colors.white,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: colors.grayLight + '22',
                    marginBottom: 20
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textPrimary }}>
                            {selectedPlan?.name}
                        </Text>
                        {selectedPlan && (
                            <View style={{
                                marginLeft: 8,
                                paddingHorizontal: 8,
                                paddingVertical: 2,
                                backgroundColor: selectedPlan.type === 'DEMO' ? colors.green + '15' : colors.red + '15',
                                borderRadius: 6,
                                borderWidth: 1,
                                borderColor: selectedPlan.type === 'DEMO' ? colors.green : colors.red
                            }}>
                                <Text style={{
                                    fontSize: 10,
                                    fontWeight: '600',
                                    color: selectedPlan.type === 'DEMO' ? colors.green : colors.red
                                }}>
                                    {selectedPlan.type}
                                </Text>
                            </View>
                        )}
                    </View>
                    {renderPlanDetail('Spread', selectedPlan?.spread || '0')}
                    {renderPlanDetail('Commission', selectedPlan?.commission || '0')}
                    {renderPlanDetail('Max Leverage', selectedPlan?.leverage?.toString() || '0')}
                </View>

                {/* Leverage Selection */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Select Leverage *
                    </Text>
                    <View style={{
                        backgroundColor: isDark ? colors.cardDark : colors.white,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: colors.grayLight + '22',
                        padding: 16
                    }}>
                        {leverageOptions.length === 0 ? (
                            <Text style={{ fontSize: 14, color: colors.gray }}>No leverage available</Text>
                        ) : (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                {leverageOptions.map((lev) => (
                                    <TouchableOpacity
                                        key={lev}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 16,
                                            borderRadius: 10,
                                            backgroundColor: selectedLeverage === lev ? colors.lavender : colors.white,
                                            borderWidth: 1,
                                            borderColor: selectedLeverage === lev ? colors.lavender : colors.grayLight + '22'
                                        }}
                                        onPress={() => setSelectedLeverage(lev)}
                                    >
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: selectedLeverage === lev ? colors.black : colors.grayDark
                                        }}>
                                            {lev}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                    <Text style={{ fontSize: 11, color: colors.gray, marginTop: 8 }}>
                        Higher leverage increases both potential profits and risks
                    </Text>
                </View>

                {/* Password Input */}
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Trading Password *
                    </Text>
                    <View style={{
                        backgroundColor: isDark ? colors.cardDark : colors.white,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: colors.grayLight + '22',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <TextInput
                            style={{ flex: 1, padding: 16, fontSize: 15, color: colors.textPrimary }}
                            placeholder="Min. 8 characters"
                            placeholderTextColor={colors.gray}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity style={{ paddingRight: 16 }} onPress={() => setShowPassword(!showPassword)}>
                            <Text style={{ fontSize: 12, color: colors.lavender }}>{showPassword ? 'Hide' : 'Show'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Password Requirements */}
                    <View style={{ marginTop: 12 }}>
                        {passwordRequirements.map((req, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                <View style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    backgroundColor: req.met ? colors.green : colors.red,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 8
                                }}>
                                    <Text style={{ fontSize: 10, color: colors.white, fontWeight: 'bold' }}>
                                        {req.met ? '✓' : '✗'}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 12, color: colors.gray }}>{req.text}</Text>
                            </View>
                        ))}
                        <Text style={{ fontSize: 12, color: currentStrengthColor, marginTop: 8, fontWeight: '600' }}>
                            Password strength: {currentStrength}
                        </Text>
                    </View>
                </View>

                {/* Confirm Password */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.gray, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Confirm Password *
                    </Text>
                    <View style={{
                        backgroundColor: isDark ? colors.cardDark : colors.white,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: colors.grayLight + '22'
                    }}>
                        <TextInput
                            style={{ padding: 16, fontSize: 15, color: colors.textPrimary }}
                            placeholder="Re-enter password"
                            placeholderTextColor={colors.gray}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>
                </View>

                {/* Create Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.lavender,
                        borderRadius: 14,
                        paddingVertical: 16,
                        alignItems: 'center',
                        opacity: isCreating ? 0.6 : 1
                    }}
                    onPress={validateAndCreateAccount}
                    disabled={isCreating}
                >
                    {isCreating ? (
                        <ActivityIndicator color={colors.black} />
                    ) : (
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
                            Create MT5 Account
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
};

export default MT5AccountScreen;