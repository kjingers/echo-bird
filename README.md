# Echo Bird - Text-to-Speech Web App

A modern, polished text-to-speech web application powered by Azure Cognitive Services Speech SDK.

**Live App**: [https://yellow-meadow-01d67dd10.4.azurestaticapps.net](https://yellow-meadow-01d67dd10.4.azurestaticapps.net)

## Features

- **100+ Neural Voices** - Access to Azure's full library of neural TTS voices
- **Voice Type Filter** - Filter by Neural (Expressive), Neural, Neural HD, or Multilingual voices
- **Multi-language Support** - Voices in dozens of languages and locales
- **Voice Styles** - Adjust speaking styles (cheerful, sad, angry, etc.) for expressive voices
- **Real-time Synthesis** - Text-to-speech conversion happens in your browser
- **Audio Player** - Built-in player with waveform visualization, progress bar, and volume control
- **Download MP3** - Save synthesized audio as MP3 files
- **Modern UI** - Glass morphism design with smooth animations

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  React App (Vite + TypeScript)                          ││
│  │  ┌─────────┐  ┌──────────────┐  ┌────────────────┐     ││
│  │  │ TTSForm │→ │ useSynthesis │→ │ speechService  │     ││
│  │  └─────────┘  └──────────────┘  └───────┬────────┘     ││
│  │                                         │               ││
│  │  ┌─────────────┐  ┌─────────────┐      │               ││
│  │  │ AudioPlayer │  │ useVoices   │      │               ││
│  │  └─────────────┘  └──────┬──────┘      │               ││
│  └──────────────────────────┼─────────────┼───────────────┘│
└─────────────────────────────┼─────────────┼─────────────────┘
                              │             │
                              ▼             ▼
                    ┌─────────────────────────────────┐
                    │   Azure Speech SDK (Browser)    │
                    │   microsoft-cognitiveservices   │
                    │   -speech-sdk                   │
                    └───────────────┬─────────────────┘
                                    │ WebSocket
                                    ▼
                    ┌─────────────────────────────────┐
                    │   Azure Cognitive Services      │
                    │   Speech Service (eastus)       │
                    └─────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 7 |
| **Styling** | Tailwind CSS 3 + custom glass morphism |
| **Animation** | Framer Motion |
| **State** | TanStack Query (React Query) |
| **TTS** | Azure Cognitive Services Speech SDK |
| **Testing** | Vitest + Testing Library |
| **CI/CD** | GitHub Actions |
| **Hosting** | Azure Static Web Apps |

## Local Development

### Prerequisites

- Node.js 20+
- Azure Speech Service subscription (or use the deployed app)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/kjingers/echo-bird.git
cd echo-bird
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your Azure credentials:
```bash
cp .env.example .env
# Edit .env with your Azure Speech key and region
```

4. Start development server:
```bash
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_AZURE_SPEECH_KEY` | Azure Speech Service subscription key |
| `VITE_AZURE_SPEECH_REGION` | Azure region (e.g., `eastus`) |

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

## Project Structure

```
src/
├── components/       # React components
│   ├── AudioPlayer.tsx
│   ├── Button.tsx
│   ├── ErrorDisplay.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   ├── Select.tsx
│   ├── TextArea.tsx
│   └── TTSForm.tsx
├── hooks/            # Custom React hooks
│   ├── useSpeechSynthesis.ts
│   └── useVoices.ts
├── services/         # API services
│   └── speechService.ts
├── types/            # TypeScript types
│   └── speech.ts
├── utils/            # Utility functions
│   └── helpers.ts
└── test/             # Test setup
    └── setup.ts
```

## Azure Resources

| Resource | Name | Region |
|----------|------|--------|
| Resource Group | `echo-bird-rg` | East US |
| Speech Service | `echo-bird-speech` | East US |
| Static Web App | `echo-bird-app` | Central US |

## License

MIT
