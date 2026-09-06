# Artisan Market — Expo Android MVP

Converted from the supplied React web design into React Native + Expo.

## Features
- Marketplace-style home screen matching the supplied green/cream/terracotta design.
- Product cards, wishlist interaction and filters.
- Add Product flow.
- Gallery image selection.
- Camera capture.
- Audio recording and playback.
- Mock AI brochure generation.
- Brochure preview.
- Backend service placeholders in `services/api.ts`.

## Run

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Run:

```bash
npm install
npx expo start
```

4. Scan the QR code with Expo Go on Android, or use `npm run android` with an Android emulator/device configured.

If Expo reports package-version mismatches, run:

```bash
npx expo install --fix
```

## Backend integration

Replace the TODO functions in `services/api.ts` with your API calls. The intended flow is:

Image + Audio -> Backend -> Speech-to-Text -> AI -> Brochure -> App

No real backend is included in this MVP.
