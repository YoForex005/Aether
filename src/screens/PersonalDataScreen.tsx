import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import Layout from '../components/Layout';
import { Screen } from '../types';
import { BackIcon, LockIcon } from '../components/Icons';
import { updateProfileService } from '../services/profile_services/profile_update';
import { AuthContext } from '../contexts/AuthContext';
import { UserConst } from '../contexts/UserConst';

// ✅ MOVED OUTSIDE - This fixes the keyboard issue
const InputField = ({
    label,
    value,
    onChangeText,
    editable = true,
    isEditing,
    colors,
    keyboardType = "default",
}: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    editable?: boolean;
    isEditing: boolean;
    colors: any;
    keyboardType?: any;
}) => {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.gray,
                    marginBottom: 8,
                }}
            >
                {label}
            </Text>

            <View
                style={{
                    backgroundColor: colors.cardDark,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: isEditing
                        ? colors.lavender + "44"
                        : colors.grayLight + "22",
                }}
            >
                <TextInput
                    style={{
                        padding: 16,
                        fontSize: 15,
                        color: colors.textPrimary,
                    }}
                    value={value}
                    onChangeText={onChangeText}
                    editable={isEditing && editable}
                    keyboardType={keyboardType}
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholderTextColor={colors.gray}
                />
            </View>
        </View>
    );
};

const PersonalDataScreen = ({ onNavigate }: { onNavigate: (s: Screen) => void }) => {

    const { token } = useContext(AuthContext);
    const { colors, isDark } = useTheme();

    const [fullName, setFullName] = useState("");
    const [mobile, setMobile] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFullName(UserConst.name || "User Name");
        setMobile(UserConst.mobile || "+1 234 567 8900");
        setDateOfBirth(UserConst.dob || "1990-01-15");
        setGender(UserConst.gender || "M");
        setAddress(UserConst.address || "Address here");
    }, []);

    const normalizeGender = (text: string) => {
        const val = text.trim().toLowerCase();
        if (val.startsWith("m")) return "M";
        if (val.startsWith("f")) return "F";
        if (val.startsWith("t")) return "T";
        return "";
    };

    const handleSave = async () => {
        if (!["M", "F", "T"].includes(gender)) {
            Alert.alert("Invalid Gender", "Gender must be M, F or T");
            return;
        }

        if (!token) {
            Alert.alert("Error", "Token missing (User not logged in)");
            return;
        }

        setLoading(true);

        const payload = {
            name: fullName,
            mobile: mobile,
            countryCode: "+91",
            dob: dateOfBirth,
            gender: gender,
            address: address,
        };

        const res = await updateProfileService(token, payload);

        setLoading(false);

        if (res.ok) {
            UserConst.updateProfile(res.data.data);
            setFullName(res.data.data.name);
            setMobile(res.data.data.mobile);
            setDateOfBirth(res.data.data.dob);
            setGender(res.data.data.gender);
            setAddress(res.data.data.address);
            Alert.alert("Profile Updated", "Your personal information has been saved.");
            setIsEditing(false);
        } else {
            Alert.alert("Error", res.data?.message || "Something went wrong");
        }
    };

    return (
        <Layout>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingTop: 50,
                    paddingBottom: 16,
                }}
            >
                <TouchableOpacity
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: colors.lavender + "15",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => onNavigate("settings")}
                >
                    <BackIcon dark={isDark} />
                </TouchableOpacity>

                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: colors.textPrimary,
                        marginLeft: 16,
                    }}
                >
                    Personal Data
                </Text>

                <View style={{ flex: 1 }} />

                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: colors.lavender,
                        }}
                    >
                        {isEditing ? "Cancel" : "Edit"}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 160 }}
            >
                {/* Avatar */}
                <View style={{ alignItems: "center", paddingVertical: 24 }}>
                    <View
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: colors.lavender + "22",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth: 3,
                            borderColor: colors.lavender + "44",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 40,
                                fontWeight: "700",
                                color: colors.lavender,
                            }}
                        >
                            {fullName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <InputField
                        label="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        isEditing={isEditing}
                        colors={colors}
                    />

                    <InputField
                        label="Mobile Number"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        isEditing={isEditing}
                        colors={colors}
                    />

                    <InputField
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                        isEditing={isEditing}
                        colors={colors}
                    />

                    <InputField
                        label="Gender (M / F / T)"
                        value={gender}
                        onChangeText={(txt) => setGender(normalizeGender(txt))}
                        isEditing={isEditing}
                        colors={colors}
                    />

                    <InputField
                        label="Address"
                        value={address}
                        onChangeText={setAddress}
                        isEditing={isEditing}
                        colors={colors}
                    />

                    {/* SECURITY BOX */}
                    <View
                        style={{
                            backgroundColor: colors.cardDark,
                            borderRadius: 14,
                            padding: 16,
                            marginTop: 16,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginBottom: 8,
                            }}
                        >
                            <LockIcon size={16} />
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: "600",
                                    color: colors.textPrimary,
                                    marginLeft: 8,
                                }}
                            >
                                Privacy & Security
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: 11,
                                color: colors.gray,
                                lineHeight: 16,
                            }}
                        >
                            Your personal data is encrypted and stored securely.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {isEditing && (
                <View
                    style={{
                        paddingHorizontal: 16,
                        paddingVertical: 16,
                        backgroundColor: colors.lavenderBg,
                        borderTopWidth: 1,
                        borderTopColor: colors.grayLight + "22",
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.lavender,
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: "center",
                        }}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: colors.black,
                            }}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </Layout>
    );
};

export default PersonalDataScreen;