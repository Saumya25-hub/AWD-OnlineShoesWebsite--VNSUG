const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'awd_shoes_bca_secret_key_2026';

// Generate random 5-character alphanumeric string (avoiding ambiguous chars)
function generateRandomCode(length = 5) {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate simple, lightweight SVG representation of the CAPTCHA text with noise
function generateCaptchaSvg(text) {
  const width = 130;
  const height = 40;

  // Colors for characters
  const colors = ['#0f172a', '#1e40af', '#b91c1c', '#047857', '#7c2d12', '#4c1d95'];

  // Random noise lines
  let lines = '';
  for (let i = 0; i < 3; i++) {
    const x1 = Math.floor(Math.random() * 20);
    const y1 = Math.floor(Math.random() * height);
    const x2 = Math.floor(width - Math.random() * 20);
    const y2 = Math.floor(Math.random() * height);
    const stroke = colors[i % colors.length];
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.2" opacity="0.4" />`;
  }

  // Draw characters with slight rotation and offsets
  let textElements = '';
  const charSpacing = width / (text.length + 1);
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const x = Math.floor((i + 0.6) * charSpacing);
    const y = 26 + Math.floor((Math.random() - 0.5) * 6);
    const angle = Math.floor((Math.random() - 0.5) * 30);
    const color = colors[i % colors.length];
    textElements += `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="22" fill="${color}" transform="rotate(${angle} ${x} ${y})">${char}</text>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background-color: #f1f5f9; border-radius: 4px; border: 1px solid #cbd5e1; user-select: none;">
    ${lines}
    ${textElements}
  </svg>`;
}

// Create new CAPTCHA (SVG + signed 5-minute JWT verification token)
function createCaptcha() {
  const code = generateRandomCode(5);
  const svg = generateCaptchaSvg(code);
  const captchaToken = jwt.sign(
    { code: code.toUpperCase() },
    JWT_SECRET,
    { expiresIn: '5m' }
  );

  return {
    svg,
    captchaToken
  };
}

// Verify submitted CAPTCHA token and input
function verifyCaptcha(captchaToken, captchaInput) {
  if (!captchaToken || !captchaInput) {
    return false;
  }
  try {
    const decoded = jwt.verify(captchaToken, JWT_SECRET);
    return decoded.code === String(captchaInput).trim().toUpperCase();
  } catch (err) {
    return false;
  }
}

module.exports = {
  createCaptcha,
  verifyCaptcha
};
