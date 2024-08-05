# Signal

### Anon Aadhaar Signal

Signal is a commitment feature that enables users to securely commit to a value, such as their Ethereum address, during proof generation. This mechanism is primarily designed to mitigate on-chain front-running by concealing the commitment until the transaction is processed. Additionally, it facilitates transaction signing in ERC-4337 integrations, enhancing security and integrity in blockchain interactions.

It will be set to 1 by default in the SDK.

When using `@anon-aadhaar/react`, you can pass a custom value to the `LogInWithAnonAadhaar` component:

```typescript
import { LogInWithAnonAadhaar } from "@anon-aadhaar/react";

return <LogInWithAnonAadhaar signal={"any signal value"} />;
```

When using `@anon-aadhaar/core`, you can pass a custom value to the `generateArgs` function:

```typescript
import { init, prove, artifactUrls, ArtifactsOrigin, generateArgs } from "@anon-aadhaar/core";
import type { InitArgs } from "@anon-aadhaar/core";
import { certificate } from "./src/utils/certificate";
import { qrCode } from "./src/utils/qr-code";

// Change prod to test if you want to verify the test Aadhaar data
const anonAadhaarInitArgs: InitArgs = {
  wasmURL:  artifactUrls.v2.wasm,
  zkeyURL: artifactUrls.v2.zkey,
  vkeyURL: artifactUrls.v2.vk,
  artifactsOrigin: ArtifactsOrigin.server,
};

try {
  // Initialize the core package
  await init(anonAadhaarInitArgs);

  const nullifierSeed = 1234;

  // QR code data as a string from qr png named download.png
  const qrData = qrCode;

  // certificate: x509 certificate containing the public key
  // it can be downloaded from: https://www.uidai.gov.in/en/916-developer-section/data-and-downloads-section/11349-uidai-certificate-details.html
  const args = await generateArgs({
    qrData,
    certificateFile: certificate,
    signal: "1234532454678",
    nullifierSeed,
    fieldsToRevealArray: ['revealAgeAbove18','revealGender','revealPinCode','revealState']
  });

  const anonAadhaarCore = await prove(args);
  console.log("Proof generated successfully:", anonAadhaarCore);
} catch (error) {
  console.error("An error occurred:", error);
}
```
