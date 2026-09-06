import { Product } from '../types/product';

export const DEMO_MODE = true;

export async function uploadProductImage(uri: string) {
  // TODO: Replace with your backend image-upload API.
  return { url: uri, success: true };
}

export async function uploadAudio(uri: string) {
  // TODO: Replace with your backend audio-upload API.
  return { url: uri, success: true };
}

export async function saveProduct(product: Product) {
  // TODO: Replace with your backend database API.
  return { success: true, product };
}

export async function getProducts(): Promise<Product[]> {
  // TODO: Replace with GET ${API_BASE_URL}/products.
  return [];
}

export async function generateBrochure(input: {
  imageUri: string;
  audioUri?: string;
  productName: string;
}) {
  // TODO: Send image + audio to your AI/backend service.
  await new Promise((resolve) => setTimeout(resolve, 1800));
  return {
    title: input.productName || 'Handcrafted Artisan Product',
    story: 'A thoughtfully handcrafted product made with traditional skill and care. The artisan story, materials and cultural details will be generated here by your AI backend.',
    materials: 'Traditional natural materials',
    process: 'Handcrafted using time-honoured artisan techniques.',
    significance: 'A unique piece carrying the identity and story of its maker.',
  };
}
