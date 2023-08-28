---
sidebar_position: 1
---

# Anon Aadhaar quick setup

## Install the `anon-aadhaar-react` package

with npm

```javascript
npm install anon-aadhaar-react
```

with yarn

```javascript
yarn add anon-aadhaar-react
```

## Add the AnonAadhaar Provider

At the root of your app add the AnonAadhaar Provider:

```javascript
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "anon-aadhaar-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    // Add the Country Identity Provider at the root of your app
    <AnonAadhaarProvider>
      <Component {...pageProps} />
    </AnonAadhaarProvider>
  );
}
```

Now you can use the anon aadhaar hook

## use AnonAadhaar

```js
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

You can find an example app [here](https://github.com/anon-aadhaar-private/anon-aadhaar-example)
