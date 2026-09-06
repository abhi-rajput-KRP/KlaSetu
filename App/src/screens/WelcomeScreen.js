import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII, SHADOWS } from '../constants/theme';
import Logo from '../assets/Logo';

export default function WelcomeScreen({ onExplore, onLogin, onRegister }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.linen} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Logo */}
        <View style={styles.logoSection}>
          <Logo size={76} showText={true} />
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.tagBadge}>
            <Ionicons name="sparkles" size={12} color={COLORS.terracotta} />
            <Text style={styles.tagBadgeText}>GI TAG CERTIFIED & FAIR-TRADE</Text>
          </View>

          <Text style={styles.headline}>
            The Bridge Between Master Crafts & Conscious Living
          </Text>

          <Text style={styles.subtext}>
            Connect directly with generational Indian artisans. Every craft tells an ancestral story, shaped with natural sustainable materials and fair-trade equity.
          </Text>

          {/* Pillars Row */}
          <View style={styles.pillarsRow}>
            <View style={styles.pillar}>
              <View style={styles.pillarIcon}>
                <Ionicons name="shield-checkmark" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.pillarTitle}>100% Authentic</Text>
              <Text style={styles.pillarDesc}>Artisan Verified</Text>
            </View>

            <View style={styles.pillar}>
              <View style={styles.pillarIcon}>
                <Ionicons name="heart" size={18} color={COLORS.terracotta} />
              </View>
              <Text style={styles.pillarTitle}>Direct Equity</Text>
              <Text style={styles.pillarDesc}>85% to Maker</Text>
            </View>

            <View style={styles.pillar}>
              <View style={styles.pillarIcon}>
                <Ionicons name="leaf" size={18} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.pillarTitle}>Eco-Conscious</Text>
              <Text style={styles.pillarDesc}>Natural Earth Clays</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={onExplore}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryBtnText}>Explore Master Crafts</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.surface} />
          </TouchableOpacity>

          <View style={styles.authRow}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={onLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in-outline" size={16} color={COLORS.textPrimary} />
              <Text style={styles.secondaryBtnText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryBtn, styles.registerBtn]}
              onPress={onRegister}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add-outline" size={16} color={COLORS.primary} />
              <Text style={[styles.secondaryBtnText, { color: COLORS.primary }]}>
                Join as Artisan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollContent: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  logoSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  heroCard: {
    backgroundColor: COLORS.linen,
    borderRadius: RADII.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 253, 249, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADII.pill,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 34,
    letterSpacing: -0.6,
    marginBottom: 12,
  },
  subtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  pillarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(43, 36, 32, 0.08)',
  },
  pillar: {
    alignItems: 'center',
    flex: 1,
  },
  pillarIcon: {
    width: 36,
    height: 36,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    ...SHADOWS.card,
  },
  pillarTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  pillarDesc: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  actions: {
    marginVertical: 20,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: RADII.pill,
    ...SHADOWS.button,
  },
  primaryBtnText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  authRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    borderRadius: RADII.pill,
  },
  registerBtn: {
    borderColor: COLORS.primaryLight,
    backgroundColor: COLORS.primaryLight,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
