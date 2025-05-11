# KaraokeJ

A web-based karaoke game that helps users improve their singing by providing real-time pitch feedback and scoring. The application uses YouTube videos for karaoke tracks and provides an interactive interface for users to practice and improve their singing skills.

## Features

- Real-time pitch detection and feedback
- YouTube video integration for karaoke tracks
- Interactive scoring system
- Modern React-based user interface
- TypeScript for type safety and better development experience

## Project Structure

```
src/
├── components/     # React components
├── game/          # Game logic and scoring system
├── hooks/         # Custom React hooks
├── lib/           # Library integrations and configurations
├── songs/         # Song data and lyrics
├── store/         # State management
└── utils/         # Utility functions and helpers
```

## Prerequisites

- Node.js (Latest LTS version recommended)
- Yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd karaokej
```

2. Install dependencies:
```bash
yarn install
```

## Available Commands

- `yarn dev` - Start the development server with hot-reload
- `yarn build` - Build the project for production
- `yarn lint` - Run ESLint to check code quality
- `yarn preview` - Preview the production build locally

## Development

The project is built with:
- React 19
- TypeScript
- Vite for fast development and building
- ESLint for code quality
- YouTube Player API for video integration
- Pitchy for pitch detection

## Building for Production

To create a production build:

```bash
yarn build
```

The build output will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
