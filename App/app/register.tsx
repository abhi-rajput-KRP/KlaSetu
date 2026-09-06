import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, Mail, MapPin, Sparkles, User } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<'patron' | 'artisan'>('artisan');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cluster, setCluster] = useState('');

  const handleRegister = () => {
    if (!fullName || !email) {
      Alert.alert('Missing Details', 'Please provide your full name and email address.');
      return;
    }
    Alert.alert(
      'Account Created!',
      `Welcome to KlaSetu as a ${role === 'artisan' ? 'Verified Artisan Maker' : 'Craft Patron'}.`
    );
    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
          <Text style={styles.backBtnText}>Back to Sign In</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.authCard}>
          <View style={styles.badgeRow}>
            <Sparkles size={13} color={COLORS.terracotta} />
            <Text style={styles.badgeText}>JOIN OUR CRAFT ECOSYSTEM</Text>
          </View>

          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.sub}>
            Connect directly with heritage maker clusters across India without export intermediaries.
          </Text>

          {/* Role Toggle */}
          <View style={styles.roleToggle}>
            <Pressable
              style={[styles.roleBtn, role === 'artisan' && styles.roleBtnActive]}
              onPress={() => setRole('artisan')}
            >
              <Text
                style={[
                  styles.roleBtnText,
                  role === 'artisan' && styles.roleBtnTextActive,
                ]}
              >
                Master Artisan
              </Text>
            </Pressable>

            <Pressable
              style={[styles.roleBtn, role === 'patron' && styles.roleBtnActive]}
              onPress={() => setRole('patron')}
            >
              <Text
                style={[
                  styles.roleBtnText,
                  role === 'patron' && styles.roleBtnTextActive,
                ]}
              >
                Craft Patron
              </Text>
            </Pressable>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name / Studio Lead</Text>
              <View style={styles.inputWrapper}>
                <User size={16} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Kailash Chandra Chippa"
                  placeholderTextColor={COLORS.textSecondary}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail size={16} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="artisan@klasetu.org"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={16} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {role === 'artisan' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Maker Cluster / Craft Village</Text>
                <View style={styles.inputWrapper}>
                  <MapPin size={16} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Bagru, Rajasthan"
                    placeholderTextColor={COLORS.textSecondary}
                    value={cluster}
                    onChangeText={setCluster}
                  />
                </View>
              </View>
            )}

            <Pressable style={styles.createBtn} onPress={handleRegister}>
              <Text style={styles.createBtnText}>
                Complete Registration
              </Text>
            </Pressable>
          </View>

          {/* Switch to Login */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.switchLink}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  authCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    elevation: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accentBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  sub: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 4,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: COLORS.primary,
  },
  roleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  roleBtnTextActive: {
    color: '#FFFDF9',
    fontWeight: '800',
  },
  form: {
    gap: 12,
    marginTop: 4,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  createBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  switchText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  switchLink: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
