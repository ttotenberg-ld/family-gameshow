# DeutNeuerToteMeyerBorg Game Show Extravaganza!

A real-time multiplayer gameshow application with team management, buzzer system, score tracking, and round management.

## Features

- Team Management
  - Create and join teams with custom names
  - Customizable team images
  - Team member management
  - Team-specific color themes
  - Edit team names on the fly

- Game Control
  - Real-time buzzer system with timestamp-based fairness
  - First buzzer indicator with visual feedback
  - Score tracking with increment/decrement controls
  - Round management with number and description
  - Reset buzzers functionality
  - New game option to reset scores and teams

- User Interface
  - QR code for easy team joining
  - Mobile-friendly interface
  - Customizable game logo
  - Real-time updates across all devices
  - Visual feedback for buzzer states
  - Team member buzz status indicators

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/family-gameshow.git
cd family-gameshow
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Realtime Database
   - Set up database rules for read/write access
   - Get your Firebase configuration

4. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in your Firebase configuration values in `.env`:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_DATABASE_URL=your_database_url
     ```

5. Start the development server:
```bash
npm run dev
```

## Firebase Database Rules

Add these rules to your Firebase Realtime Database:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

- `/src` - Source code
  - `/components` - React components
    - `Logo.tsx` - Game logo component
    - `TeamCard.tsx` - Team display and control component
  - `/context` - React context providers
    - `TeamsContext.tsx` - Team and game state management
  - `/pages` - Page components
    - `GameBoard.tsx` - Main game control interface
    - `TeamPage.tsx` - Team member view with buzzer
    - `TeamSelection.tsx` - Team join/creation page
  - `App.tsx` - Main application component
  - `firebase.ts` - Firebase configuration
  - `types.ts` - TypeScript type definitions

## License

MIT
