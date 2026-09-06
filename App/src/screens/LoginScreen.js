import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from '../constants/theme';
import Logo from '../assets/Logo';
import { useShop } from '../context/ShopContext';

export default function LoginScreen({ onBack, onRegister, onSuccess }) {
  const { login } = useShop();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async (e, p) => {
    const loginEmail = e || email;
    const loginPassword = p || password;

    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await login(loginEmail, loginPassword);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <View style={styles.logoSection}>
        <Logo size={64} showText={true} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to access your atelier studio or order history.
        </Text>

        {errorMsg && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="artisan@klasetu.art"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textMuted}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={() => handleLogin()}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.submitBtnText}>Sign In to KlaSetu</Text>
          )}
        </TouchableOpacity>

        {/* Demo Fast Login */}
        <View style={styles.demoSection}>
          <Text style={styles.demoSectionTitle}>Or instant login with demo accounts:</Text>
          <View style={styles.demoRow}>
            <TouchableOpacity
              style={styles.demoChip}
              onPress={() => handleLogin('artisan@klasetu.art', 'artisan123')}
            >
              <Ionicons name="color-palette" size={14} color={COLORS.primary} />
              <Text style={styles.demoChipText}>Artisan Demo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.demoChip}
              onPress={() => handleLogin('buyer@klasetu.art', 'buyer123')}
            >
              <Ionicons name="person" size={14} color={COLORS.terracotta} />
              <Text style={styles.demoChipText}>Buyer Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Switch to Register */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>New to KlaSetu?</Text>
          <TouchableOpacity onPress={onRegister}>
            <Text style={styles.footerLink}> Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  content: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.linen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    ...SHADOWS.card,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: RADII.md,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.linen,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: RADII.pill,
    alignItems: 'center',
    ...SHADOWS.button,
  },
  submitBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  demoSectionTitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 10,
    textAlign: 'center',
  },
  demoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.linen,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    borderRadius: RADII.pill,
  },
  demoChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
