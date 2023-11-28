---
sidebar_position: 1
---

# How Does It Work?

Quick overview of the proof generation process:

- Extract information from a PDF.
- Verify the signature and hash.
- Input the App ID and PDF data.
- Generate a proof of signature.

---

Anon Aadhaar is a zero-knowledge protocol allowing any Aadhaar citizen to prove they possess an Aadhaar issued and signed by the government. To create proof, only a masked eAadhaar is required, preserving your Aadhaar number.

### What Data Do We Need to Generate a Proof?

- The hash of the PDF, as it is the data signed by the government.
- The signature, necessary for validating its authenticity from the government.

External to the PDF:

- The Indian government RSA public key.
- An application ID.

We've developed a component named `extractWitness`. This component takes the PDF and its password as inputs. Its functionalities are outlined below:

- Retrieve the PDF's signature and signed data.
- Check the validity of the signature certificate and obtain the Issuer's public key.
- Recalculate the PDF's hash and validate the signature.
- Provide the hash of the PDF and the signature.

Once we've gathered the required information, we proceed to generate a witness for the prover.

For this stage, additional information needs to be passed—namely, the application ID and the Indian government's public key. The application ID aids in neutralizing the proof of identity, preventing users from duplicating their proof. It will be hashed alongside the signature, resulting in a unique identifier. This allows consumer applications to nullify a proof presented by a specific user.

![Alt text](./img/proving_flow.png)
