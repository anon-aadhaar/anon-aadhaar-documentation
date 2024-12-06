---
sidebar_position: 2
---

# Anon DigiLocker 

**Anon DigiLocker** is a protocol for proving ownership of identity documents in DigiLocker by selectively revealing information in the doc.

We create Zero Knowledge Proof for proving ownership of any signed documents stored in DigiLocker. Proof generation happens entirely on the browser meaning no data has to be sent to a server. The proof can be verified on-chain and off-chain.

**Github Repo: [https://github.com/anon-aadhaar/anon-digilocker](https://github.com/anon-aadhaar/anon-digilocker)** <br/>
**Demo: [https://anon-digilocker.vercel.app/](https://anon-digilocker.vercel.app/)**

## Things you can prove using Digilocker stack

1. Prove ownership and share your PAN card number and its verification date
2. Prove ownership and share your Driving License number with signature validation
3. Prove ownership of any other document issued through the DigiLocker app
4. Selective data from the `<CertificateData />` node in the XML document (note: document type like PAN, Driving License, etc. will always be revealed)

## How it works

- DigiLocker documents are issued with XML signatures.
- The signature process works like this - the certificate data is signed using SHA256, and the hash is added to the `<SignedInfo>` node, which is then signed under SHA1-RSA.
- The circuits take in
  - The signed data of the XML
  - `<SignedInfo>` node
  - Signature and Public key
  - and more...
- The circuit generates the `SHA256` hash of the signed data, ensures it is present in the `<SignedInfo>` node, generates the `SHA1` hash of the `<SignedInfo>` node, and verifies the RSA signature of `SHA1` hash with the public key.
- The circuit extracts the type of document (`PAN`, `DrivingLicense`, etc), computes a nullifier, and reveals data between the start and end indices as set by the prover.

<br />

## 📦 Packages

This repo contains the core ZK circuits of Anon DigiLocker and JS SDK for developers to integrate into their applications. 

The following packages are available on github.

- [@anon-digilocker/circuits](https://github.com/anon-aadhaar/anon-digilocker/tree/main/packages/circuits) - ZK circuits of Anon DigiLocker written in circom
- [@anon-digilocker/core](https://github.com/anon-aadhaar/anon-digilocker/tree/main/packages/core) - JS SDK to generate and verify Anon DigiLocker proofs
- [@anon-digilocker/contracts](https://github.com/anon-aadhaar/anon-digilocker/tree/main/packages/contracts/) - Solidity contracts to verify Anon DigiLocker proofs
