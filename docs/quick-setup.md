---
sidebar_position: 2
---

# Quick setup

## Install the `anon-aadhaar-react` package

with npm

```javascript
npm install anon-aadhaar-react
```

with yarn

```javascript
yarn add anon-aadhaar-react
```

To use the library you'll need to generate an application ID, you can generate it by running this script once and store your unique app_id.

```javascript
import crypto from "crypto";

const app_id = BigInt(
  parseInt(crypto.randomBytes(20).toString("hex"), 16)
).toString(); // random value.
```

You can add it to your app as an env variable for example, by adding a `.env.local` file at the root of your app with the following value:

```bash
NEXT_PUBLIC_APP_ID="<the app id you just generated>"
```

## Add the AnonAadhaar Provider

At the root of your app add the AnonAadhaar Provider and initialize it with your app ID:

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "anon-aadhaar-react";

const app_id = process.env.NEXT_PUBLIC_APP_ID || "";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Add the Country Identity Provider at the root of your app
    <AnonAadhaarProvider _appId={app_id}>
      <Component {...pageProps} />
    </AnonAadhaarProvider>
  );
}
```

The SDK is initially configured to validate a simulated test Aadhaar card by default. This means that the verification process relies on the RSA public key (modulus) stored in the PDF certificate to compute the proof. However, because the circuit only verifies the correctness of an RSA signature, it's essential to provide the official Aadhaar card issuer's public key to the circuit. This step ensures that the proof confirms the statement 'I possess a document with a verified RSA signature from the official Aadhaar Issuer.'. Note here that it will also works with your real Aadhaar card, but it will only prove the statement 'I possess a document with a verified RSA signature.'.

For the generation of an accurate Identity proof based on a masked Aadhaar PDF, it's crucial to set the variable \_testing to false when passing it to the provider:

```tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "anon-aadhaar-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Add the Country Identity Provider at the root of your app
    <AnonAadhaarProvider _appId={app_id} _testing={false}>
      <Component {...pageProps} />
    </AnonAadhaarProvider>
  );
}
```

This configuration ensures that the AnonAadhaarProvider is properly set up within your React application, allowing the SDK to perform Aadhaar verification and RSA signature validation accurately by fetching the official public key and use as input to the witness that will be computed to generate the zk proof.

Now you can use the anon aadhaar hook.

## use AnonAadhaar

```tsx
import { useAnonAadhaar } from "anon-aadhaar-react";

// Use the Country Identity hook to get the status of the user.
export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  return <p>{anonAadhaar?.status}</p>;
}
```

## Add the AnonAadhaar connect button

```js
import { LogInWithAnonAadhaar, useAnonAadhaar } from "anon-aadhaar-react";
import { useEffect } from "react";

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  return (
    <div>
      <LogInWithAnonAadhaar />
      <p>{anonAadhaar?.status}</p>
    </div>
  );
}
```

Now your users can log into your app by generating a PCD ZKP, this button will open a modal and let the user upload his Aadhaar card pdf and its certificate.

Once the user is logged-in you can access and display the proof.

## Display the anon Aadhaar proof

```jsx
import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
} from "anon-aadhaar-react";
import { useEffect } from "react";

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  return (
    <div>
      <LogInWithAnonAadhaar />
      <p>{anonAadhaar?.status}</p>
    </div>
    <div >
      {/* Render the proof if generated and valid */}
      {anonAadhaar?.status === "logged-in" && (
        <>
          <p>✅ Proof is valid</p>
          <AnonAadhaarProof code={JSON.stringify(anonAadhaar.pcd, null, 2)}/>
        </>
        )}
    </div>
  );
}
```

<!-- ---

# Quick setup video demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/3CD0Q-TBN0g?si=Cfv1dR3X3YA2vm5V" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> -->

---

# Links

You can find an example app [here](https://github.com/anon-aadhaar-private/quick-setup)

### Download test files

To test the proof generation and authentication flow, you can download these files:

- [Signed pdf](/signed.pdf)
- Password: **test123**
