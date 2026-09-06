import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G, Rect } from 'react-native-svg';
import { COLORS } from '../constants/theme';

export default function Logo({ size = 48, showText = true, variant = 'dark' }) {
  const isDark = variant === 'dark';

  return (
    <View style={styles.container}>
      {/* Brand Icon Shield */}
      <View
        style={[
          styles.iconWrapper,
          {
            width: size,
            height: size,
            borderRadius: size * 0.35,
          },
        ]}
      >
        <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 100 100">
          {/* Stylized Kalash / Bridge / Craft Icon */}
          <G fill={COLORS.primary}>
            {/* Top lotus / flame petals */}
            <Path d="M50 8 C48 18, 42 26, 35 32 C43 32, 50 24, 50 8 Z" fill={COLORS.terracotta} />
            <Path d="M50 8 C52 18, 58 26, 65 32 C57 32, 50 24, 50 8 Z" fill={COLORS.terracotta} />
            <Path d="M50 5 C47 18, 50 28, 50 32 C50 28, 53 18, 50 5 Z" fill={COLORS.star} />
            {/* Traditional Kalash Vessel Body */}
            <Path d="M30 35 C22 45, 20 60, 26 72 C32 82, 42 88, 50 88 C58 88, 68 82, 74 72 C80 60, 78 45, 70 35 C64 40, 58 42, 50 42 C42 42, 36 40, 30 35 Z" />
            {/* Base Stand */}
            <Rect x="36" y="88" width="28" height="6" rx="3" fill={COLORS.primaryDark} />
            {/* Craft Handloom / Wave motif */}
            <Path
              d="M32 58 Q50 68 68 58"
              stroke="#FFFDF9"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M36 68 Q50 76 64 68"
              stroke={COLORS.terracotta}
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>
      </View>

      {/* Brand Text */}
      {showText && (
        <View style={styles.textWrapper}>
          <Text style={[styles.brandName, { color: isDark ? COLORS.textPrimary : '#FFFDF9' }]}>
            KlaSetu<Text style={{ color: COLORS.primary }}>.</Text>
          </Text>
          <Text style={[styles.tagline, { color: isDark ? COLORS.textSecondary : COLORS.linen }]}>
            ARTISAN MARKETPLACE
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    backgroundColor: COLORS.linen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textWrapper: {
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: -2,
  },
});
