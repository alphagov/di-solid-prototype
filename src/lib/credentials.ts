import { Credentials, IdentityCheckCredential } from "../components/vocabularies/identityCheckCredentialJWT";

export function credentials(): Credentials {
    return {
      iss: "https://identity.integration.account.gov.uk/",
      sub: "urn:fdc:gov.uk:2022:56P4CMsGh_02YOlWpd8PAOI-2sVlB2nsNU7mcLZYhYw=",
      vc: identityCheckVC(),
    }
  }
  
export function identityCheckVC(): IdentityCheckCredential {
    return {
      "type": [
        "VerifiableCredential",
        "VerifiableIdentityCredential"
      ],
      "credentialSubject": {
        "name": [
          {
            "validFrom": "2020-03-01",
            "nameParts": [
              {
                "value": "Alice",
                "type": "GivenName"
              },
              {
                "value": "Jane",
                "type": "GivenName"
              },
              {
                "value": "Laura",
                "type": "GivenName"
              },
              {
                "value": "Doe",
                "type": "FamilyName"
              }
            ]
          },
          {
            "validUntil": "2020-03-01",
            "nameParts": [
              {
                "value": "Alice",
                "type": "GivenName"
              },
              {
                "value": "Jane",
                "type": "GivenName"
              },
              {
                "value": "Laura",
                "type": "GivenName"
              },
              {
                "value": "O’Donnell",
                "type": "FamilyName"
              }
            ]
          }
        ],
        "birthDate": [
          {
            "value": "1970-01-01"
          }
        ]
      }
    }
  }