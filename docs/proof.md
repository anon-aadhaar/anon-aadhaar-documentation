# Proofs

### Anon Aadhaar Proofs

The proof generation is handled by the SDK, you can either work with the `@anon-aadhaar/react` package (see quick-setup) that makes abstraction of this process or by using the methods of the `@anon-aadhaar/core` package like so:

Install `@anon-aadhaar/core`:

```bash
yarn add @anon-aadhaar/core
```

Then:

```typescript
import { init, prove, InitArgs, artifactUrls , ArtifactsOrigin } from "@anon-aadhaar/core";

// Change prod to test if you want to verify the test Aadhaar data
const anonAadhaarInitArgs: InitArgs = {
  wasmURL: artifactsUrls.prod.wasm,
  zkeyURL: artifactsUrls.prod.zkey,
  vkeyURL: artifactsUrls.prod.vk,
  artifactsOrigin: ArtifactsOrigin.server
};

// Initialize the core package
await init(anonAadhaarInitArgs);

const nullifierSeed = 1234;

// QRData: the string read from the QR code
// certificate: x509 certificate containing the public key
// it can be downloaded from: https://www.uidai.gov.in/en/916-developer-section/data-and-downloads-section/11349-uidai-certificate-details.html
const args = await generateArgs({
  QRData,
  certificateFile,
  nullifierSeed,
});

const anonAadhaarCore = await prove(args);
```

Once the proof is generated the output will be an `AnonAadhaarCore` object, it's composed of:

- **type**: `anon-aadhaar`
- **id**: Not relevant and should not be used for any operations.
- **claim**:
  - `pubKey`: The RSA public key of the issuer.
  - `signalHash`: Hash of the signal.
- **proof**: `anonAadhaarProof`

Here are the details of the `anonAadhaarProof`:

- `nullifier`: Hash(nullifierSeed, photo bytes).
- `timestamp`: Timestamp of the QR code signature, could be used to ensure that the proof was generated x hours ago.
- `pubkeyHash`: Hash of the public key.
- `nullifierSeed`: Let you check that the nullifier was indeed computed with your seed.
- `signalHash`: Hash of the signal.
- `ageAbove18`: "0", if false, "1" if true.
- `gender`: "77" if M, "70" if F.
- `state`: State in BigInt format.
- `pincode`: Pincode in string format.
- `groth16Proof`: The groth16 SNARK proof.

For decoding BigInt formatted `gender` and `state`:

```javascript
import { convertRevealBigIntToString } from "@anon-aadhaar/core";

convertRevealBigIntToString(gender)
```


### Verify a proof off-chain

Again if using the react SDK like in the quick-setup the proof is verified once the user generated it, and set the status of the user to "logged-in".

But if you are integrating with the `@anon-aadhaar/core` package you'll simply need to use the `verify` method and pass it the `AnonAadhaarCore` object. Also at this step you might want to verify the timestamp to ensure that the QR data was generated recently and that the user have access to his UIDAI portal.

### Verify a proof on-chain

To verify a proof on-chain you will need to use the `AnonAadhaar.sol` contract, that you can import with from `@anon-aadhaar/contracts`.

Install the package in your hardhat project:

```bash
yarn add @anon-aadhaar/contracts
```

Then you'll be able to import the `IAnonAadhaar.sol` interface like so:

```javascript
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";
```

Then you can call the verifier, by sending these parameters:

- `nullifierSeed`
- `nullifier`
- `timestamp`
- `signal`
- `revealArray`: Array of the values used as input for the proof generation (equal to [0, 0, 0, 0] if no field reveal where asked)

```javascript
IAnonAadhaar(anonAadhaarVerifierAddr).verifyAnonAadhaarProof(
  nullifierSeed, // nulifier seed
  nullifier,
  timestamp,
  signal,
  revealArray,
  groth16Proof
);
```

Here you can find an example Vote contract integration:

