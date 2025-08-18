// Simple API endpoint for generating location images
// This would normally be an edge function, but for now we'll use a simple implementation

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  // For now, return a placeholder response
  // In production, this would call an actual image generation service
  res.status(200).json({
    image_url: `https://picsum.photos/800/600?random=${Date.now()}`,
    prompt: prompt
  });
}