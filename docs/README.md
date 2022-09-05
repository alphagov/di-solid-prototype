# High level architecture

See the [sequence diagrams](./sequencediagrams/) for a more detailed explanation.

Note we have simplified the non-user facing part of the identity proving journey by removing SPOT as this prototype was focused
on ID reuse which happens at IPV Core.

Rectangular steps in the flowcharts are screens the user sees, circular ones are backend services which perform an action and redirect the user on without showing them a screen.

## Request a basic DBS check

A first-time user who creates a new GOV.UK Account, proves their identity and saves that proof of identity to their account.

```mermaid
graph TD
    A[Start page on GOV.UK] --> B
    B[DBS service] -->|Sends user to log in & requests ID| C
    C((ESS broker)) -->|Forwards to|D
    D[GOV.UK Sign In] --> E
    E[Account created] -->|Creates pod & WebID| F
    F((ESS pod creation)) -->|Ok|E
    E ---> G
    G((IPV Core)) -->|Checks pod for saved ID|H
    H[(User's pod)] -->|Not found|G
    G --> I
    I[Prove your identity] -->|Answers questions|J
    J[Save your proof of identity?] -->|Saves proof of ID|H
    H -->|Ok|J
    J -->|Redirect back to DBS| K
    K[Continue with DBS journey]
```

## Personal tax account

A returning user with a GOV.UK Account and a saved proof of identity is able to reuse that proof to shorten their journey.

```mermaid
graph TD
    A[Start page on GOV.UK] --> B
    B[PTA service] -->|Sends user to log in & requests ID| C
    C((ESS broker)) -->|Forwards to|D
    D[GOV.UK Sign In] --> E
    E[Signed in] --> G
    G((IPV Core)) -->|Checks pod for saved ID|H
    H[(User's pod)] -->|Found|G
    G --> I
    I[Reuse your saved identity?] -->|Redirect back to PTA| K
    K[Continue with PTA journey]
```

## Personal tax account with verified National Insurance number

A returning user with a GOV.UK Account and a saved proof of identity creates a personal tax account.
The personal tax service asks to check their account for a saved NI number, doesn't find one and sends
the user to a fictional NI number checker service which saves a verified credential containing their
NI number to the account before returning the user to the PTA service.

This journey demonstrates the access request and grant flow to allow services outside GDS to read
and write to the user's pod. It's not all incuded in the prototype, but the thumbnail screens are
in [Figma here](https://www.figma.com/file/f6Kn3ZhjCiiJSIQpNFt7On/Solid-example-flows?node-id=2026%3A2442).

```mermaid
graph TD
    A[Start page on GOV.UK] --> B
    B[PTA service] -->|Sends user to log in & requests ID| C
    C((ESS broker)) -->|Forwards to|D
    D[GOV.UK Sign In] --> E
    E[Signed in] --> G
    G((IPV Core)) -->|Checks pod for saved ID|H
    H[(User's pod)] -->|Found|G
    G --> I
    I[Reuse your saved identity?] -->|Redirect back to PTA| K
    K((PTA service)) -->|Request to read NI number|L
    L((ESS VC service)) -->|Ok|K
    K -->|Redirect to account|M
    M[Can HMRC read from your account?] -->|Approve request|N
    N((PTA service)) -->|Check pod for NI number|W
    W[(User's pod)] -->|Not found|N
    N -->|Redirect to|O
    O((NI number checker)) -->|Sign in|P
    P((GOV.UK Sign In)) -->|Already signed in|O
    O[Enter your NI number] -->Q
    Q[Save your NI number?] -->|Request to write NI number|L
    L -->|Ok|Q
    Q -->|Redirect to|R
    R[Can DWP write to your account?] -->|Approve|S
    S((NI checker)) -->|Save NI number| T
    T[(User's pod)] -->|Ok| S
    S -->|Return to|U
    U((PTA service)) -->|Read NI number|T
    T -->|Found|U
    U -->V[Continue with PTA journey]
```
