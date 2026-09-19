# Frontend UI Contract

The frontend must render authoritative backend data.

## Threat Result

Example response shape:

```json
{
  "classification": "SUSPICIOUS",
  "risk_score": 78,
  "action": "QUARANTINE",
  "tags": [
    "LOOKALIKE_DOMAIN",
    "SUSPICIOUS_URL"
  ]
}
```

## Dashboard Responsibilities

### Fono User Dashboard

Show:

- email status
- warning
- reason summary
- quarantine status
- safe actions available to the user

### Security Dashboard

Show:

- classification
- risk score
- findings
- ML result
- security result
- evidence
- timeline
- approximate infrastructure context

The UI should clearly distinguish:

- verified evidence
- derived analysis
- approximate information
- model predictions

## Important

The frontend must not change:

- risk score
- classification
- security findings
- delivery action

It only presents backend results.
