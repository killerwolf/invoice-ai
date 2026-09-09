# Contributing to InvoiceAI

Thank you for your interest in contributing to InvoiceAI! This document provides instructions for developing, testing, and submitting contributions.

## Development Environment

### Requirements

- **Node.js**: `>= 20.0.0` (v22 recommended, see `.nvmrc`)
- **Package Manager**: `npm`

### Setup

```bash
git clone https://github.com/killerwolf/invoice-ai.git
cd invoice-ai
npm install
```

Configure your environment variables:
```bash
cp .env.example .env.local
# Add your MISTRAL_API_KEY
```

## Project Structure

```
invoice-ai/
├── src/
│   ├── app/
│   │   ├── api/transcribe/  # OCR & transcription endpoint
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Main application page
│   ├── components/          # UI components (Radix UI + Lucide + Tailwind)
│   └── lib/                 # Utilities and markdown JSON parser
├── public/                  # Demo assets, sample invoice, static files
├── scripts/                 # Demo recording and generation scripts
└── .github/workflows/       # GitHub Actions CI workflows
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start local Next.js development server (`http://localhost:3000`) |
| `npm run build` | Compile optimized production build |
| `npm run start` | Start production server |
| `npm run check` | Run Biome formatting, import sorting, and linting checks |
| `npm run check:write` | Auto-format and apply safe Biome fixes |
| `npm test` | Run Jest unit tests |

## Making a Change

1. Create a feature branch (`git checkout -b feat/my-feature`).
2. Implement your changes with corresponding tests in `src/lib/*.test.ts` where applicable.
3. Run verification checks locally:
   ```bash
   npm run check
   npm test
   npm run build
   ```
4. Update `CHANGELOG.md` under `## [Unreleased]` if changes are user-facing.
5. Open a Pull Request with a clear summary of your changes.

## Code of Conduct

Be kind, respectful, and collaborative. Report issues or security concerns via GitHub Issues.
