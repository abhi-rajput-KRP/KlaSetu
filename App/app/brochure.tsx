import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Download,
  Feather,
  MapPin,
  Share2,
  Sparkles,
} from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { COLORS } from '../constants/theme';

export default function BrochureScreen() {
  const p = useLocalSearchParams<{
    image?: string;
    name?: string;
    category?: string;
    price?: string;
    location?: string;
  }>();

  const name = p.name || 'Handcrafted Heritage Masterpiece';
  const imageUrl =
    p.image ||
    'https://images.unsplash.com/photo-1600369672770-985baa0e2c07?auto=format&fit=crop&w=800&q=80';

  const handleSaveBrochure = () => {
    Alert.alert('Saved to Photos', 'High-definition AI marketing brochure card saved to your device.');
  };

  const handleShareBrochure = () => {
    Alert.alert(
      'Share Card',
      'Artisan craft narrative formatted for WhatsApp, Instagram, and global craft collectors.'
    );
  };

  return (
    <View style={styles.screen}>
      <AppHeader />

      {/* Header bar */}
      <View style={styles.headerBar}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={20} color={COLORS.textPrimary} />
          <Text style={styles.backBtnText}>Back to Studio</Text>
        </Pressable>
        <View style={styles.aiBadge}>
          <Sparkles size={14} color={COLORS.gold} />
          <Text style={styles.aiBadgeText}>AI Heritage Card</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Printable/Shareable Brochure Card */}
        <View style={styles.brochure}>
          {/* Header Banner */}
          <View style={styles.brochureHeader}>
            <View style={styles.brochureHeaderLeft}>
              <Feather size={18} color="#FFFDF9" />
              <Text style={styles.brochureBrand}>KlaSetu Masterpiece</Text>
            </View>
            <View style={styles.fairTradeBadge}>
              <Award size={13} color={COLORS.gold} />
              <Text style={styles.fairTradeText}>Fair Trade Certified</Text>
            </View>
          </View>

          {/* Photo */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>
                ${p.price || '48'} USD
              </Text>
            </View>
          </View>

          {/* Body Content */}
          <View style={styles.inner}>
            <Text style={styles.kicker}>AUTHENTIC CRAFT • ZERO MIDDLEMEN</Text>
            <Text style={styles.title}>{name}</Text>
            <View style={styles.makerRow}>
              <Text style={styles.maker}>Created by Verified Local Artisan</Text>
              <View style={styles.locTag}>
                <MapPin size={11} color={COLORS.textSecondary} />
                <Text style={styles.locText}>{p.location || 'India'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.section}>The Artisan Heritage Story</Text>
            <Text style={styles.body}>
              Thoughtfully handcrafted using traditional techniques passed down through generations. Each stroke, weave, and contour preserves irreplaceable cultural heritage, bridging ancient knowledge to modern homes.
            </Text>

            <Text style={styles.section}>Materials & Provenance</Text>
            <Text style={styles.body}>
              100% natural, locally foraged materials selected with reverence for the earth and free from synthetic toxins.
            </Text>

            <Text style={styles.section}>Direct Economic Impact</Text>
            <Text style={styles.body}>
              85%+ of this purchase price transfers directly into the artisan cluster's bank account, supporting rural artisan families and traditional craft revival.
            </Text>

            {/* Meta Row */}
            <View style={styles.meta}>
              <Text style={styles.metaText}>{p.category || 'Traditional Craft'}</Text>
              <Text style={styles.metaText}>{p.location || 'India'}</Text>
              <Text style={styles.codeText}>#KS-{Math.floor(Math.random() * 89999 + 10000)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} onPress={handleSaveBrochure}>
            <Download size={18} color={COLORS.primary} />
            <Text style={styles.actionBtnText}>Save Card</Text>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={handleShareBrochure}>
            <Share2 size={18} color={COLORS.primary} />
            <Text style={styles.actionBtnText}>Share</Text>
          </Pressable>

          <Pressable
            style={styles.primaryBtn}
            onPress={() => router.replace('/add-product')}
          >
            <Text style={styles.primaryBtnText}>Create Another</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    height: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
  },
  aiBadgeText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  brochure: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  brochureHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brochureHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brochureBrand: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  fairTradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  fairTradeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  imageContainer: {
    position: 'relative',
    height: 280,
    backgroundColor: COLORS.accentBg,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pricePill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(43, 36, 32, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pricePillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  inner: {
    padding: 20,
    gap: 8,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.terracotta,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  makerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  maker: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  locTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  section: {
    fontSize: 13.5,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  body: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textSecondary,
  },
  meta: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: COLORS.accentBg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  codeText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: COLORS.terracotta,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  actionBtnText: {
    fontWeight: '800',
    color: COLORS.primary,
    fontSize: 12.5,
  },
  primaryBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFDF9',
    fontWeight: '800',
    fontSize: 12.5,
  },
});
