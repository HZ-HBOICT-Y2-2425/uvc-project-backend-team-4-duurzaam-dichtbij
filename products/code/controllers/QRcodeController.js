import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { JSONFilePreset } from "lowdb/node";

const defaultData = { meta: {"tile": "List of products","date": "November 2024"}, products : [] };


const db = await JSONFilePreset('db.json',defaultData);
const products = db.data.products;
const qrCodes = {};

// Genereer een QR-code voor een product
export const generateQRCode = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const productId = req.params.productId;
  console.log('Available Products:', products); 
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product niet gevonden' });
  }

  const code = uuidv4(); 
  qrCodes[code] = { productId, used: false };
  // Genereer de QR-code afbeelding (data URL)
  QRCode.toDataURL(code, (err, url) => {
    if (err) {
      return res.status(500).json({ message: 'Fout bij het genereren van de QR-code' });
    }
    res.json({ qrCodeUrl: url, code });
  });
};

// Verwerk een gescande QR-code
export const scanQRCode = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const { code } = req.body;

  if (qrCodes[code] && !qrCodes[code].used) {
    const productId = qrCodes[code].productId;
    // Gebruik de bestaande route voor het ophalen van productdetails
    const product = products.find(p => p.id === productId);

    if (product) {
      // Markeer de QR-code als gebruikt
      qrCodes[code].used = true;

      // Geef de productinformatie terug
      res.json({
        success: true,
        message: `QR-code gebruikt voor product: ${product.name}`,
        carbonDioxide: product.carbonDioxide,
      });
    } else {
      res.status(404).json({ success: false, message: 'Product niet gevonden via de QR-code' });
    }
  } else {
    res.status(400).json({ success: false, message: 'QR-code is al gebruikt of ongeldig' });
  }
};
