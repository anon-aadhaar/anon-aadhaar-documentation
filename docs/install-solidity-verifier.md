---
sidebar_position: 3
---

# Install the Solidity verifier

> ⚠️ **IMPORTANT NOTE:** The existing protocol provides anonymity to users, shielding their identities from all entities except the Issuer of the Aadhaar ID card. It's crucial to be aware that the Issuer retains the capability to deanonymize users. Hence, exercise caution when handling proofs. While users remain anonymous to all but the Issuer, this unique aspect should be carefully considered when thinking of posting Anon Aadhaar proof on-chain.

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
yarn add @anon-aadhaar/contracts
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
    paths: ["@anon-aadhaar/contracts"],
  },
};

export default config;
```

1. Use the `AnonAadhaar.sol` contract:

This contract will verify the AnonAadhaarProof. You will find two different version of it, one the testing public key stored in it and the other one with the production public key.

You can import the verifier in your contract this way:

```javascript
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaarVote.sol";
```

Then make sure to build your contract with the corresponding verifier contract address, like so:

```javascript
address public anonAadhaarVerifierAddr;

 constructor(address _verifierAddr) {
    anonAadhaarVerifierAddr = _verifierAddr;
  }
```

Now you can call the verifier from your contract:

```javascript
IAnonAadhaar(anonAadhaarVerifierAddr).verifyAnonAadhaarProof(
  identityNullifier,
  userNullifier,
  timestamp,
  signal,
  groth16Proof
);
```

you can find the full implementation [here](https://github.com/anon-aadhaar/boilerplate/tree/main/contracts)

Now you can deploy it as follow, this script will deploy your own AnonAadhaar verifier but you can also use the already [deployed Sepolia contracts](https://github.com/anon-aadhaar/anon-aadhaar/tree/main/packages/contracts/deployed-contracts/sepolia.json):

```javascript
// deploy.ts

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const AnonAadhaarVerifier = await ethers.deployContract("AnonAadhaar");
  await AnonAadhaarVerifier.waitForDeployment();

  const _anonAadhaarVerifierAddress = AnonAadhaarVerifier.getAddress();

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
