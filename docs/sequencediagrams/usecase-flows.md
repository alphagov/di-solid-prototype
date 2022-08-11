
# Flow for initial Write
```mermaid

sequenceDiagram
autonumber
# Service - Prove your ID plz
# IPV Provice your ID with GOVUK Account
# AUTH Signin + Create Account
# AUTH Account created!
# IPV: Use a saved Pod or first time?
# IPV: Enter you details (passport num, dob, name etc)
# IPV.... Proved!
# GDS Account: Save this proof??
# GDS Account: SAVED.
# Service: DONE! ta. 

title DBS Check - Initial Flow

    participant Citizen
    participant GOVUK as Gov.uk static description
    participant Service as Departmental Service App
    participant Account as Account Dashboard
    participant Broker
    participant Orchestrator as Orchestrator Mock
    participant Auth
    participant IPV as IPV Core Mock
    participant DCS as Document Checking Service
    participant Pod
    participant WebID as WebID Service


# GOV Request DBS Check
GOVUK ->> Citizen: 'Apply for DBS check. Please click 'Begin' 
activate GOVUK
Citizen -->> GOVUK: Clicks Begin
deactivate GOVUK
GOVUK ->> Service: Redirect

Service ->> Citizen: 'You need to prove your ID using your Passport'
activate Service
Citizen -->> Service: Clicks 'Digitally' 
Service ->> Orchestrator: Redirect w/ scope=name, address, email, Passport. vtr=Cm Service=DBS
activate Orchestrator
deactivate Service


# Login 
#Note right of Orchestrator: We are assuming NO Solid Login here via Broker. We'll ask the user about that the Solid Pod later. There will be an option here to log in with Pod. We are just describing the inital flow here. 
Orchestrator ->> Citizen: 'Login/Create account please'
Citizen-->> Orchestrator: Credentials
Orchestrator -->> IPV: Redirect
activate IPV

#Enter details
#Note right of IPV: Apparently IPV doesnt have FE but a diagram showed it gathering PP number etc.... 
IPV ->> Citizen: Enter your passport information
Citizen -->> IPV: Passport information
IPV ->>+DCS: Does check with HMPO
DCS-->>-IPV: OK: Passport ID confirmation
IPV->>IPV: Create VC
IPV ->> Orchestrator: Done! PP w/ Medium confidence.
deactivate IPV
Orchestrator ->> Account: Redirect 


# Save to Pod
activate Account
Account ->> Citizen: Would you like to Save to Pod? 
Citizen -->> Account: OK

#Pod login. 
Account ->> Broker: Redirect
Broker ->> Orchestrator: Redirect
Orchestrator -->> Broker: Redirect
Broker -->> Account: Redirect w/ Solid OIDC token 
#Note right of Account: More detailed investigation required to know how straight forward this ID redirection flow is going to be. 

Account ->>  Pod: Create Pod
activate Pod
Pod -->> Account: OK
deactivate Pod
Account ->>+WebID: Add Pod to WebID Profile 
WebID -->>-Account: OK

Account ->>+Pod: Add 'Orchestrator WebID to Pod resource ACP'
Pod -->>-Account: OK 

Account ->> Orchestrator: Add Passport + Other attributes to Pod (Pod ID)
Orchestrator ->>+Pod: ID Attributes
Pod -->>-Orchestrator: OK
Orchestrator -->> Account: OK
deactivate Orchestrator

Account -->> Citizen: Done!
deactivate Account
```



