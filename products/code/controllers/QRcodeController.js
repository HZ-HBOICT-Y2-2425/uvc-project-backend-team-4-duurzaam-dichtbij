import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { JSONFilePreset } from "lowdb/node";

const defaultData = { meta: {"tile": "List of products","date": "November 2024"}, products : [] };

const db = await JSONFilePreset('db.json',defaultData);
const products = db.data.products;
let co2 = db.data.co2;
const qrCodes = db.data.qrcodes;

// Geef de totale CO2 bespaard
export const responseCO2 = (req, res) => {
  return res.status(200).json({co2_saved: co2});
}

// Genereer een QR-code voor een product
export const generateQRCode = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  const productId = req.params.id;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ message: 'Product niet gevonden' });
  }

  const code = uuidv4(); 
  qrCodes.push({ id: code, productId: product.id, used: false });
  db.data.qrcodes = qrCodes;
  db.write();

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
  const bodyQr = req.body.code;

  const qr = qrCodes.find(code => code.id === bodyQr);
  if (!qr || qr.used) {
    res.status(400).json({ success: false, message: 'QR-code is al gebruikt of ongeldig' });
    return;
  }

  const productId = qr.productId;
  // Gebruik de bestaande route voor het ophalen van productdetails
  const product = products.find(p => p.id === productId);

  if (product) {
    // Markeer de QR-code als gebruikt
    qr.used = true;
    db.data.qrcodes = qrCodes;    

    // Update de CO2 uitstoot
    co2 += product.carbonDioxideSaved;
    db.data.co2 = co2;

    // Update de database
    await db.write();

    // Geef de productinformatie terug
    res.json({
      success: true,
      message: `QR-code gebruikt voor product: ${product.name}`,
      carbonDioxide: product.carbonDioxideSaved,
    });
  } else {
    res.status(404).json({ success: false, message: 'Product niet gevonden via de QR-code' });
  }
};
