import React, { useState } from "react";
import QRCode from "qrcode";
import { Oval } from "react-loader-spinner";

export default function QRGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const generateNewQR = async () => {
    setLoading(true);
    const privateKeyResponse = await fetch(
      "https://nodejs-serverless-function-express-eight-iota.vercel.app/api/get-fresh-qr"
    );

    if (!privateKeyResponse.ok) {
      setLoading(false);
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
      setLoading(false);
      setQrCodeUrl(url);

      console.log("QR code generated");
    } catch (error) {
      setLoading(false);
      console.error("Error generating QR code:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <p>Generating your QR code...</p>
        </div>
      ) : (
        qrCodeUrl && (
          <div>
            <img src={qrCodeUrl} alt="Generated QR Code" />
          </div>
        )
      )}
      <button onClick={() => generateNewQR()}>Generate New Value</button>
    </div>
  );
}