# Second Flow for Read
```mermaid
sequenceDiagram
autonumber
title Tax Flow

# GOV Personal Tax Sign up
# AUTH Signin + Create Account
# Account: Use existing Proof?
#IPV does dance
# Service - ID Proved! 

###


    participant Citizen
    participant Service as Departmental Service App
    participant Account as Account Dashboard
    participant Broker
    participant AGS as Access Grant Service
    participant Orchestrator
    participant IPV as IPV Core
    participant Pod
    participant WebID as WebID Service

# GOV Personal Tax Sign up
# AUTH Signin + Create Account
# Account: Use existing Proof?
#IPV does dance
# Service - ID Proved! 


Service ->> Citizen: "Welcome to Tax service. Begin?" 
Citizen -->> Service: "OK"
#Note right of Orchestrator: We're gonna go to the Solid Broker here to get a token with a WebID. There is a conversation to be had here about how this would exactly work in practise. We could have some logic in the orchestrator to do this. 

Service ->> Orchestrator: Redirect w/ scope=name, address, email, Passport. vtr=Cm Service=Tax
activate Orchestrator

Orchestrator ->> Broker: Redirect: initiate Solid OIDC flow
activate Broker
Broker ->> Orchestrator: Redirect for authN
Orchestrator ->> Citizen: "Sign in"
Citizen -->> Orchestrator: Credentials
Orchestrator -->> Broker: Redirect
Broker -->> Orchestrator: Redirect w/ S-OIDC token
deactivate Broker

#Deref WebID Profile
Orchestrator ->> Orchestrator: Has Solid OIDC Token. Check for Pod
Orchestrator ->>+WebID: Get Profile
WebID -->>-Orchestrator: Profile

Orchestrator ->> Citizen: "We might have a previous ID check. Can we check?"
Citizen -->> Orchestrator: 'OK' 

Orchestrator->>+Pod: Get /private/ID_Attributes
Pod -->>-Orchestrator:  ID_ Attributes
Orchestrator ->> Orchestrator: Check ID_Attributes to see if good for use

# Access grant
alt Access Grant
Orchestrator ->>+AGS: Issue access request for 'purpose'
AGS->>-Orchestrator: Access Request

Orchestrator ->> Account: Redirect w/ Access Request
activate Account
Account ->> Citizen: "We have a previous ID check. Can we use it for <purpose>?"
Citizen -->> Account: "Yes" 
Account ->>+AGS: Issue Access Grant 
AGS -->>-Account: Access Grant for 'purpose'
#Note right of Account:We need further talk about access grants here. As the service isn't the thing thats doing the 'getting' Its all the orchestrator and its issuing its own grants. It might be better to do this with ACP...
Account -->> Orchestrator: Redirect w/ Access Grant
deactivate Account

Orchestrator->>+Pod: Get data with access grant
Pod-->>-Orchestrator: PP Data. 
#Note right of Pod: Need to be careful with this step. We've already got the info! Are we over complicating?

# ACP Direct Access
else ACP
Orchestrator ->> Citizen: "We already have an ID we can reuse. Ok?"
Citizen -->> Orchestrator: "Ok" 
end

opt Receipt
Orchestrator->>+Pod: Write Receipt
Pod -->>-Orchestrator: OK
end

Orchestrator->>+IPV: Check
IPV-->>-Orchestrator: OK!

Orchestrator -->> Service: Data.
deactivate Orchestrator
```
 

