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

Now you can deploy it as follow:

```javascript
// deploy.ts

import "@nomiclabs/hardhat-ethers";
import { ethers } from "hardhat";

async function main() {
  const verifier = await ethers.deployContract("Verifier");
  await verifier.waitForDeployment();

  console.log(`Verifier contract deployed to ${await verifier.getAddress()}`);
}
```
