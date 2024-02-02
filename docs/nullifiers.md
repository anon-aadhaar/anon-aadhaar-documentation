# Nullifiers

### Anon Aadhaar Nullifiers

There is two different nullifiers:

- `userNullifier`: A hash of the Aadhaar number's last 4 digits and the identity photo, addressing collision issues using unique photo bytes for app interactions. This is the one that must be used to nullify your users interactions.

last4 = the last 4 digits of the Aadhaar number

userNullifier = Hash(last4, photo bytes)

- `identityNullifier`: A hash of various identity elements like the last 4 digits, DOB, name, gender, and PIN code. This facilitates nullifier recovery if identity data changes. For example, if a user changes their photo, altering their userNullifier, they can still be linked to their previous interactions by providing all fields used in the userNullifier computation.

identityNullifier = Hash(last4, name, dob, gender, pin code)
