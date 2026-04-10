const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const [result] = await client.textDetection({
      image: { content: imageBuffer },
      imageContext: {
        languageHints: ['zh-Hant', 'zh-CN', 'en', 'ja'],
      },
    });

    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) {
      return res.status(200).json({ text: '' });
    }

    // First result contains the full detected text
    const text = detections[0].description;
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Vision API error:', error);
    return res.status(500).json({ error: error.message });
  }
};
