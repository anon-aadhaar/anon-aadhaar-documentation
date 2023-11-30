---
sidebar_position: 3
---

# Install the Solidity verifier

Below, we'll demonstrate how to seamlessly integrate the Anon Aadhaar Solidity Verifier using Hardhat. This integration empowers you to verify Anon Aadhaar proofs directly on the blockchain. Here's how:

1. Create a contracts folder at the root of your app, and initialize Hardhat:

```bash
mkdir contracts
yarn add --dev hardhat
cd contracts
npx hardhat
```

2. Install the Anon Aadhaar Verifier contract library:

```bash
yarn add anon-aadhaar-contracts
```

3. Install the Hardhat dependency compiler:

```bash
yarn add hardhat-dependency-compiler
```

4. Update your Hardhat config to include the Verifier.sol smart contract:

```javascript
// hardhat.config.ts

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-dependency-compiler";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  dependencyCompiler: {
    paths: ["anon-aadhaar-contracts/contracts/Verifier.sol"],
  },
};

export default config;
```

5. Use the `AnonAadhaarVerifier` from the example app:

This contract have the checks and logics needed. Also, you can customise it by the choosing the RSA public key you want to check and also initiate the contract with your appId.

you can find the full implementation [here](https://github.com/anon-aadhaar-private/anon-aadhaar-example/tree/main/contracts)

You'll see that there is two different `ISSUER_MODULUS` the one used is the one with the test pdf (signed.pdf) file, for testing with a fake Aadhaar card. The one commented is the actual RSA public of your official Aadhaar card. So you can choose to verify the fake test card or a real Aadhaar card.

> But we strongly advise to use the test version on-chain as the protocol is still in development.

```js
// Production public key
// uint[32] public ISSUER_MODULUS = [7873437550307926165, 13477973865601442634, 1458039844062964693, 7398834103216365279, 12384545621709803393, 14386943674931866539, 2263535879398593693, 3600615314669141235, 13096864295899435543, 8628516684870087465, 343547845356630073, 10551339838260165529, 10902964543149146524, 4056605863534888131, 17764439819646281378, 5137209503034180614, 2378644744463171581, 6676194234629029970, 5432490752817224179, 12846544745292400088 , 3434369281354788863, 1533621309896666264, 18225262974130476508, 10073981006187788275, 8114837903070988230, 7632965149656839367, 2714276348828835947, 615665516684210923, 1084184375765016924, 17345989530239433420, 8106155243977228977, 11705466821727348154];
// Test PDF public key
uint[32] public ISSUER_MODULUS = [ 14802194023203656093, 2804169383069916853, 496991132330559339, 2044134272263249048, 9625896386217978454, 10967403457044780298, 9775317524806066771, 5561505371079494480, 10560300512109825190, 16129190325487635890, 18001156251078908687, 461092412729958323, 6331149421243581141, 11783897075401707273, 15565812337639205350, 523229610772846347, 17536660578867199836, 7115144006388206192, 9426479877521167481, 916998618954199186, 16523613292178382716, 1357861234386200203, 2235444405695526401, 12616767850953148350, 2427846810430325147, 4335594182981949182, 841809897173675580, 8675485891104175248, 7117022419685452177, 14807249288786766117, 12897977216031951370, 15399447716523847189];
```

Now you can deploy it as follow:

```javascript
// deploy.ts

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const verifier = await ethers.deployContract("Verifier");
  await verifier.waitForDeployment();

  const _verifierAddress = verifier.getAddress();

  // Setup you appId in the smart contract
  const appId = BigInt("your-app-id").toString();

  const anonAadhaarVerifier = await ethers.deployContract(
    "AnonAadhaarVerifier",
    [_verifierAddress, appId]
  );
  await anonAadhaarVerifier.waitForDeployment();

  const _anonAadhaarVerifierAddress = verifier.getAddress();

  const vote = await ethers.deployContract("Vote", [
    "Do you like this app?",
    ["0", "1", "2", "3", "4", "5"],
    _anonAadhaarVerifierAddress,
  ]);

  await vote.waitForDeployment();

  console.log(`Vote contract deployed to ${await vote.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```
