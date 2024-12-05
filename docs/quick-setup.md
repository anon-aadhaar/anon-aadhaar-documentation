---
sidebar_position: 2
---

# Quick setup

## Install the `@anon-aadhaar/react` package

with npm

```javascript
npm install @anon-aadhaar/react
```

with yarn

```javascript
yarn add @anon-aadhaar/react
```

## Add the AnonAadhaar Provider

This needs to be **at the root of your app** add the AnonAadhaar Provider and initialize it with your app ID:

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AnonAadhaarProvider>
      <Component {...pageProps} />
    </AnonAadhaarProvider>
  );
}
```

The SDK is initially configured to validate a real Aadhaar card by default. You can use test Data by passing `_useTestAadhaar` variable to true.

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AnonAadhaarProvider _useTestAadhaar={true}>
      <Component {...pageProps} />
    </AnonAadhaarProvider>
  );
}
```

## Add the AnonAadhaar connect button and hook

You will need to give a nullifierSeed to the `LogInWithAnonAadhaar` component, you can generate one [here](./generate-seed.mdx).

```jsx
import { LogInWithAnonAadhaar, useAnonAadhaar } from "@anon-aadhaar/react";
import { useEffect } from "react";

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  return (
    <div>
      <LogInWithAnonAadhaar nullifierSeed={1234} />
      <p>{anonAadhaar?.status}</p>
    </div>
  );
}
```

You can generate a secure nullifierSeed by running the following snippet. Make sure to run it somewhere in Node.js and not directly in your application.

```javascript
import crypto from "crypto";

// Generates a random nullifierSeed
const nullifierSeed = BigInt(
  parseInt(crypto.randomBytes(10).toString("hex"), 16)
).toString(); // random 16 bytes value.
```

Now your users can log into your app by generating an `anonAadhaarProof`, this button will open a modal and let the user upload his Aadhaar card pdf and its certificate.

Once the user is 'logged-in' you can access and display the proof.

## Add a signal to sign

Optionally, you can set a signal for the user to sign while generating the proof.

```jsx
<LogInWithAnonAadhaar nullifierSeed={1234} signal="your signal" />
```

## Ask the user to reveal data from ID

Optionally, you can ask the user to reveal fields from his identity. Here are the options:

```ts
export type FieldKey =
  | "revealAgeAbove18"
  | "revealGender"
  | "revealState"
  | "revealPinCode";
```

You can choose what information you need from the user an fil the `fieldsToReveal` param like so:

```jsx
<LogInWithAnonAadhaar
  nullifierSeed={1234}
  fieldsToReveal={["revealAgeAbove18", "revealPinCode"]}
/>
```

In this example a boolean telling if the user is more than 18 and its full pincode will be revealed in the proof.

## Display the anon Aadhaar proof

```jsx
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
} from "@anon-aadhaar/react";
import { useEffect } from "react";

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  return (
    <div>
      <LogInWithAnonAadhaar nullifierSeed={1234} />
      <p>{anonAadhaar?.status}</p>
    </div>
    <div >
      {/* Render the proof if generated and valid */}
      {anonAadhaar?.status === "logged-in" && (
        <>
          <p>✅ Proof is valid</p>
          {latestProof && (
              <AnonAadhaarProof code={JSON.stringify(latestProof, null, 2)} />
            )}
        </>
        )}
    </div>
  );
}
```

## Off-chain Customized Verifier

By default, the SDK verifies the proof and ensures that the signing public key is correct, whether you are targeting test or production signed Aadhaar. However, for some use cases, you may want to leverage features exposed by the prover, such as `timestamp`, `nullifierSeed`, and Selective Disclosure. The following snippet provides an example of a customized verifier with custom logic.

```javascript
import {
  verify,
  init,
  artifactUrls,
  ArtifactsOrigin,
  InitArgs,
  AnonAadhaarCore,
  // Prodution public key hash from UIDAI
  productionPublicKeyHash,
  // Test public key hash from Anon Aadhaar QR Generator
  testPublicKeyHash,
} from "@anon-aadhaar/core";

async function verifyAnonAadhaarProof(anonAadhaarProof: AnonAadhaarCore) {
  // Arguments to initialise the core library
  const anonAadhaarInitArgs: InitArgs = {
    wasmURL: artifactUrls.v2.wasm,
    zkeyURL: artifactUrls.v2.zkey,
    vkeyURL: artifactUrls.v2.vk,
    artifactsOrigin: ArtifactsOrigin.server,
  };

  // Initialize the core library with the above arguments
  await init(anonAadhaarInitArgs);

  // Call the verify function from the core library.
  // Will verify the Groth16 proof and public signals.
  if (!(await verify(anonAadhaarProof)))
    throw Error("[verifyAnonAadhaarProof]: Your proof is not a valid proof.");
  // Verify that the signing public corresponf to the official UIDAI public key.
  if (!(productionPublicKeyHash === anonAadhaarProof.proof.pubkeyHash))
    throw Error(
      "[verifyAnonAadhaarProof]: The document was not signed with the Indian government public key."
    );
  // Verify that the proof was signed less than 1 hour ago.
  if (
    !(
      Math.floor(Date.now() / 1000) - Number(anonAadhaarProof.proof.timestamp) <
      3600
    )
  )
    throw Error(
      "[verifyAnonAadhaarProof]: Your QR must have been signed less than 1 hour ago."
    );
  // Verify that the nullifier seed is the same as the one used to generate the proof.
  if (
    !(
      anonAadhaarProof.proof.nullifierSeed ===
      process.env.NEXT_PUBLIC_NULLIFIER_SEED!
    )
  )
    throw Error(
      "[verifyAnonAadhaarProof]: Your must generate a proof from authorised frontend."
    );
  // Verify that the user is over 18 years old.
  if (!(anonAadhaarProof.proof.ageAbove18 !== "1"))
    throw Error(
      "[verifyAnonAadhaarProof]: Your must be over 18 to access this service."
    );

  return true;
}
```

---

# Troubleshooting

You might have issues with next when installing the package. You will need to add this to your `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      readline: false,
    };
    return config;
  },
};

module.exports = nextConfig;
```

## Run Anon Aadhaar on localhost mode

This enables you to run the proving flow without having to each time fetch zk artifacts from AWS, as it be quite long in case of a low internet speed.
In order to do that you'll download the zk artifacts on you computer, and add them under your public file at the root of your app.

Here are the links to download the files, just click the links and it will download the files:

- /[aadhaar-verfier.wasm](https://anon-aadhaar-artifacts.s3.eu-central-1.amazonaws.com/v2.0.0/aadhaar-verifier.wasm)
- /[circuit_final.zkey](https://anon-aadhaar-artifacts.s3.eu-central-1.amazonaws.com/v2.0.0/circuit_final.zkey)
- /[vkey.json](https://anon-aadhaar-artifacts.s3.eu-central-1.amazonaws.com/v2.0.0/vkey.json)

Make sure you file as the **same name as above** and are at the same place in your `public` folder

Then you'll pass the `_fetchArtifactsFromServer={false}` variable to the Provider like so:

```jsx
<AnonAadhaarProvider
  _useTestAadhaar={true}
  _artifactslinks={{
    zkey_url: "/circuit_final.zkey",
    vkey_url: "/vkey.json",
    wasm_url: "/aadhaar-verfier.wasm",
  }}
>
  <Component {...pageProps} />
</AnonAadhaarProvider>
```

# Links

You can find an example app [here](https://github.com/anon-aadhaar/quick-setup)

### Download test files

You can generate a test Aadhaar QR code [here](./generate-qr.mdx).