# Flow for Bundled' App initial Write
```mermaid

sequenceDiagram
autonumber
# Service - Prove your ID plz
# IPV Provice your ID with GOVUK Account
# AUTH Signin + Create Account
# AUTH Account created!
# IPV: Use a saved Pod or first time?
# IPV: Enter you details (passport num, dob, name etc)
# IPV.... Proved!
# GDS Account: Save this proof??
# GDS Account: SAVED.
# Service: DONE! ta. 

title DBS Check - Initial Flow

    participant Citizen
    participant DemoApp
    participant IPV as IPV Core Mock
    participant Auth as Auth/Orchestrator
    participant Broker
    participant Pod
    participant WebID as WebID Service


# GOV Request DBS Check
DemoApp ->> Citizen: 'Apply for DBS check. Please click 'Begin' 
activate DemoApp
Citizen -->> DemoApp: Clicks Begin
DemoApp ->>+Auth: Redirect for Login

# Login 
#Note right of Orchestrator: We are assuming NO Solid Login here via Broker. We'll ask the user about that the Solid Pod later. There will be an option here to log in with Pod. We are just describing the inital flow here. 
Auth ->> Citizen: 'Login/Create account please'
Citizen-->> Auth: Credentials
Auth -->>-DemoApp: Redriect

#Enter details
#Note right of IPV: Apparently IPV doesnt have FE but a diagram showed it gathering PP number etc.... 
DemoApp ->> Citizen: 'You need to prove your ID using your Passport' Enter your passport information
Citizen -->> DemoApp: Passport information
DemoApp ->>+IPV: Require <confidence-level> check..

activate IPV
IPV->>DemoApp: Check Pod first
DemoApp->>DemoApp: No WebID
DemoApp-->>IPV: Sorry, no Pod 

IPV->>IPV: Performs mock issuer check and generates mock credentials bag
IPV-->>-DemoApp: OK: Credentials 'bag'
deactivate IPV

# Save to Pod

DemoApp ->> Citizen: Would you like to Save to Pod? 
Citizen -->> DemoApp: OK

#Pod login. 
DemoApp ->> Broker: Redirect.
Broker ->>+Auth:  Auth takes exisitng Auth Cookie. Auto logs in
Auth -->>-Broker: Redirect
Broker -->> DemoApp: Redirect w/ Solid OIDC token. 
Note right of DemoApp: Now logged in with both Pod and Auth. 

DemoApp ->>+Pod: Create Pod
Pod -->>-DemoApp: OK

DemoApp ->>+WebID: Create WebID Profile and Add new Pod to WebID Profile 
WebID -->>-DemoApp: OK

DemoApp ->>+Pod: Created credential bag
Pod -->>-DemoApp: OK

DemoApp -->> Citizen: Done!
deactivate DemoApp

```


# Second Flow: Simplified
```mermaid
sequenceDiagram
autonumber
title Sharing: Tax Flow - Simplified 

# GOV Personal Tax Sign up
# AUTH Signin + Create Account
# Account: Use existing Proof?
#IPV does dance
# Service - ID Proved! 

###

    participant Citizen
    participant DemoApp
    participant IPV as IPV Core Mock
    participant Auth as Auth/Orchestrator
    participant Broker
    participant Pod
    participant WebID as WebID Service
    participant AGS as Access Grant Service
    
# GOV Personal Tax Sign up
# AUTH Signin + Create Account
# Account: Use existing Proof?
#IPV does dance
# Service - ID Proved! 


DemoApp ->> Citizen: "Welcome to Tax service. Begin?" 
activate DemoApp
Citizen -->> DemoApp: Clicks Begin

DemoApp ->>+Broker: Redirect: initiate Solid OIDC flow
Broker ->>+Auth: Redirect for authN
Auth ->> Citizen: "Sign in"
Citizen -->> Auth: Credentials
Auth -->>-Broker: Redirect
Broker -->>-DemoApp: Redirect w/ S-OIDC token

#Deref WebID Profile
DemoApp ->> DemoApp: Has Solid OIDC Token. Check for Pod
DemoApp ->>+WebID: Get Profile
WebID -->>-DemoApp: Profile

DemoApp ->>+IPV: Require <confidence-level> check..
IPV-->>DemoApp: Check Pod First

DemoApp->>DemoApp: Found Pod. Check for ID attributes

DemoApp->>+Pod: Get /private/ID_Attributes
Pod -->>-DemoApp:  ID_ Attributes
DemoApp ->> DemoApp: Check ID_Attributes to see if good for use
DemoApp->>Citizen: Would you like to use your previous ID check?
Citizen-->> DemoApp:OK

# Access grant
Note over DemoApp: Access Grant
DemoApp ->>+AGS: Issue access request for 'Tax Purpose'
AGS->>-DemoApp: Access Request

Note right of DemoApp: Now into 'account' dashboard
DemoApp ->> Citizen: "Grant access to Tax Office to ID check for 1 week"
Citizen -->> DemoApp: "Yes" 
DemoApp ->>+AGS: Issue Access Grant 
AGS -->>-DemoApp: Access Grant for 'purpose'
Note right of DemoApp: Back to Tax screen

#Note right of Account:We need further talk about access grants here. As the service isn't the thing thats doing the 'getting' Its all the orchestrator and its issuing its own grants. It might be better to do this with ACP...

DemoApp->>+Pod: Get data with access grant
Pod-->>-DemoApp: Previous ID Check
#Note right of Pod: Need to be careful with this step. We've already got the info! Are we over complicating?

DemoApp->>IPV: Previous ID Check
IPV-->>-DemoApp: OK! 

opt Receipt
DemoApp->>+Pod: Write Receipt / new verified check
Pod -->>-DemoApp: OK
end


DemoApp ->> Citizen: Done!
deactivate DemoApp

```


