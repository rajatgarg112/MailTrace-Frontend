# MailTrace-AI Frontend

## Repository

`MailTrace-AI-Frontend`

## Branch

`main`

This repository contains the complete frontend for MailTrace-AI.

Both user-facing interfaces remain in the same frontend repository.

```text
MailTrace-AI-Frontend
└── main
    ├── Fono User Dashboard
    └── Security Dashboard
```

## Responsibilities

The frontend is responsible for:

- dashboard UI
- email list and detail views
- security findings presentation
- threat/risk visualization
- quarantine interface
- forensic case interface
- evidence/timeline visualization
- API integration
- loading/error states

The frontend is **not** responsible for:

- direct database access
- final threat classification
- ML inference
- security verdict generation
- forensic evidence generation

## Communication

```text
Frontend
   ↓
REST API
   ↓
Backend
   ↓
Database
```

The frontend should consume authoritative backend responses.

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