```javascript
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "@anon-aadhaar/contracts/interfaces/IAnonAadhaar.sol";
import "@anon-aadhaar/contracts/interfaces/IAnonAadhaarVote.sol";

contract AnonAadhaarVote is IAnonAadhaarVote {
    string public votingQuestion;
    address public anonAadhaarVerifierAddr;

    // List of proposals
    Proposal[] public proposals;

    // Mapping to track if a userNullifier has already voted
    mapping(uint256 => bool) public hasVoted;

    // Constructor to initialize proposals
    constructor(string memory _votingQuestion, string[] memory proposalDescriptions, address _verifierAddr) {
        anonAadhaarVerifierAddr = _verifierAddr;
        votingQuestion = _votingQuestion;
        for (uint256 i = 0; i < proposalDescriptions.length; i++) {
            proposals.push(Proposal(proposalDescriptions[i], 0));
        }
    }

    /// @dev Convert an address to uint256, used to check against signal.
    /// @param _addr: msg.sender address.
    /// @return Address msg.sender's address in uint256
    function addressToUint256(address _addr) private pure returns (uint256) {
        return uint256(uint160(_addr));
    }

    /// @dev Check if the timestamp is more recent than (current time - 3 hours)
    /// @param timestamp: msg.sender address.
    /// @return bool
    function isLessThan3HoursAgo(uint timestamp) public view returns (bool) {
        return timestamp > (block.timestamp - 3 * 60 * 60);
    }

    /// @dev Register a vote in the contract.
    /// @param proposalIndex: Index of the proposal you want to vote for.
    /// @param nullifierSeed: Nullifier Seed used while generating the proof.
    /// @param nullifier: Nullifier for the user's Aadhaar data.
    /// @param timestamp: Timestamp of when the QR code was signed.
    /// @param signal: signal used while generating the proof, should be equal to msg.sender.
    /// @param revealArray: Array of the values used as input for the proof generation (equal to [0, 0, 0, 0] if no field reveal where asked).
    /// @param groth16Proof: SNARK Groth16 proof.
    function voteForProposal(
        uint256 proposalIndex,
        uint nullifierSeed,
        uint nullifier,
        uint timestamp,
        uint signal,
        uint[4] memory revealArray,
        uint[8] memory groth16Proof
    ) public {
        require(
            proposalIndex < proposals.length,
            '[AnonAadhaarVote]: Invalid proposal index'
        );
        require(
            addressToUint256(msg.sender) == signal,
            '[AnonAadhaarVote]: wrong user signal sent.'
        );
        require(
            isLessThan3HoursAgo(timestamp) == true,
            '[AnonAadhaarVote]: Proof must be generated with Aadhaar data generated less than 3 hours ago.'
        );
        require(
            IAnonAadhaar(anonAadhaarVerifierAddr).verifyAnonAadhaarProof(
                nullifierSeed, // nulifier seed
                nullifier,
                timestamp,
                signal,
                revealArray,
                groth16Proof
            ) == true,
            '[AnonAadhaarVote]: proof sent is not valid.'
        );
        // Check that user hasn't already voted
        require(
            !hasVoted[nullifier],
            '[AnonAadhaarVote]: User has already voted'
        );

        proposals[proposalIndex].voteCount++;
        hasVoted[nullifier] = true;

        emit Voted(msg.sender, proposalIndex);
    }
}

```

There is some some important details to notice here.

- `signal`, is used as way to prevent from the proof being front-runned, while the proof will be generated the user will commit to his address as a signal and the contract will check that the `msg.sender` is corresponding to the `signal`.
- `timestamp`, is used as a way to verify that the proof was generated from a QR code created less than # hours ago.
- `nullifier`, is used to nullify the user contract interaction, letting him voting only once as the nullifier will remain unique for each identity.
- `nullifierSeed`, to prevent double spending, letting your app know what was the seed to the nullifier.
