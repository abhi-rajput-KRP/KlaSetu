import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants/theme";
import { Sparkles } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

interface LoadingScreenProps {
  onFinish?: () => void;
  duration?: number;
}

const LOADING_MESSAGES = [
  "Connecting artisans to the world...",
  "Preserving traditional handmade crafts...",
  "Empowering local makers & communities...",
  "Crafting your curated marketplace...",
];

export default function LoadingScreen({
  onFinish,
  duration = 2800,
}: LoadingScreenProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: duration - 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    // Pulse animation for subtle breathing effect
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // Message rotation interval
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 750);

    // Fade out and finish callback
    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) {
          onFinish();
        }
      });
    }, duration);

    return () => {
      pulseLoop.stop();
      clearInterval(msgInterval);
      clearTimeout(timer);
    };
  }, []);

  const handleSkip = () => {
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (onFinish) {
        onFinish();
      }
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: screenOpacity,
        },
      ]}
    >
      {/* Background ambient decorative shapes */}
      <View style={styles.ambientCircleTop} />
      <View style={styles.ambientCircleBottom} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Main Logo / Hero Image Container */}
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Image
            source={require("../assets/images/Gemini_Generated_Image_82t62z82t62z82t6.png")}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Brand Title & Taglines */}
        <View style={styles.titleContainer}>
          <View style={styles.badgeRow}>
            <Sparkles size={14} color={COLORS.terracotta} />
            <Text style={styles.badgeText}>TRADITION & HERITAGE</Text>
            <Sparkles size={14} color={COLORS.terracotta} />
          </View>

          <Text style={styles.appName}>KlaSetu</Text>
          <Text style={styles.tagline}>कला और शिल्प का डिजिटल सेतु</Text>
          <Text style={styles.subTagline}>
            Bridging Artisans Directly to Global Markets
          </Text>
        </View>

        {/* Progress Bar & Dynamic Status Message */}
        <View style={styles.loadingSection}>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[styles.progressBarFill, { width: progressWidth }]}
            />
          </View>
          <Text style={styles.statusMessage}>
            {LOADING_MESSAGES[messageIndex]}
          </Text>
        </View>
      </Animated.View>

      {/* Skip Button */}
      <Pressable
        style={[styles.skipButton, { top: Math.max(insets.top + 10, 36) }]}
        onPress={handleSkip}
      >
        <Text style={styles.skipText}>Skip →</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ♥ for Indian Artisans</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    zIndex: 99999,
    elevation: 99999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  ambientCircleTop: {
    position: "absolute",
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: "#F3E6D3",
    opacity: 0.6,
  },
  ambientCircleBottom: {
    position: "absolute",
    bottom: -height * 0.08,
    left: -width * 0.2,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: (width * 0.75) / 2,
    backgroundColor: "#EAF0EA",
    opacity: 0.7,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 380,
  },
  imageWrapper: {
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
    borderWidth: 4,
    borderColor: "#E8DCB8",
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
    marginBottom: 28,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#F7EFE4",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EADDCB",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: COLORS.terracotta,
  },
  appName: {
    fontSize: 38,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.terracotta,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  subTagline: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
  loadingSection: {
    width: "80%",
    alignItems: "center",
  },
  progressBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#EADDCB",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  statusMessage: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
    minHeight: 18,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skipText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  footer: {
    position: "absolute",
    bottom: 25,
    alignItems: "center",
  },
  footerText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 0.2,
  },
});
