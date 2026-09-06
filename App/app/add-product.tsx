import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Download,
  Feather,
  ImagePlus,
  MapPin,
  Mic,
  Pause,
  Play,
  Share2,
  Sparkles,
  Square,
  Trash2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
  useAudioPlayer,
} from 'expo-audio';
import AppHeader from '../components/AppHeader';
import BottomNav from '../components/BottomNav';
import { COLORS } from '../constants/theme';
import { CRAFT_CATEGORIES } from '../data/productsData';

export default function AddProductScreen() {
  const [image, setImage] = useState<string>(
    'https://images.unsplash.com/photo-1600369672770-985baa0e2c07?auto=format&fit=crop&w=800&q=80'
  );
  const [name, setName] = useState('Hand-Loomed Mountain Wool & Pashmina Shawl');
  const [category, setCategory] = useState('Handloom Textiles');
  const [price, setPrice] = useState('68');
  const [makerName, setMakerName] = useState('Devi Weavers Guild');
  const [location, setLocation] = useState('Kullu Valley, HP');
  const [material, setMaterial] = useState('Pure Himalayan Sheep Wool, Botanical Walnut & Madder Root Dye');
  const [story, setStory] = useState(
    'Hand-woven on four-pedal ancestral pit-looms high in the Kullu Valley. Each geometric border pattern conveys local blessings of longevity and protection across generations.'
  );

  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recState = useAudioRecorderState(recorder);
  const player = useAudioPlayer(recordingUri || '');

  const pickImage = async () => {
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) {
      Alert.alert('Permission required', 'Please allow photo access to select your craft photo.');
      return;
    }
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });
    if (!r.canceled && r.assets[0]?.uri) {
      setImage(r.assets[0].uri);
    }
  };

  const captureCamera = async () => {
    const p = await ImagePicker.requestCameraPermissionsAsync();
    if (!p.granted) {
      Alert.alert('Permission required', 'Please allow camera access to photograph your craft.');
      return;
    }
    const r = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    });
    if (!r.canceled && r.assets[0]?.uri) {
      setImage(r.assets[0].uri);
    }
  };

  const startRecording = async () => {
    try {
      const p = await AudioModule.requestRecordingPermissionsAsync();
      if (!p.granted) {
        Alert.alert('Permission required', 'Please allow microphone access.');
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (e) {
      console.log('Error recording audio', e);
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      setRecordingUri(recorder.uri ?? null);
    } catch (e) {
      console.log('Error stopping audio', e);
    }
  };

  const handleGenerateBrochure = () => {
    setGenerating(true);
    setTimeout(() => {
      setStory(
        `Thoughtfully handcrafted by ${makerName} in ${location}. Created using traditional techniques passed through generations, utilizing ${material.toLowerCase()} to celebrate sustainable cultural heritage.`
      );
      setGenerating(false);
      Alert.alert('AI Story Synthesized!', 'Your marketing brochure preview has been generated below.');
    }, 1200);
  };

  const handleOpenFullBrochure = () => {
    router.push({
      pathname: '/brochure',
      params: {
        image,
        name,
        category,
        price,
        location,
      },
    });
  };

  return (
    <View style={styles.screen}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Title */}
        <View style={styles.headerBlock}>
          <View style={styles.badgeRow}>
            <Sparkles size={13} color={COLORS.terracotta} />
            <Text style={styles.badgeText}>ARTISAN SELLER STUDIO</Text>
          </View>
          <Text style={styles.pageTitle}>Post Your Craft & Generate AI Brochure</Text>
          <Text style={styles.pageSub}>
            Speak in your regional language or describe materials. Our AI crafts an authentic English marketing narrative and export brochure instantly.
          </Text>
        </View>

        {/* Section 1: Audio Voice Studio */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Voice & Audio Description</Text>
          <Text style={styles.cardSub}>
            Speak naturally about your technique, lineage, materials, or history.
          </Text>

          <View style={styles.audioRow}>
            <View style={styles.micCircle}>
              <Mic size={22} color={COLORS.primary} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.audioStatusTitle}>
                {recState.isRecording ? 'Listening & Recording...' : 'Tap to record craft story'}
              </Text>
              <Text style={styles.audioStatusSub}>
                {recState.isRecording
                  ? 'Tap red square to stop recording'
                  : 'Hindi, Bengali, Tamil, Gujarati, or English'}
              </Text>
            </View>

            {recState.isRecording ? (
              <Pressable style={styles.stopBtn} onPress={stopRecording}>
                <Square size={16} color="#FFFDF9" fill="#FFFDF9" />
              </Pressable>
            ) : (
              <Pressable style={styles.recordBtn} onPress={startRecording}>
                <Mic size={18} color="#FFFDF9" />
              </Pressable>
            )}
          </View>

          {recordingUri && (
            <View style={styles.recordedBanner}>
              <Text style={styles.recordedBannerText}>Audio clip ready for AI synthesis</Text>
              <Pressable onPress={() => player.play()} hitSlop={6}>
                <Play size={18} color={COLORS.primary} />
              </Pressable>
              <Pressable onPress={() => setRecordingUri(null)} hitSlop={6}>
                <Trash2 size={18} color={COLORS.terracotta} />
              </Pressable>
            </View>
          )}
        </View>

        {/* Section 2: Product Photography */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Product Photography</Text>
          <Text style={styles.cardSub}>
            Capture high-resolution photos in natural daylight.
          </Text>

          <View style={styles.imagePreviewBox}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <View style={styles.imageActionsOverlay}>
              <Pressable style={styles.imageActionBtn} onPress={pickImage}>
                <ImagePlus size={15} color={COLORS.primary} />
                <Text style={styles.imageActionText}>Gallery</Text>
              </Pressable>
              <Pressable style={styles.imageActionBtn} onPress={captureCamera}>
                <Camera size={15} color={COLORS.primary} />
                <Text style={styles.imageActionText}>Camera</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Section 3: Craft Details Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. Craft Specifications</Text>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Hand-Thrown Ash Glaze Vase"
              placeholderTextColor={COLORS.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Direct Price ($ USD)</Text>
              <TextInput
                style={styles.input}
                placeholder="48"
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Location / Cluster</Text>
              <TextInput
                style={styles.input}
                placeholder="Khurja, UP"
                placeholderTextColor={COLORS.textSecondary}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Artisan / Studio Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rajesh Kumar & Kiln Collective"
              placeholderTextColor={COLORS.textSecondary}
              value={makerName}
              onChangeText={setMakerName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.inputLabel}>Materials & Technique</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 100% Khadi Cotton, Natural Botanical Indigo"
              placeholderTextColor={COLORS.textSecondary}
              value={material}
              onChangeText={setMaterial}
            />
          </View>

          {/* AI Story Generation CTA */}
          <Pressable
            style={[styles.generateBtn, generating && { opacity: 0.6 }]}
            onPress={handleGenerateBrochure}
            disabled={generating}
          >
            <Sparkles size={18} color={COLORS.gold} />
            <Text style={styles.generateBtnText}>
              {generating ? 'Synthesizing AI Craft Story...' : 'Generate AI Brochure & Listing'}
            </Text>
          </Pressable>
        </View>

        {/* Section 4: Live AI Marketing Brochure Preview Card */}
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewKicker}>LIVE AI BROCHURE PREVIEW</Text>
            <Text style={styles.previewStatus}>Instagram & Print Ready</Text>
          </View>

          <View style={styles.brochureCard}>
            {/* Header */}
            <View style={styles.brochureHeader}>
              <View style={styles.brochureHeaderLeft}>
                <Feather size={16} color="#FFFDF9" />
                <Text style={styles.brochureBrand}>KlaSetu Masterpiece</Text>
              </View>
              <View style={styles.fairTradePill}>
                <Text style={styles.fairTradePillText}>Fair Trade Direct</Text>
              </View>
            </View>

            {/* Photo */}
            <View style={styles.brochureImageWrap}>
              <Image source={{ uri: image }} style={styles.brochureImage} />
              <View style={styles.brochurePriceTag}>
                <Text style={styles.brochurePriceText}>${price} USD</Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.brochureBody}>
              <View style={styles.brochureMakerRow}>
                <Text style={styles.brochureMakerText}>{makerName}</Text>
                <View style={styles.brochureLocRow}>
                  <MapPin size={11} color={COLORS.textSecondary} />
                  <Text style={styles.brochureLocText}>{location}</Text>
                </View>
              </View>

              <Text style={styles.brochureTitle}>{name}</Text>
              <Text style={styles.brochureStory} numberOfLines={3}>
                {story}
              </Text>

              <View style={styles.brochureMaterialBox}>
                <Text style={styles.brochureMaterialLabel}>Materials & Provenance:</Text>
                <Text style={styles.brochureMaterialVal}>{material}</Text>
              </View>

              <View style={styles.brochureFooter}>
                <View style={styles.artisanShareRow}>
                  <CheckCircle2 size={13} color={COLORS.primary} />
                  <Text style={styles.artisanShareText}>85% Direct to Artisan</Text>
                </View>
                <Text style={styles.brochureCode}>#KL-84920</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons for Brochure */}
          <View style={styles.brochureActions}>
            <Pressable
              style={styles.brochureActionBtn}
              onPress={handleOpenFullBrochure}
            >
              <Download size={16} color={COLORS.primary} />
              <Text style={styles.brochureActionText}>Full Brochure</Text>
            </Pressable>

            <Pressable
              style={styles.brochureActionBtn}
              onPress={() => Alert.alert('Share Link', 'Brochure link copied for WhatsApp & Instagram sharing!')}
            >
              <Share2 size={16} color={COLORS.primary} />
              <Text style={styles.brochureActionText}>Share Story</Text>
            </Pressable>
          </View>
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
    padding: 16,
    paddingBottom: 34,
    gap: 16,
  },
  headerBlock: {
    gap: 6,
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
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    lineHeight: 30,
  },
  pageSub: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: -4,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  micCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.lightGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioStatusTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  audioStatusSub: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  recordBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGreen,
    padding: 10,
    borderRadius: 12,
    gap: 12,
  },
  recordedBannerText: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  imagePreviewBox: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.accentBg,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageActionsOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  imageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 253, 249, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    elevation: 2,
  },
  imageActionText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.primary,
  },
  formGroup: {
    gap: 4,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: COLORS.textPrimary,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 999,
    marginTop: 4,
  },
  generateBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  previewSection: {
    gap: 10,
    marginTop: 6,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  previewKicker: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  previewStatus: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  brochureCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    elevation: 4,
  },
  brochureHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  fairTradePill: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  fairTradePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  brochureImageWrap: {
    height: 190,
    position: 'relative',
    backgroundColor: COLORS.accentBg,
  },
  brochureImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  brochurePriceTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(43, 36, 32, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  brochurePriceText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFDF9',
  },
  brochureBody: {
    padding: 16,
    gap: 8,
  },
  brochureMakerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brochureMakerText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.terracotta,
  },
  brochureLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  brochureLocText: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
  },
  brochureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  brochureStory: {
    fontSize: 11.5,
    lineHeight: 17,
    color: COLORS.textSecondary,
  },
  brochureMaterialBox: {
    backgroundColor: COLORS.accentBg,
    padding: 10,
    borderRadius: 10,
    marginTop: 2,
  },
  brochureMaterialLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  brochureMaterialVal: {
    fontSize: 10.5,
    color: COLORS.textPrimary,
  },
  brochureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    marginTop: 4,
  },
  artisanShareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  artisanShareText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  brochureCode: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: COLORS.textSecondary,
  },
  brochureActions: {
    flexDirection: 'row',
    gap: 10,
  },
  brochureActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 11,
    borderRadius: 999,
  },
  brochureActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
