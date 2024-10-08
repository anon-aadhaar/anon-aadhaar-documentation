---
sidebar_position: 0
---

# Introduction

Let's discover **Anon Aadhaar**.

![Anon Aadhaar Banner](./img/anonAadhaarBanner.png)

## What's Anon Aadhaar?

### Overview

Anon Aadhaar is a zero-knowledge protocol that allows Aadhaar ID owners to prove their identity in a privacy preserving way. It provides a set of tools to generate and verify proofs, authenticate users and verify proofs on-chain.

### Features

With anon aadhaar, you can do the following:

- Generate a ZKP of an Aadhaar card verification
- Verify this proof on-chain or off-chain
- Send a signal alongside the ZKP

### Packages

- [`@anon-aadhaar/core`](https://www.npmjs.com/package/@anon-aadhaar/core)
- [`@anon-aadhaar/react`](https://www.npmjs.com/package/@anon-aadhaar/react)
- [`@anon-aadhaar/contracts`](https://www.npmjs.com/package/@anon-aadhaar/contracts)

### About the code

The Anon Aadhaar protocol is built arount a circuit that take the RSA signature contained in the Aadhaar QR code and verifies that it was signed by the Indian government public key.
In addition to the circuit, Anon Aadhaar provides a Solidity Verifier contract and a react library that allow developers to authenticate users based on generated and verified zero-knowledge proofs with minimal effort.

> ⚠️ **IMPORTANT NOTE:** Anon Aadhaar is still under development and should not be used in production. If you are considering production use, please get in touch with us for further guidance. The current protocol hides your identity from all parties except the Issuer of your Aadhaar. Please consider this when working with Anon Aadhaar proof.

### Links

- [Anon Aadhaar repository](https://github.com/anon-aadhaar/anon-aadhaar)
- [Example voting app](https://boilerplate.anon-aadhaar.pse.dev/)
- [Boilerplate repository](https://github.com/anon-aadhaar/boilerplate)
