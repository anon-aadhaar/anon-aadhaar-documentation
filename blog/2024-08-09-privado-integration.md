---
slug: privado-integration
title: Groth16 Proofs Integration as an Issuer in Privado
authors:
  name: Anon Aadhaar
  title: PSE - Anon Aadhaar team
  url: https://github.com/anon-aadhaar
  image_url: https://github.com/anon-aadhaar.png
tags: [anon-aadhaar, zk, privacy, privado, SSI]
---

# Groth16 Proofs Integration as an Issuer in Privado

A few weeks ago, we initiated a conversation with the Privado team to explore potential collaborations. What followed was an exciting experiment that we are thrilled to share in this article.

### What is Privado?

[Privado.id](https://www.privado.id/) is an innovative platform building a decentralized identity infrastructure, empowering an open ecosystem of credential providers and applications through an open-source toolset. Privado’s vision is to enable trusted issuers to create and sign credentials, while allowing end users to securely access, store, and manage these credentials in a sovereign manner.

One of the standout features of Privado is its use of ZKPs (Zero-Knowledge Proofs) to facilitate selective disclosure, granting users the ability to reveal only the necessary information to verifiers. This is a powerful tool for maintaining privacy while still providing valid proofs of identity.

In an ideal scenario, the Indian government would adopt Privado as an issuer, enabling citizens to share their identity credentials in a sovereign and private manner. While this may be the future, we decided to take a proactive step by utilizing our protocol to create a solution that bridges the gap until such a reality is achieved.

### Introducing Anon Aadhaar

Anon Aadhaar is a zero-knowledge protocol designed to allow Indian citizens to generate a proof of identity through their Aadhaar, which is the world's largest identity program, with over 1.4 billion participants.

This protocol is built using Circom's Groth16 and represents a snarkified implementation of RSA-SHA256 signature verification of the Aadhaar Secure QR code. In addition to signature verification, Anon Aadhaar offers selective disclosure features, allowing the user to choose to reveal specific values such as age (above 18), gender, zip code, or state name.

### Replacing the Identity Issuer with Snarks

Privado offers two types of issuers: off-chain (via a Node server) and on-chain (through a smart contract). We opted for the on-chain issuer to achieve complete decentralization, avoiding the need for server maintenance.

When using an on-chain issuer, there are two credential data structure options: merklized and non-merklized. The merklized structure enables selective disclosure of credential data fields, while the non-merklized structure is limited to a maximum of four data fields.

We chose the non-merklized structure for two key reasons:

1. **Decentralization:** The merklized version requires a server to manage the state of the Merkle Tree (MT), which would need to be called every time a value is disclosed. To maintain a decentralized approach, we preferred to avoid this dependency.
2. **Data Field Limitation:** The four data fields offered by the non-merklized structure align perfectly with the values we wanted to store alongside the credential.

### How the On-Chain Issuer Works

The on-chain issuer is a smart contract that manages credentials—in our case, the Anon Aadhaar credential. It can handle the following requests:

- **Add a Credential:** This function calls our Solidity verifier to validate the Anon Aadhaar proof, along with other checks such as verifying the timestamp (which must be within three hours), ensuring the nullifier is linked to the nullifier seed in the smart contract, and confirming that the signal corresponds to the sender’s address. Once validated, a credential is created for a set period (30 days) in the format of a W3C JSON-LD credential and stored in the smart contract.
- **Revoke a Credential:** This function allows the contract owner to revoke a credential.
- **Retrieve a Credential:** This function enables the user’s Privado ID to query and retrieve their credentials.

You can explore the implementation of the Issuer contract [here](https://github.com/anon-aadhaar/privado-contracts).

### Adding the Credential to Your Privado Wallet

We developed a front-end application that allows users to connect with their Privado wallet. The process involves generating an Anon Aadhaar proof, which is then sent to the on-chain issuer. The issuer verifies the proof, and if no credential exists or if the existing credential has expired, a new credential is generated. The application can then query the smart contract to check for any credentials linked to the user’s Privado ID, allowing the user to add it to their Privado wallet.

### What's next?

The primary objective of this integration was to demonstrate the potential of zk-SNARK protocols for identity proofing, showcasing how a trusted issuer can be replaced by a decentralized method of credential generation within a broader ecosystem, through a ZKP. We believe that the concept of [Self-Sovereign Identity (SSI)](https://en.wikipedia.org/wiki/Self-sovereign_identity) holds significant promise and could greatly enhance our digital interactions and privacy, from authentication to everyday administrative tasks.

Privado also presents a compelling solution for countries that do not yet have a digital identity program like Aadhaar. We are eager to witness more widespread adoption of digital identities and cryptographic signatures, which hold tremendous potential in the realm of programmable cryptography.
