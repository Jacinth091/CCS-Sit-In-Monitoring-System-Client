/**
 * Generate an HMAC-SHA256 signature for an AI request payload.
 *
 * The backend verifies: HMAC(timestamp + '.' + userId + '.' + JSON(payload))
 *
 * @param {Object} payload   The request body object
 * @param {number} userId    The authenticated user's ID (from JWT or auth context)
 * @param {string} secret    The HMAC secret — fetched from a backend endpoint
 * @returns {Promise<{ signature: string, timestamp: number }>}
 */
import CryptoJS from 'crypto-js';

export async function signAiRequest(payload, userId, secret) {
  const timestamp    = Math.floor(Date.now() / 1000);
  const signingString = `${timestamp}.${userId}.${JSON.stringify(payload)}`;

  const encoder   = new TextEncoder();
  const keyData   = encoder.encode(secret);
  const msgData   = encoder.encode(signingString);

  const subtle = globalThis?.crypto?.subtle;
  if (!subtle) {
    const sigHex = CryptoJS.HmacSHA256(signingString, secret).toString(CryptoJS.enc.Hex);
    return { signature: sigHex, timestamp };
  }

  const cryptoKey = await subtle.importKey(
    'raw', keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBuffer = await subtle.sign('HMAC', cryptoKey, msgData);
  const sigHex    = Array.from(new Uint8Array(sigBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return { signature: sigHex, timestamp };
}
