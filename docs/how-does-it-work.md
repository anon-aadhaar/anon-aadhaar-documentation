---
sidebar_position: 1
---

# How Does It Work?

## Anon Aadhaar: Verifying Aadhaar Documents with RSA

### Introduction

Anon Aadhaar is a zero-knowledge protocol designed to enable Aadhaar citizens to prove their possession of an Aadhaar document issued and signed by the government. This process ensures anonymity by utilizing a masked eAadhaar, preserving the confidentiality of the Aadhaar number.

### Workflow

#### RSA and Document Verification

At the core of this verification process lies RSA, a powerful cryptographic algorithm. RSA involves a private key used for signing and a corresponding public key used for verification of signatures.

1. **Document Data Extraction**:

   - Extract relevant information from the PDF, including its hash and signature.
   - Verify the signature's authenticity, ensuring the document's integrity.

2. **`extractWitness` Component**:

   - Takes the PDF and its password as inputs.
   - Validates the signature certificate and retrieves the Issuer's public key.
   - Recalculates the PDF's hash and validates the signature, providing essential data—PDF hash and signature.

3. **Generating Proof with RSA**:
   - Combine the PDF hash, signature, RSA public key and application ID.
   - The application ID acts as a unique factor, hashed alongside the signature, creating a distinctive identifier.
   - This identifier prevents duplication or misuse of the proof by users.

### Required Data for Proof Generation

To generate a proof, the following information is necessary:

- **From the PDF**:
  - PDF hash (data signed by the government).
  - Signature for validating authenticity.
- **External to the PDF**:
  - Indian government's RSA public key.
  - Application ID for neutralizing proof of identity.

![Alt text](./img/proving_flow.png)

### Zero-Knowledge Aspect

The zero-knowledge aspect of Anon Aadhaar ensures that while proving possession of a valid Aadhaar document, no sensitive information, is disclosed during the verification process. This safeguard enhances user privacy and security.

In summary, Anon Aadhaar leverages RSA's private key for signing and its corresponding public key for signature verification, ensuring anonymity and security for citizens without revealing sensitive information.

### Anon Aadhaar PCD Proof

The Anon Aadhaar [PCD](https://github.com/proofcarryingdata/zupass#proof-carrying-data) (Proof-carrying data) format for 0xParc is utilized to encapsulate and store the proofs. Below is the detailed specification of the JSON structure for Anon Aadhaar PCD proof:

- **type**: `anon-aadhaar-pcd`
- **claim**:
  - `modulus`: Represents the modulus of the claim, which is a cryptographic value (e.g., "26978..").
- **proof**:
  - `modulus`: This field contains the modulus related to the proof, likely an RSA public key of the signer (e.g., "2697...").
  - `nullifier`: Represents the nullifier, the output of a circuit hash(pdf_hash, appId) (e.g., "984...").
  - `app_id`: The ID of the application that generated the proof (e.g., "609..").
  - `proof`: This field contains the groth16 proof itself.

Please note:

- `id`: Not relevant and should not be used for any operations.
