import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Flame,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
} from 'lucide-react-native';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { COLORS } from '../constants/theme';
import { useShop } from '../context/ShopContext';
import { CRAFT_CATEGORIES } from '../data/productsData';

export default function Home() {
  const { products, selectedCategory, setSelectedCategory } = useShop();

  const filteredProducts =
    selectedCategory === 'All Crafts'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <View style={styles.screen}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Warm Linen Hero Banner */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadgeRow}>
            <Sparkles size={13} color={COLORS.terracotta} />
            <Text style={styles.heroBadgeText}>CONNECTING THE INDIA WITH ITS ROOTS</Text>
          </View>

          <Text style={styles.heroTitle}>
            Crafted with soul.{'\n'}
            <Text style={styles.heroTitleHighlight}>Rooted in heritage.</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Discover one-of-a-kind stoneware pottery, handloomed textiles, hand-carved wood, and heirloom brass art — delivered straight from local artisan workshops to your doorstep.
          </Text>

          {/* Action CTAs */}
          <View style={styles.heroActions}>
            <Pressable
              style={styles.heroPrimaryBtn}
              onPress={() => router.push('/products')}
            >
              <Text style={styles.heroPrimaryBtnText}>Explore All Crafts</Text>
              <ArrowRight size={15} color="#FFFDF9" />
            </Pressable>

            <Pressable
              style={styles.heroSecondaryBtn}
              onPress={() => router.push('/add-product')}
            >
              <Text style={styles.heroSecondaryBtnText}>Join as an Artisan</Text>
            </Pressable>
          </View>
        </View>

        {/* Picked For You Product Grid */}
        <View style={styles.productSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Picked For You</Text>
              <Text style={styles.sectionSub}>
                Authentic handcrafted pieces ready to ship directly from heritage maker clusters.
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            {filteredProducts.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>

          <View style={styles.seeAllWrapper}>
            <Pressable
              style={styles.seeAllBtn}
              onPress={() => router.push('/products')}
            >
              <Text style={styles.seeAllBtnText}>See all Products</Text>
              <ArrowRight size={15} color={COLORS.primary} />
            </Pressable>
          </View>
        </View>

        {/* Fair Trade Impact Ecosystem Banner */}
        <View style={styles.impactCard}>
          <View style={styles.impactBadge}>
            <Award size={14} color={COLORS.gold} />
            <Text style={styles.impactBadgeText}>Verified Fair-Trade Ecosystem</Text>
          </View>

          <Text style={styles.impactTitle}>
            Empowering 1,200+ Traditional Craft Families
          </Text>

          <Text style={styles.impactBody}>
            By eliminating export middlemen, KlaSetu guarantees that at least 85% of retail value flows directly back to rural artisan clusters.
          </Text>

          <View style={styles.impactPoints}>
            <View style={styles.impactPoint}>
              <CheckCircle2 size={14} color={COLORS.gold} />
              <Text style={styles.impactPointText}>Direct Bank Transfers</Text>
            </View>
            <View style={styles.impactPoint}>
              <CheckCircle2 size={14} color={COLORS.gold} />
              <Text style={styles.impactPointText}>Ethical Raw Sourcing</Text>
            </View>
            <View style={styles.impactPoint}>
              <CheckCircle2 size={14} color={COLORS.gold} />
              <Text style={styles.impactPointText}>AI Marketing for Rural Makers</Text>
            </View>
          </View>

          <Pressable
            style={styles.impactBtn}
            onPress={() => router.push('/add-product')}
          >
            <Text style={styles.impactBtnText}>Are you an artisan? Join now</Text>
            <ArrowRight size={15} color={COLORS.primary} />
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
  scrollContent: {
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: COLORS.accentBg,
    margin: 16,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8DCCB',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 253, 249, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5D6C0',
    marginBottom: 14,
  },
  heroBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
    color: COLORS.textPrimary,
  },
  heroTitleHighlight: {
    color: COLORS.primary,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  heroSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  heroPrimaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  heroSecondaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS.textPrimary,
  },
  heroSecondaryBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E2D1BA',
    marginTop: 18,
    paddingTop: 14,
    gap: 8,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
  },
  trustIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  trustSub: {
    fontSize: 9.5,
    color: COLORS.textSecondary,
  },
  categorySection: {
    marginTop: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  viewAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  viewAllText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  categoryPills: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 6,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  categoryPillTextActive: {
    color: '#FFFDF9',
  },
  productSection: {
    paddingHorizontal: 16,
    marginTop: 18,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionKickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  sectionKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48.5%',
  },
  artisanSection: {
    backgroundColor: '#F5ECE0',
    paddingVertical: 22,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  artisanHeader: {
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  artisanKicker: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.terracotta,
    letterSpacing: 1,
  },
  artisanTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  artisanSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  artisanCards: {
    paddingHorizontal: 16,
    gap: 12,
  },
  impactCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 24,
    padding: 22,
    elevation: 4,
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 253, 249, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  impactBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  impactTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFDF9',
    lineHeight: 28,
  },
  impactBody: {
    fontSize: 12.5,
    color: '#EAF0EA',
    lineHeight: 18,
    marginTop: 8,
  },
  impactPoints: {
    gap: 6,
    marginTop: 14,
  },
  impactPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactPointText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFDF9',
  },
  impactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFDF9',
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 18,
  },
  impactBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  heroImageCard: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 14,
    borderWidth: 2,
    borderColor: '#FFFDF9',
    backgroundColor: COLORS.sand,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  seeAllWrapper: {
    alignItems: 'flex-end',
    marginTop: 12,
    paddingRight: 4,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
