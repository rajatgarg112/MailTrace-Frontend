# Frontend UI Contract

The frontend renders authoritative backend results.

## Threat Result

Example:

```json
{
  "classification": "PHISHING",
  "risk_score": 91,
  "threat_confidence": 0.94,
  "action": "QUARANTINE",
  "tags": [
    "NEW_DOMAIN",
    "DMARC_FAIL",
    "CREDENTIAL_REQUEST",
    "SUSPICIOUS_URL"
  ]
}
```

## Security Tags

Tags are short, security-focused explanations.

Example display:

```text
First-Time-Sender • New-Domain • DMARC-Fail • Credential-Request • Suspicious-URL • Phishing
```

Tags are not the same as:

- raw features
- risk score
- threat classification
- delivery action

## User Dashboard

Show:

- inbox
- spam categories
- warnings
- quarantine
- delivery status
- safe email view
- security explanation
- policy-controlled user actions

## Security Dashboard

Show:

- classification
- risk score
- confidence
- security tags
- security findings
- ML result
- authentication result
- URL/domain findings
- attachment/QR findings
- behavioral/context findings
- threat-intelligence results
- evidence
- timeline
- approximate infrastructure context
- forensic case details

## Malicious Email Protection

For malicious/high-risk quarantined email:

```text
Original content: BLOCKED
Original attachment: BLOCKED
Suspicious links: NOT AUTO-OPENED
```

Show a sanitized security report instead.

## Data Provenance

Clearly distinguish:

- verified evidence
- derived analysis
- approximate information
- model predictions

## Backend Authority

The frontend must not change:

- security features
- risk score
- confidence
- classification
- findings
- security tags
- delivery action

It only presents backend results.
