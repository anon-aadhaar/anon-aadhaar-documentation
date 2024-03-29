import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import {
  convertBigIntToByteArray,
  decompressByteArray,
  createCustomV2TestData,
  returnFullId,
  rawDataToCompressedQR,
} from "@anon-aadhaar/core";

// Helper function to convert PEM encoded string to ArrayBuffer
function str2ab(str) {
  const binaryString = window.atob(
    str.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, "")
  );
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Will sign the data with the keys generated for test
const signNewTestData = async (newSignedData) => {
  // Fetch and await the private key text
  const privateKeyResponse = await fetch(
    "https://anon-aadhaar.s3.ap-south-1.amazonaws.com/testPrivateKey.pem"
  );
  const privateKeyText = await privateKeyResponse.text();

  // Import the private key for use with Web Crypto
  const privateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    str2ab(privateKeyText), // Convert PEM to ArrayBuffer
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" },
    },
    false,
    ["sign"]
  );

  // Convert data to ArrayBuffer and sign
  const dataBuffer = new TextEncoder().encode(newSignedData);
  const signature = await window.crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    dataBuffer
  );

  return new Uint8Array(signature);
};

export default function QRGenerator() {
  const [qrCode, setQrCode] = useState("");

  const generateNewQR = (data, dob, gender, pincode, state) => {
    const qrDataBytes = convertBigIntToByteArray(BigInt(data));
    const decodedData = decompressByteArray(qrDataBytes);

    // Turning test data V1 into V2
    // Adding the version specifier prefix,
    // the last 4 digits of phone number and timestamp to now
    const dataToSign = createCustomV2TestData(
      decodedData.slice(0, decodedData.length - 256),
      dob,
      pincode,
      gender,
      state
    );

    // Signing the newly generated testData
    const signature = signNewTestData(dataToSign);

    // Reconstructing the whole QR data
    const tempData = Buffer.concat([dataToSign, signature]);

    // Compressing the data to have it in the same format as the QR code
    const newCompressedData = rawDataToCompressedQR(tempData);
    const newQrData = {
      testQRData: newCompressedData.toString(),
      ...returnFullId(dataToSign),
    };

    console.log(newQrData);
  };

  useEffect(() => {
    generateNewQR();
  }, []);

  return (
    <div>
      <p>
        Random Value: <strong>{randomValue}</strong>
      </p>
      <button onClick={() => generateRandomValue()}>Generate New Value</button>
    </div>
  );
}
