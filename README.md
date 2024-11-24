# Family Gameshow

A real-time multiplayer gameshow application with team management, buzzer system, and score tracking.

## Features

- Team management with customizable team images
- Real-time buzzer system with fair timing
- Score tracking
- QR code for easy team joining
- Mobile-friendly interface

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
   - Fill in your Firebase configuration values in `.env`

5. Start the development server:
```bash
npm run dev
```

## Deployment to GitHub Pages

1. Update `vite.config.ts`:
   - Set the `base` to your repository name:
     ```ts
     base: '/your-repo-name/'
     ```

2. Configure GitHub repository:
   - Go to repository Settings
   - Navigate to Pages section
   - Set source to GitHub Actions

3. Deploy:
```bash
npm run deploy
```

## Firebase Database Rules

Add these rules to your Firebase Realtime Database:

```json
{
  "rules": {
    "teams": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/context` - React context providers
  - `/pages` - Page components
  - `App.tsx` - Main application component
  - `firebase.ts` - Firebase configuration

## License

MIT