# Account Access 
```mermaid
sequenceDiagram
autonumber

    participant Citizen
    participant DemoApp
    participant Auth as Auth/Orchestrator
    participant Broker
    participant Pod
    participant WebID as WebID Service
    participant AGS as Access Grant Service

    Citizen ->>DemoApp: Clicks Login
    activate DemoApp
    DemoApp->>+Broker: Redirect
    Broker->>+Auth: Redirect
    Auth->>Citizen: 'Login'
    Citizen-->>Auth: Credentials 
    Auth-->>-Broker: Redirect - OK
    Broker-->>DemoApp: OK - Logged in
    
    DemoApp ->>+WebID: Get Profile
    WebID-->>-DemoApp: Profile

    DemoApp ->>+Pod: Get Data & User Prefs
    Pod-->>-DemoApp: Data & User Prefs
        
    DemoApp ->>+AGS: Query for acitve access grants
    AGS-->>-DemoApp: Active Access Grants 

    opt Citizen revokes Access Grant
    DemoApp ->>+AGS: Revoke a grant
    AGS->>-DemoApp: OK
    end
    deactivate DemoApp
```

# Basic Flow for Steering - Service 1 - DBS
```mermaid

sequenceDiagram
autonumber

    participant Citizen
    participant DemoApp
    participant Orchestrator as Orchestator Mock
    participant IPV as IPV Mock

    participant Auth as Auth/Orchestrator
    participant Pod

    Note right of Citizen: DBS Check. No Pod at start

        Citizen->>DemoApp: Start DBS Check 
        Citizen->>Auth:Login
        DemoApp->>Orchestrator: Start ID check
        Orchestrator->>Orchestrator: Checks for Pod. None found.
        Citizen->>DemoApp: Enter information
        Orchestrator->>IPV: Sends info
        IPV->>IPV: Checks info + Creates Credential bag
        IPV->>Orchestrator: Credential Bag
        Orchestrator->>Pod: Save Data
```

# Basic Flow for Steering: Service 2 - Tax
```mermaid

sequenceDiagram
autonumber

    participant Citizen
    participant DemoApp
    participant Orchestrator as Orchestator Mock
    participant IPV as IPV Mock

    participant Auth as Auth/Orchestrator
    participant Pod
    participant AGS as Access Grant Service

    Note right of Citizen: Tax return. Reuse 

        Citizen->>DemoApp: Start Tax return
        Citizen->>Auth: Login
        DemoApp->>Orchestrator: Get ID Check
        Orchestrator->>IPV: Get ID Check
        IPV->>Orchestrator: Check Pod
        Orchestrator->>Pod: Get previous ID check

        DemoApp->>AGS: Issues access request
        DemoApp->>Citizen: Can we use your previous ID check? (OK)
        DemoApp->>AGS: Issue access grant for <purpose> 
        Orchestrator->>Pod: Get Data
        Orchestrator->>IPV: Verify previous ID check
        IPV->> Orchestrator: OK!

        DemoApp->>Citizen: Done!        

```

# Basic Flow for Steering: Service 3 - Account
```mermaid

sequenceDiagram
autonumber

    participant Citizen
    participant DemoApp

    participant Auth as Auth/Orchestrator
    participant Pod
    participant AGS as Access Grant Service

    Note right of Citizen: Account Dashboard

        Citizen->>DemoApp: View Account
        Citizen->>Auth: Login
        DemoApp->>Pod: Get Data
        DemoApp->>Citizen: Display Data
        DemoApp->>AGS: Get Access Grants
        DemoApp->>Citizen: Display Access Grant

        Citizen->>DemoApp: Revoke Access Grant
        DemoApp->>AGS: Revoke Access Grant

        Citizen->>DemoApp: Logout

```
