import React, { useState, useEffect } from "react";

export default function RandomValueGenerator() {
  const [randomValue, setRandomValue] = useState("");

  function generateRandomValue() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const value = BigInt(array.join("")).toString();
    setRandomValue(value);
  }

  useEffect(() => {
    generateRandomValue();
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
