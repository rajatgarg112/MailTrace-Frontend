# MailTrace-AI Frontend

## Repository

`MailTrace-AI-Frontend`

## Branch

`main`

This repository contains the complete React + Vite frontend.

Both user-facing interfaces remain in the same frontend repository:

```text
MailTrace-AI-Frontend
└── main
    ├── Fono User Dashboard
    └── Security Dashboard
```

## Responsibilities

The frontend is responsible for:

- inbox
- spam categories
- warning/hold views
- quarantine interface
- email detail views
- security findings presentation
- security tags
- risk visualization
- delivery status
- evidence/timeline visualization
- approximate infrastructure map/context
- forensic case interface
- API integration
- loading/error states

## Frontend Must Not Decide Security

The frontend is not responsible for:

- direct database access
- final threat classification
- ML inference
- security verdict generation
- risk calculation
- delivery policy
- forensic evidence generation

The backend is authoritative.

## Harmful Email UI

### Safe

Normal email view.

### Spam

User may view according to policy.

### Suspicious

Show warning before controlled access.

### Malicious / High Risk

Do not render the original body/attachment by default.

Show:

- threat category
- risk score
- confidence
- security tags
- authentication findings
- URL findings
- attachment findings
- evidence
- forensic summary
- delivery/quarantine action

## Communication

```text
React + Vite
     ↓
REST API
     ↓
FastAPI Backend
     ↓
Database / Analysis Services
```

For local development, frontend and backend may run on separate ports. CORS/API configuration must be handled by the backend integration setup.

## Suggested Structure

```text
MailTrace-AI-Frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   └── assets/
├── public/
├── package.json
└── README.md
```
