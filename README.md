# Gymprentice 💪🤖

Gymprentice is an AI-powered mobile fitness application designed to help users manage workouts, nutrition, gym discovery, and personal fitness goals in one centralized platform.

Originally created during undergraduate studies, Gymprentice was redesigned and expanded as a graduate-level full-stack software engineering project using modern cloud technologies and artificial intelligence.

---

## 📌 Overview

Many fitness applications focus on only one area such as workouts, nutrition, or tracking, while locking useful features behind subscriptions. Gymprentice was developed to provide a free, user-friendly, and intelligent all-in-one fitness solution.

The application combines workout planning, meal guidance, scheduling, progress tools, community interaction, and personalized AI recommendations into one mobile platform.

---

## ✨ Features

### 🔐 Authentication & Account Management

- Secure user registration and login
- Email verification
- Password reset functionality
- Persistent user sessions
- Profile editing
- Profile image upload
- Secure account deletion with re-authentication

---

### 🏋️ Workout Management

- Browse workout categories
- View exercise details
- Save favorite workouts
- Remove saved workouts
- Track completed workouts
- Personalized workout recommendations

---

### 🥗 Nutrition Tracking

- Search foods and meals
- View calories, protein, carbs, and fats
- Log meals
- Browse meal categories
- Personalized nutrition suggestions

---

### 🤖 AI-Powered Personalization

Powered by the OpenAI API:

- Customized workout routines
- Personalized meal recommendations
- Daily fitness tips
- Adaptive responses based on goals and preferences

---

### 📍 Gym Finder

Powered by Google Maps API:

- Search gyms by ZIP code
- Interactive map markers
- Nearby gym listings
- Save favorite gyms

---

### 📅 Scheduling & Planning

- Weekly planner
- Calendar system
- Add and manage events
- Organize workouts and meals

---

### 🌐 Community Features

- User posts
- Likes
- Ratings
- Reviews
- Shared fitness engagement

---

### 🌙 UI / UX Enhancements

- Clean dashboard layout
- Persistent navigation footer
- Expandable cards
- Modal views
- Dark mode support
- Responsive mobile design

---

## 🛠 Tech Stack

### Frontend

- React Native
- TypeScript

### Backend / Cloud

- Firebase Authentication
- Firestore Database
- Firebase Storage

### APIs & External Services

- OpenAI API
- Google Maps API (Places + Geocoding)
- API Ninjas Exercise API
- API Ninjas Nutrition API

## Development Tools

- Android Studio
- Visual Studio Code
- GitHub
- Trello

---

## 🏗 System Architecture

Gymprentice follows a client-cloud architecture:

```text
React Native Mobile App
        ↓
Firebase Authentication
Firestore Database
Firebase Storage
        ↓
External APIs:
- OpenAI API
- Google Maps API
- API Ninjas APIs
```

## Benefits
- Scalable structure
- Modular design
- Real-time synchronization
- Maintainable architecture
- Easy future expansion

## Database Design
- Firestore is organized around authenticated users using Firebase UID values.
- Main Collections:
  - Users
  - Workouts
  - Nutrition Logs
  - Schedules
  - Saved Workouts
  - Favorite Gyms
  - Challenges
  - Community Posts

## Installation & Setup

### Prerequisites
- Install the following:
  - Node.js
  - Android Studio
  - Visual Studio Code
  - Firebase 

### Clone Repository
```text
git clone https://github.com/kinseyvo/Gymprentice-v2.git
cd Gymprentice
```

### Install Dependencies
```text
npm install
```

### Configure Environment
- Add required configuration files and API keys:
  - google-services.json
  - Firebase configuration
  - OpenAI API key
  - Google Maps API key
  - API Ninjas API key

### Run Application
```text
npx react-native start
npx react-native run-android
```

## How It Works
1. User registers or logs in
2. Firebase authenticates the account
3. User enters main dashboard
4. Features become available:
  - Workouts
  - Nutrition
  - AI suggestions
  - Scheduling
  - Gym finder
  - Community 
5. User data is stored in Firestore in real time

## 🔮 Future Improvements
- Real-time analytics charts
- Advanced AI coaching
- Better long-term personalization
- Leaderboards
- Group challenges
- Direct messaging
- iOS support
- Performance optimization

## 📄 License
This project is intended for educational, portfolio, and demonstration purposes.
