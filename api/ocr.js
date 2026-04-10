const Tesseract = require('tesseract.js');
const { createWorker } = Tesseract;

let worker = null;

async function getWorker() {
  if (!worker) {
    worker = await createWorker(['chi_tra', 'eng'], 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log('OCR progress:', Math.round(m.progress * 100) + '%');
        }
      },
    });
  }
  return worker;
}

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
    const base64Data = imageBuffer.toString('base64');
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    console.log('Starting OCR with Tesseract.js...');
    const tesseractWorker = await getWorker();
    const { data: { text } } = await tesseractWorker.recognize(dataUrl);

    console.log('OCR result:', text.substring(0, 100));
    return res.status(200).json({ text });
  } catch (error) {
    console.error('OCR error:', error);
    return res.status(500).json({ error: error.message });
  }
};
