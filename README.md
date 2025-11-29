# RoomBuddies 🏠

A modern roommate matching and chat application that helps you find your perfect roommate match based on compatibility and preferences.

## 🚀 Features

- **User Authentication** - Secure signup and login with email/password or Google
- **Profile Management** - Create and edit detailed user profiles
- **Matching Algorithm** - Smart matching based on compatibility scores
- **Real-time Chat** - Instant messaging with matched users
- **Responsive Design** - Works on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context API
- **Routing**: React Router
- **UI Components**: shadcn/ui

## 📦 Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Firebase project with Firestore, Authentication, and Storage enabled

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/roombuddies.git
   cd roombuddies
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in your browser**
   ```
   http://localhost:3000
   ```

## 🏗 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/      # React context providers
├── pages/         # Page components
├── services/      # API and service integrations
├── styles/        # Global styles
└── utils/         # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for the amazing backend services
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful components
- [Vite](https://vitejs.dev/) for the fast development experience



