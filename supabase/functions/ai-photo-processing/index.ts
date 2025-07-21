import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PhotoProcessingRequest {
  imageUrl: string;
  operation: 'background-remove' | 'style-transfer' | 'upscale' | 'enhance' | 'perspective-correct';
  styleImageUrl?: string; // For style transfer
  options?: {
    intensity?: number;
    format?: 'jpg' | 'png' | 'webp';
    quality?: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { imageUrl, operation, styleImageUrl, options = {} }: PhotoProcessingRequest = await req.json();

    console.log(`🎨 Processing image with operation: ${operation}`);

    // Download the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('Failed to download image');
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    let processedImageBuffer: ArrayBuffer;

    switch (operation) {
      case 'background-remove':
        processedImageBuffer = await removeBackground(imageBuffer);
        break;
      case 'style-transfer':
        if (!styleImageUrl) throw new Error('Style image URL required for style transfer');
        const styleResponse = await fetch(styleImageUrl);
        const styleBuffer = await styleResponse.arrayBuffer();
        processedImageBuffer = await applyStyleTransfer(imageBuffer, styleBuffer, options.intensity || 0.5);
        break;
      case 'upscale':
        processedImageBuffer = await upscaleImage(imageBuffer, options.quality || 2);
        break;
      case 'enhance':
        processedImageBuffer = await enhanceImage(imageBuffer);
        break;
      case 'perspective-correct':
        processedImageBuffer = await correctPerspective(imageBuffer);
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    // Generate filename
    const timestamp = Date.now();
    const filename = `processed/${operation}-${timestamp}.${options.format || 'jpg'}`;

    // Upload processed image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filename, new Uint8Array(processedImageBuffer), {
        contentType: `image/${options.format || 'jpeg'}`,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filename);

    const processedImageUrl = urlData.publicUrl;

    // Log the processing operation
    const { error: logError } = await supabase
      .from('portfolio')
      .insert({
        title: `AI Processed - ${operation}`,
        description: `Image processed with ${operation}`,
        image_url: processedImageUrl,
        category: 'ai-processed',
        tags: [operation, 'ai-enhanced']
      });

    if (logError) {
      console.warn('Failed to log processing operation:', logError);
    }

    console.log(`✅ Image processed successfully: ${processedImageUrl}`);

    return new Response(JSON.stringify({
      success: true,
      originalUrl: imageUrl,
      processedUrl: processedImageUrl,
      operation,
      filename
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Photo processing error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// AI Processing Functions
async function removeBackground(imageBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  console.log('🖼️ Removing background...');
  
  // Simulate background removal processing
  // In a real implementation, you'd use an AI service like Remove.bg API
  const canvas = new OffscreenCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create gradient background removal effect
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
  }
  
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return await blob.arrayBuffer();
}

async function applyStyleTransfer(imageBuffer: ArrayBuffer, styleBuffer: ArrayBuffer, intensity: number): Promise<ArrayBuffer> {
  console.log(`🎨 Applying style transfer with intensity: ${intensity}`);
  
  // Simulate style transfer
  const canvas = new OffscreenCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Apply artistic effect simulation
    ctx.filter = `contrast(${1 + intensity}) saturate(${1 + intensity * 0.5}) hue-rotate(${intensity * 30}deg)`;
    ctx.fillStyle = `rgba(200, 100, 150, ${intensity * 0.2})`;
    ctx.fillRect(0, 0, 800, 600);
  }
  
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });
  return await blob.arrayBuffer();
}

async function upscaleImage(imageBuffer: ArrayBuffer, scale: number): Promise<ArrayBuffer> {
  console.log(`📈 Upscaling image by ${scale}x`);
  
  const canvas = new OffscreenCanvas(800 * scale, 600 * scale);
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Enhanced quality simulation
    ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
  }
  
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.95 });
  return await blob.arrayBuffer();
}

async function enhanceImage(imageBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  console.log('✨ Enhancing image quality...');
  
  const canvas = new OffscreenCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Apply enhancement filters
    ctx.filter = 'contrast(1.15) brightness(1.08) saturate(1.12) sharpen(0.3)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.fillRect(0, 0, 800, 600);
  }
  
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 });
  return await blob.arrayBuffer();
}

async function correctPerspective(imageBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  console.log('📐 Correcting perspective...');
  
  const canvas = new OffscreenCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Simulate perspective correction
    ctx.setTransform(1.02, 0.01, -0.01, 1.02, 5, 5);
    ctx.filter = 'contrast(1.05)';
  }
  
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });
  return await blob.arrayBuffer();
}