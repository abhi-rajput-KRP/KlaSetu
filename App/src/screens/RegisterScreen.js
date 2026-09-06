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

export default function RegisterScreen({ onBack, onLogin, onSuccess }) {
  const { register } = useShop();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer'); // 'buyer' | 'artisan'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all fields');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Try again.');
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
        <Text style={styles.title}>Join KlaSetu</Text>
        <Text style={styles.subtitle}>
          Create an account to discover ancestral heirlooms or open your master atelier.
        </Text>

        {errorMsg && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Role Selector */}
        <Text style={styles.label}>Select Your Account Type</Text>
        <View style={styles.roleSelectionRow}>
          {/* Buyer Card */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              role === 'buyer' && styles.roleCardActive,
            ]}
            onPress={() => setRole('buyer')}
            activeOpacity={0.88}
          >
            <View style={styles.roleHeader}>
              <Ionicons
                name="heart"
                size={18}
                color={role === 'buyer' ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.roleTitle,
                  role === 'buyer' && styles.roleTitleActive,
                ]}
              >
                Connoisseur
              </Text>
            </View>
            <Text style={styles.roleDesc}>
              Discover & collect authentic GI Tag heirlooms.
            </Text>
          </TouchableOpacity>

          {/* Artisan Card */}
          <TouchableOpacity
            style={[
              styles.roleCard,
              role === 'artisan' && styles.roleCardActive,
            ]}
            onPress={() => setRole('artisan')}
            activeOpacity={0.88}
          >
            <View style={styles.roleHeader}>
              <Ionicons
                name="color-palette"
                size={18}
                color={role === 'artisan' ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.roleTitle,
                  role === 'artisan' && styles.roleTitleActive,
                ]}
              >
                Master Artisan
              </Text>
            </View>
            <Text style={styles.roleDesc}>
              List crafts with AI pipeline & access Atelier Studio.
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Full Name / Atelier Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Rajesh Kumar"
          placeholderTextColor={COLORS.textMuted}
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={styles.label}>Email Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="you@heritage.art"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Create Password (min 6 chars) *</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Submit CTA */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.surface} />
          ) : (
            <Text style={styles.submitBtnText}>
              Create {role === 'artisan' ? 'Artisan Atelier' : 'Buyer Account'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Switch to Login */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={styles.footerLink}> Sign In</Text>
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
    marginBottom: 20,
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
    marginBottom: 18,
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
  roleSelectionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  roleCard: {
    flex: 1,
    backgroundColor: COLORS.linen,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADII.md,
    padding: 12,
  },
  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  roleTitleActive: {
    color: COLORS.primary,
  },
  roleDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    lineHeight: 14,
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
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: RADII.pill,
    alignItems: 'center',
    marginTop: 6,
    ...SHADOWS.button,
  },
  submitBtnText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '700',
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
