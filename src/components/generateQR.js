import React, { useState } from "react";
import QRCode from "qrcode";

export default function QRGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateNewQR = async () => {
    const privateKeyResponse = await fetch(
      "https://nodejs-serverless-function-express-eight-iota.vercel.app/api/get-fresh-qr"
    );

    if (!privateKeyResponse.ok) {
      throw new Error("Something went wrong when fetching new QR code");
    }

    const newQrData = await privateKeyResponse.json();

    try {
      const url = await QRCode.toDataURL(newQrData.testQRData, {
        color: {
          dark: "#000",
          light: "#FFF",
        },
      });
      setQrCodeUrl(url);

      console.log("QR code generated");
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div>
      {qrCodeUrl && (
        <div>
          <img src={qrCodeUrl} alt="Generated QR Code" />
        </div>
      )}
      <button onClick={() => generateNewQR()}>Generate New Value</button>
    </div>
  );
}
