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
import { ArrowLeft, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<'patron' | 'artisan'>('patron');
  const [email, setEmail] = useState('helene.engels@example.com');
  const [password, setPassword] = useState('••••••••');

  const handleLogin = () => {
    Alert.alert(
      'Welcome back!',
      `Signed in successfully as ${role === 'patron' ? 'Craft Patron' : 'Master Artisan'}.`
    );
    router.replace('/');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.authCard}>
          <View style={styles.badgeRow}>
            <Sparkles size={13} color={COLORS.terracotta} />
            <Text style={styles.badgeText}>AUTHENTIC FAIR-TRADE ACCESS</Text>
          </View>

          <Text style={styles.title}>Welcome to KlaSetu</Text>
          <Text style={styles.sub}>
            Sign in to support rural craftspeople, track bespoke orders, or manage your maker studio.
          </Text>

          {/* Role Toggle */}
          <View style={styles.roleToggle}>
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
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Mail size={16} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.passLabelRow}>
                <Text style={styles.inputLabel}>Password</Text>
                <Pressable>
                  <Text style={styles.forgotText}>Forgot?</Text>
                </Pressable>
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={16} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            <Pressable style={styles.signInBtn} onPress={handleLogin}>
              <Text style={styles.signInBtnText}>
                Sign In as {role === 'patron' ? 'Patron' : 'Artisan'}
              </Text>
            </Pressable>
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign In */}
          <View style={styles.socialRow}>
            <Pressable
              style={styles.socialBtn}
              onPress={() => {
                Alert.alert('Google Sign In', 'Authenticated with Google.');
                router.replace('/');
              }}
            >
              <Text style={styles.socialBtnText}>Google</Text>
            </Pressable>
            <Pressable
              style={styles.socialBtn}
              onPress={() => {
                Alert.alert('Apple Sign In', 'Authenticated with Apple.');
                router.replace('/');
              }}
            >
              <Text style={styles.socialBtnText}>Apple</Text>
            </Pressable>
          </View>

          {/* Switch to Register */}
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have a KlaSetu account?</Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.switchLink}>Create Account</Text>
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
    justifyContent: 'center',
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
  passLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
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
  signInBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 13,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 6,
  },
  signInBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  socialBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
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
