import { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import AnimatedButton from '../components/AnimatedButton';
import { Screen } from '../types';
import { AuthContext } from "../contexts/AuthContext";
import { PermissionsAndroid } from "react-native";

import {
    BackIcon,
    UserIcon,
    ShieldIcon,
    DepositIcon,
    WalletNavIcon,
    TransferNavIcon,
    HomeNavIcon,
    ChartNavIcon,
    SettingsNavIcon
} from '../components/Icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import CountryPicker, { Country } from '../components/CountryPicker';
import { launchImageLibrary } from 'react-native-image-picker';
import {
    kycLevel1Service,
    kycLevel2UploadService
} from '../services/profile_services/profile_update';

const KYCFormScreen = ({ kycLevel, onSubmit, onBack, onNavigate }: { kycLevel: number; onSubmit: () => void; onBack: () => void; onNavigate: (s: Screen) => void }) => {
    const [loading, setLoading] = useState(false);

    const { token } = useContext(AuthContext);
    const { colors, isDark } = useTheme();

    // ========================= LEVEL 1 STATES =========================
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [country, setCountry] = useState('');
    const [countryCode, setCountryCode] = useState('IN');

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [poi, setPoi] = useState<any>(null);
    const [poa, setPoa] = useState<any>(null);

    const [poiUploaded, setPoiUploaded] = useState(false);
    const [poaUploaded, setPoaUploaded] = useState(false);

    const isLevel2 = kycLevel >= 1;

    //  DOB Calendar
    const onDateChange = (event: any, selected: any) => {
        setShowDatePicker(false);
        if (selected) {
            const y = selected.getFullYear();
            const m = String(selected.getMonth() + 1).padStart(2, '0');
            const d = String(selected.getDate()).padStart(2, '0');
            setDob(`${y}-${m}-${d}`);
        }
    };

    const onSelectCountry = (c: Country) => {
        setCountry(c.name);
        setCountryCode(c.code);
        setShowCountryPicker(false);
    };

    // ====================== OPEN APP SETTINGS ======================
    const openAppSettings = () => {
        Linking.openSettings().catch(() => {
            Alert.alert("Error", "Unable to open settings.");
        });
    };

    // ====================== GALLERY PERMISSIONS ======================
    const requestGalleryPermission = async () => {
        if (Platform.OS !== "android") return true;

        try {
            if (Platform.Version >= 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }

            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.log("PERMISSION ERROR:", err);
            return false;
        }
    };

    // ====================== POI PICK HANDLER ======================
    const openGalleryPOI = async () => {
        const ok = await requestGalleryPermission();

        if (!ok) {
            Alert.alert(
                "Permission Required",
                "Gallery access is needed to upload your ID.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: openAppSettings }
                ]
            );
            return;
        }

        pickImage(setPoi, setPoiUploaded);
    };

    // ====================== POA PICK HANDLER ======================
    const openGalleryPOA = async () => {
        const ok = await requestGalleryPermission();

        if (!ok) {
            Alert.alert(
                "Permission Required",
                "Gallery access is needed to upload your address proof.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: openAppSettings }
                ]
            );
            return;
        }

        pickImage(setPoa, setPoaUploaded);
    };

    // ====================== IMAGE PICK FUNCTION ======================
    const pickImage = async (fileSetter: any, uploadedSetter: any) => {
        try {
            const result = await launchImageLibrary({
                mediaType: "photo",
                quality: 1,
                selectionLimit: 1,
            });

            console.log("IMAGE PICK RESULT:", result);

            if (result.didCancel) return;
            if (!result.assets || !result.assets[0]) return;

            const asset = result.assets[0];

            fileSetter({
                uri: asset.uri,
                name: asset.fileName || "document.jpg",
                type: asset.type || "image/jpeg",
            });

            uploadedSetter(true);
        } catch (err) {
            console.log("PICK IMAGE ERROR:", err);
            Alert.alert("Error", "Cannot open gallery");
        }
    };

    const handleSubmit = async () => {
        // ========== LEVEL 1 ==========
        if (!name || !dob || !countryCode) {
            return Alert.alert("Incomplete", "Please fill all fields.");
        }

        setLoading(true);

        const res = await kycLevel1Service(token!, {
            name,
            dob,
            country,
            countryCode
        });

        setLoading(false);

        if (res.ok) {
            Alert.alert("Success", "Level 1 Completed");
            onSubmit();
        } else {
            Alert.alert("Error", res.data?.message || "Something went wrong");
        }
    };

    const handleUploadPOI = () => {
        Alert.alert('Upload POI', 'Select your ID document (Passport, Driver License, National ID)', [
            { text: 'Cancel' },
            { text: 'Upload', onPress: () => setPoiUploaded(true) }
        ]);
    };

    const handleUploadPOA = () => {
        Alert.alert('Upload POA', 'Select proof of address (Utility Bill, Bank Statement)', [
            { text: 'Cancel' },
            { text: 'Upload', onPress: () => setPoaUploaded(true) }
        ]);
    };

    return (
        <Layout>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 }}>
                <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDark ? colors.cardDark : colors.cardLight, alignItems: 'center', justifyContent: 'center' }} onPress={onBack}>
                    <BackIcon dark={isDark} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginLeft: 16 }}>
                    {isLevel2 ? 'Level 2 Verification' : 'Level 1 Verification'}
                </Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
                    {/* Level Indicator */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <View style={{ backgroundColor: isLevel2 ? colors.green : colors.lavender, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                            <Text style={{ fontSize: 12, fontWeight: '700', color: isLevel2 ? colors.white : colors.black }}>{isLevel2 ? 'LEVEL 2' : 'LEVEL 1'}</Text>
                        </View>
                        <View style={{ flex: 1, height: 4, backgroundColor: colors.cardLight, borderRadius: 2, marginLeft: 12, overflow: 'hidden' }}>
                            <View style={{ width: isLevel2 ? '100%' : '50%', height: 4, backgroundColor: isLevel2 ? colors.green : colors.lavender, borderRadius: 2 }} />
                        </View>
                    </View>

                    {isLevel2 ? (
                        <>
                            {/* Level 2 Content - Document Upload */}
                            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 8 }}>Document Verification</Text>
                            <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 24 }}>Upload documents to enable withdrawals</Text>

                            {/* Benefits Card */}
                            <View style={{ backgroundColor: colors.cardDark, borderRadius: 16, padding: 16, marginBottom: 24 }}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.green, marginBottom: 12 }}>Level 2 Benefits</Text>
                                <View style={{ gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                            <Text style={{ fontSize: 10, color: colors.green }}>1</Text>
                                        </View>
                                        <Text style={{ fontSize: 13, color: colors.textPrimary }}>Withdraw funds to crypto wallet</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                            <Text style={{ fontSize: 10, color: colors.green }}>2</Text>
                                        </View>
                                        <Text style={{ fontSize: 13, color: colors.textPrimary }}>Higher withdrawal limits</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                            <Text style={{ fontSize: 10, color: colors.green }}>3</Text>
                                        </View>
                                        <Text style={{ fontSize: 13, color: colors.textPrimary }}>Priority support access</Text>
                                    </View>
                                </View>
                            </View>

                            {/* POI Upload */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>
                                    Proof of Identity (POI)
                                </Text>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.cardDark,
                                        borderRadius: 14,
                                        padding: 20,
                                        alignItems: 'center',
                                        borderWidth: 2,
                                        borderStyle: 'dashed',
                                        borderColor: poiUploaded ? colors.green : colors.cardLight
                                    }}
                                    onPress={openGalleryPOI}
                                >
                                    {poiUploaded ? (
                                        <View style={{ alignItems: 'center' }}>
                                            <ShieldIcon size={28} />
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    color: colors.green,
                                                    marginTop: 8
                                                }}
                                            >
                                                Document Uploaded
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ alignItems: 'center' }}>
                                            <DepositIcon color={colors.lavender} />
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    color: colors.white,
                                                    marginTop: 8
                                                }}
                                            >
                                                Upload ID Document
                                            </Text>
                                            <Text style={{ fontSize: 11, color: colors.gray, marginTop: 4 }}>
                                                Passport, Driver License, or National ID
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* POA Upload */}
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>
                                    Proof of Address (POA)
                                </Text>

                                <TouchableOpacity
                                    style={{
                                        backgroundColor: colors.cardDark,
                                        borderRadius: 14,
                                        padding: 20,
                                        alignItems: 'center',
                                        borderWidth: 2,
                                        borderStyle: 'dashed',
                                        borderColor: poaUploaded ? colors.green : colors.cardLight
                                    }}
                                    onPress={openGalleryPOA}
                                >
                                    {poaUploaded ? (
                                        <View style={{ alignItems: 'center' }}>
                                            <ShieldIcon size={28} />
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    color: colors.green,
                                                    marginTop: 8
                                                }}
                                            >
                                                Document Uploaded
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ alignItems: 'center' }}>
                                            <DepositIcon color={colors.lavender} />
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: '600',
                                                    color: colors.textPrimary,
                                                    marginTop: 8
                                                }}
                                            >
                                                Upload Address Proof
                                            </Text>
                                            <Text style={{ fontSize: 11, color: colors.gray, marginTop: 4 }}>
                                                Utility Bill or Bank Statement (within 3 months)
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Level 1 Content - Basic Info */}
                            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginBottom: 8 }}>Identity Verification</Text>
                            <Text style={{ fontSize: 14, color: colors.gray, marginBottom: 24 }}>Complete Level 1 to enable deposits</Text>

                            {/* Benefits Card */}
                            <View style={{ backgroundColor: isDark ? colors.cardDark : colors.white, borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: isDark ? 'transparent' : colors.grayLight + '33' }}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.lavender, marginBottom: 12 }}>Level 1 Benefits</Text>
                                <View style={{ gap: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                            <Text style={{ fontSize: 10, color: colors.green }}>1</Text>
                                        </View>
                                        <Text style={{ fontSize: 13, color: colors.textPrimary }}>Deposit funds via crypto</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                            <Text style={{ fontSize: 10, color: colors.green }}>2</Text>
                                        </View>
                                        <Text style={{ fontSize: 13, color: colors.textPrimary }}>View investment plans</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.green + '22', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                            <Text style={{ fontSize: 10, color: colors.green }}>3</Text>
                                        </View>
                                        <Text style={{ fontSize: 13, color: colors.textPrimary }}>Subscribe to trading plans</Text>
                                    </View>
                                </View>
                                <View style={{ borderTopWidth: 1, borderTopColor: colors.cardLight, marginTop: 14, paddingTop: 12 }}>
                                    <Text style={{ fontSize: 11, color: colors.gray }}>Level 2 required for withdrawals</Text>
                                </View>
                            </View>

                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>
                                    Full Legal Name
                                </Text>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: isDark ? colors.cardDark : colors.white,
                                    borderRadius: 14,
                                    paddingHorizontal: 16,
                                    gap: 12,
                                    borderWidth: 1,
                                    borderColor: isDark ? 'transparent' : colors.grayLight + '33'
                                }}>
                                    <UserIcon />
                                    <TextInput
                                        style={{ flex: 1, height: 52, fontSize: 15, color: colors.textPrimary }}
                                        placeholder="As on ID document"
                                        placeholderTextColor={colors.gray}
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

                            {/* DOB */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>
                                    Date of Birth
                                </Text>

                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    style={{
                                        backgroundColor: isDark ? colors.cardDark : colors.white,
                                        borderRadius: 14,
                                        paddingHorizontal: 16,
                                        justifyContent: 'center',
                                        height: 52,
                                        borderWidth: 1,
                                        borderColor: isDark ? 'transparent' : colors.grayLight + '33'
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: dob ? colors.textPrimary : colors.gray }}>
                                        {dob || 'YYYY-MM-DD'}
                                    </Text>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={new Date()}
                                        mode="date"
                                        display="spinner"
                                        onChange={onDateChange}
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>

                            {/* COUNTRY PICKER */}
                            <View style={{ marginBottom: 16 }}>
                                <Text style={{ fontSize: 13, color: colors.grayLight, marginBottom: 8 }}>
                                    Country of Residence
                                </Text>

                                <TouchableOpacity
                                    onPress={() => setShowCountryPicker(true)}
                                    style={{
                                        backgroundColor: isDark ? colors.cardDark : colors.white,
                                        borderRadius: 14,
                                        paddingHorizontal: 16,
                                        justifyContent: 'center',
                                        height: 52,
                                        borderWidth: 1,
                                        borderColor: isDark ? 'transparent' : colors.grayLight + '33'
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: country ? colors.textPrimary : colors.gray }}>
                                        {country || 'Select your country'}
                                    </Text>
                                </TouchableOpacity>

                                <CountryPicker
                                    visible={showCountryPicker}
                                    onClose={() => setShowCountryPicker(false)}
                                    onSelect={onSelectCountry}
                                    countryCode={countryCode}
                                    darkMode={isDark}
                                />
                            </View>
                        </>
                    )}

                    {/* SUBMIT */}
                    <AnimatedButton onPress={handleSubmit} disabled={loading}>
                        <View style={{
                            backgroundColor: colors.lavender,
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: 'center',
                            marginTop: 16
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.black }}>
                                {loading ? 'Verifying...' :
                                    isLevel2 ? 'Complete Level 2' : 'Complete Level 1'}
                            </Text>
                        </View>
                    </AnimatedButton>

                    {/* Info Notice */}
                    <View style={{ backgroundColor: colors.cardDark, borderRadius: 12, padding: 14, marginTop: 16 }}>
                        <Text style={{ fontSize: 11, color: colors.gray, lineHeight: 16 }}>Your information is encrypted and securely stored. Verification typically takes 1-2 minutes.</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

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
};

export default KYCFormScreen;