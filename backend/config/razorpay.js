const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let razorpayKeyId = process.env.RAZORPAY_KEY_ID || '';
let razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || '';

// If not in .env, read dynamically from C:/xampp/htdocs/API KEY/
if (!razorpayKeyId || !razorpayKeySecret) {
  try {
    const csvPath = path.resolve(__dirname, '../../../API KEY/rzp-key.csv');
    if (fs.existsSync(csvPath)) {
      const content = fs.readFileSync(csvPath, 'utf8');
      const lines = content.trim().split('\n');
      if (lines.length >= 2) {
        const parts = lines[1].trim().split(',');
        if (parts.length >= 2) {
          razorpayKeyId = parts[0].trim();
          razorpayKeySecret = parts[1].trim();
        }
      }
    }
  } catch (err) {
    console.error('Error reading Razorpay CSV:', err.message);
  }

  // Fallback to key_id.txt
  if (!razorpayKeyId || !razorpayKeySecret) {
    try {
      const txtPath = path.resolve(__dirname, '../../../API KEY/key_id.txt');
      if (fs.existsSync(txtPath)) {
        const lines = fs.readFileSync(txtPath, 'utf8').split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim().toLowerCase();
          if (line.includes('key_id') && lines[i + 1]) {
            razorpayKeyId = lines[i + 1].trim();
          }
          if (line.includes('key_secret') && lines[i + 1]) {
            razorpayKeySecret = lines[i + 1].trim();
          }
        }
      }
    } catch (err) {
      console.error('Error reading Razorpay TXT:', err.message);
    }
  }
}

// Strict check: Must be a Test Key starting with rzp_test_
if (!razorpayKeyId.startsWith('rzp_test_')) {
  console.error('CRITICAL: Razorpay integration must use TEST MODE credentials (starting with rzp_test_).');
}

/**
 * Creates an order on Razorpay servers via REST API
 * @param {number} amountInPaise 
 * @param {string} receipt 
 */
async function createRazorpayOrder(amountInPaise, receipt) {
  const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    },
    body: JSON.stringify({
      amount: Math.round(amountInPaise),
      currency: 'INR',
      receipt: String(receipt),
      payment_capture: 1
    })
  });

  const data = await response.json();
  if (response.ok && data.id) {
    return { success: true, orderId: data.id, data };
  } else {
    return { 
      success: false, 
      error: data?.error?.description || `Razorpay order creation failed (HTTP ${response.status})`,
      data 
    };
  }
}

/**
 * Verifies Razorpay payment signature server-side using HMAC SHA256
 * @param {string} orderId 
 * @param {string} paymentId 
 * @param {string} signature 
 */
function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (!orderId || !paymentId || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(signature, 'utf8')
  );
}

module.exports = {
  keyId: razorpayKeyId,
  createRazorpayOrder,
  verifyRazorpaySignature
};
