import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse("12345678901234561234567890123456"); 
export function encrypt(plain: string) {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(plain, key, { iv });

  const ciphertextBase64 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  const ivHex = iv.toString(CryptoJS.enc.Hex);

  return { encrypted: ciphertextBase64, iv: ivHex };
}

