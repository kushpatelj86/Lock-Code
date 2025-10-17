import * as Crypto from "expo-crypto";
import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse("12345678901234561234567890123456");

export async function encrypt(plain: string) {
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  const iv = CryptoJS.lib.WordArray.create(randomBytes);

  const encrypted = CryptoJS.AES.encrypt(plain, key, { iv });

  const ciphertextBase64 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  const ivHex = iv.toString(CryptoJS.enc.Hex);

  return { encrypted: ciphertextBase64, iv: ivHex };
}


export async function decrypt(encrypted: string, ivHex: string) {
  const iv = CryptoJS.enc.Hex.parse(ivHex);
  const ciphertext = CryptoJS.enc.Base64.parse(encrypted);

  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, key, { iv });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

