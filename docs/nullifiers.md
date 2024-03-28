# Nullifier

### Anon Aadhaar Nullifier Overview

In the Anon Aadhaar system, there exists a singular, crucial element for ensuring the privacy of user interactions: the `identityNullifier`. This component plays a vital role in "nullifying" or anonymizing a user's engagement with your application. The `identityNullifier` is intricately linked to two key pieces of data:

- **nullifierSeed**: A unique identifier specific to your application, serving as a foundational element in the creation of the `identityNullifier`. You can generate one [here](./generate-seed.mdx)
- **photo**: An image or photographic data tied to the user's identity, further personalizing the nullification process.

```
identityNullifier = Hash(nullifierSeed, photo)
```

### Ensuring Uniqueness and Security

To maintain the integrity of user interactions within your app, it is essential to enforce uniqueness by preventing the submission of multiple proofs tied to the same identity. This can be achieved by carefully managing the `nullifierSeed`:

- **App-Specific Seed**: Ensure that the `nullifierSeed` is unique to your application. This approach prevents cross-application identity collisions and enhances security.
- **Backend Management**: Store and manage the `nullifierSeed` within your application's backend infrastructure. This control allows you to monitor and regulate the usage of `identityNullifiers` effectively.
- **Action-Based or Universal**: Depending on your application's requirements, the `nullifierSeed` can be configured to be action-specific (unique to each user action) or universal (consistent across the app for each user). This flexibility allows for tailored privacy measures that best suit your application's dynamics and user interaction patterns.

By adhering to these guidelines, you ensure that the `identityNullifier` serves its purpose effectively—safeguarding user privacy through a secure, anonymous framework for app interactions.
