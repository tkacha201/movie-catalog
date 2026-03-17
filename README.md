# React Native – Exam Project: Movie Catalog App

## APK Download

> **[Download APK](https://expo.dev/artifacts/eas/t5QhVaSpCRpa6EGBSZhG8H.apk)**

---

## Functional Guide

### 1. Project Overview

**Application Name:** Movie Catalog App

**Application Category / Topic:** Movies

**Main Purpose:**
A mobile application for browsing, reviewing, and organizing movies. Users can discover popular and upcoming films from TMDB, write and edit reviews with ratings and photos, and organize movies into personal Watched and Wishlist collections. Each user has their own isolated data, and community reviews from other users are visible on each movie's detail page.

---

### 2. User Access & Permissions

**Guest (Not Authenticated)**
- Can see the Login and Register screens only.
- No access to movie browsing, details, or any app functionality.

**Authenticated User**
- **Main sections / tabs:** Browse, My Movies, Upcoming, Profile
- **Details screens:** Movie Details (full info, status buttons, reviews, community reviews)
- **Create / Edit / Delete actions:**
  - Create: Write a review (rating, text, photo, recommend toggle)
  - Edit: Modify an existing review
  - Delete: Remove a review, remove a movie from lists, clear a review from the Reviews tab
  - Status management: Add/remove movies to Watched or Wishlist

---

### 3. Authentication & Session Handling

**Authentication Flow**
1. On app start, `restoreSession()` checks Expo SecureStore for a stored user object under the key `auth_user`.
2. If a valid user JSON is found, the user is automatically logged in and their saved movies are loaded from AsyncStorage (`movie-store-{userId}`).
3. If no session is found, the Login screen is shown.
4. On successful login or registration, the user object is saved to SecureStore, the movie store loads user-specific data, and the app navigates to the Browse screen.
5. On logout, a confirmation dialog is shown. If confirmed, the SecureStore session is cleared, the movie store is reset, and the app returns to the Login screen.

**Session Persistence**
- User session is stored in Expo SecureStore (key: `auth_user`) as a JSON object.
- On app restart, `restoreSession()` is called automatically, parsing the stored user and restoring the logged-in state without requiring re-authentication.

---

### 4. Navigation Structure

**Root Navigation Logic**
- `RootNavigator` conditionally renders either the `AuthStack` (Login → Register) or the `Main` tabs + modal screens based on `isLoggedIn` state from the auth store.

**Main Navigation**
- Bottom Tab Navigator with 4 tabs:
  1. **Browse** — Discover popular movies with search
  2. **My Movies** — Tabbed view of Watched / Wishlist / Reviews
  3. **Upcoming** — Future movie releases with countdowns
  4. **Profile** — User info, stats dashboard, logout

**Nested Navigation**
- Auth Stack: Login ↔ Register (native-stack inside root)
- Root Stack modals: MovieDetails, AddReview (presented on top of tabs)

---

### 5. List → Details Flow

**List / Overview Screen**
- The Browse screen displays movies in a 2-column grid with poster, title, and year.
- Users can search with a debounced text input (2-second delay, minimum 2 characters).
- The Upcoming screen shows a vertical list with poster, title, release date, and countdown pill.
- My Movies shows saved movies in a 2-column grid per tab.

**Details Screen**
- Tapping any movie card navigates to `MovieDetails` with route parameter `{ movieId: number }`.
- The screen fetches full details via React Query (`useMovieDetails` hook) and displays: poster/backdrop, title, year, runtime, genres, TMDB rating, synopsis, status buttons, user review, and community reviews.
- For upcoming movies (release date in the future), only the Wishlist button is shown; Watched and Write Review are hidden.

---

### 6. Data Source & Backend

**Backend Type:** Real backend — [TMDB (The Movie Database) API v3](https://www.themoviedb.org/)

- Browse: `GET /discover/movie` (sorted by popularity)
- Search: `GET /search/movie` (query-based)
- Details: `GET /movie/{id}` (full metadata with genres, runtime)
- Upcoming: `GET /discover/movie` (filtered by `primary_release_date.gte` = today)

**Mock Data Fallback:** When no API token is configured, the app falls back to 196 pre-fetched real TMDB movies stored locally, making it fully functional without network access.

---

### 7. Data Operations (CRUD)

**Read (GET)**
- Browse screen fetches and displays popular movies via TMDB discover endpoint.
- Movie Details screen fetches full movie metadata (genres, runtime, synopsis).
- Upcoming screen fetches movies with future primary release dates.
- My Movies reads from the local Zustand store (persisted in AsyncStorage per user).
- Community Reviews reads other users' reviews from their AsyncStorage entries.

**Create (POST)**
- Users create reviews via the AddReview screen: rating slider (1–10), text review, optional photo attachment, and recommend toggle.
- Adding a movie to Watched or Wishlist creates a new entry in the movie store.

**Update (PUT)**
- Users can edit existing reviews (pre-filled form with previous values).
- Users can change a movie's status (Watched ↔ Wishlist) with confirmation if a review would be deleted.

**Delete (DELETE)**
- Users can delete a review from the Movie Details screen (confirmation dialog, removes movie from lists).
- Users can remove movies from Watched/Wishlist tabs (confirmation dialog).
- Users can clear a review from the Reviews tab without removing the movie from its list.

**UI Updates:** All mutations immediately update the Zustand store, which triggers re-renders. Data is persisted to AsyncStorage synchronously after each change.

---

### 8. Forms & Validation

**Forms Used**
1. Login Form (LoginScreen)
2. Registration Form (RegisterScreen)
3. Review Form (AddReviewScreen)

**Validation Rules**

| Field | Screen | Rules |
|-------|--------|-------|
| Email | Login, Register | Required; must match email pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| Password | Login | Required |
| Password | Register | Required; minimum 8 characters |
| Confirm Password | Register | Required; must match password field |
| Username | Register | Required |
| Review text | AddReview | Required; minimum 10 characters |

All validation is handled by React Hook Form with inline error messages displayed below each field.

---

### 9. Native Device Features

**Used Native Feature(s):** Camera / Image Picker (via `expo-image-picker`)

**Usage Description**
- Used on the AddReview screen to attach a photo to a movie review.
- Users can choose between Camera (launches device camera) or Photo Library (opens gallery picker).
- Both options request the appropriate permission first. If denied, an alert explains the required permission.
- Selected images are cropped to 16:9 aspect ratio at 0.8 quality and stored locally as a URI.
- Error handling wraps both picker functions in try-catch to prevent crashes.

---

### 10. Typical User Flow

1. User opens the app → Login screen is shown → logs in with `alice@demo.com` / `password`.
2. User lands on the Browse tab → scrolls through popular movies → searches for "batman".
3. User taps a movie → sees full details (poster, synopsis, genres, rating) → taps "Watched" button.
4. User taps "Write Review" → rates the movie 8/10 → writes a review → attaches a photo → saves.
5. User goes to My Movies → sees the movie in the Watched tab and the Reviews tab.
6. User checks Profile → sees stats (1 Watched, 1 Review, Avg Rating: 8.0).
7. User goes to Upcoming tab → browses future releases → adds one to Wishlist.
8. User logs out → logs in as Bob → opens the same movie → sees Alice's review in Community Reviews.

---

### 11. Error & Edge Case Handling

**Authentication errors:**
- Wrong password or unregistered email shows an inline error message on the Login screen.
- Duplicate email on registration shows an error.
- Password mismatch and minimum length enforced with validation messages.

**Network or data errors:**
- All API screens (Browse, Upcoming, Movie Details) show an `ErrorScreen` component with error message and a "Retry" button.
- React Query retries failed requests once automatically before showing the error state.
- If no API token is configured, the app silently falls back to mock data.

**Empty or missing data states:**
- Each tab in My Movies shows a custom empty state with icon, message, and "Browse Movies" action button.
- Movie posters that fail to load show a placeholder icon.
- Profile stats show "—" for average rating when no movies are rated.
- Global `ErrorBoundary` catches any unhandled crashes and shows a fallback UI with a restart button.

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- iOS Simulator (macOS) or Android Emulator, or Expo Go on a physical device

### Installation

```bash
git clone <repository-url>
cd movie-catalog-app
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env` and add a TMDB API token (optional — the app works without it using mock data):

```
EXPO_PUBLIC_TMDB_API_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OWU4NDZiNGNhMjRiOWFjYzBhMGUxZjZmNmZjZmZhNSIsIm5iZiI6MTc3MzUyODA4OC4zMTYsInN1YiI6IjY5YjVlNDE4YjhiMDIzMTJjMjczMWZhMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ixFZOcEAwOf--qhVFotOLvlqQYoGT77r1_wzDQ11Un8
```

You can use the token above, or get your own free at [themoviedb.org](https://www.themoviedb.org/) → Settings → API → **API Read Access Token**.

### Running the App

```bash
npx expo start
```

Then press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with Expo Go.

## Demo Accounts

| Username | Email             | Password   |
| -------- | ----------------- | ---------- |
| Alice    | alice@demo.com    | password   |
| Bob      | bob@demo.com      | password   |
| Charlie  | charlie@demo.com  | password   |

You can also register new accounts through the app.

## Tech Stack

| Layer              | Technology                                      |
| ------------------ | ----------------------------------------------- |
| Framework          | React Native 0.81 + Expo SDK 54                 |
| Language           | TypeScript 5.9 (strict mode)                    |
| Navigation         | React Navigation 7 (native-stack + bottom-tabs) |
| State Management   | Zustand 5 with AsyncStorage persistence          |
| Data Fetching      | TanStack React Query 5                           |
| Forms              | React Hook Form 7                                |
| Styling            | NativeWind 4 (Tailwind CSS)                      |
| Auth Storage       | Expo SecureStore                                 |
| Image Picker       | Expo Image Picker                                |
| API                | TMDB (The Movie Database) v3                     |
