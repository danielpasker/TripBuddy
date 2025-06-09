# 🌍 TripBuddy

**TripBuddy** is a smart travel assistant that helps users plan customized trips and discover potential travel companions.  
By leveraging modern web technologies and external APIs, the platform delivers dynamic itineraries, real-time travel information, and a streamlined user experience.

---

## ✨ Features

- Generate personalized trip itineraries based on user preferences  
- Match with travel companions based on destination and interests  
- Discover places, attractions, and travel routes  
- Smooth and responsive UI designed for ease of use

---

## 🛠️ Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS  
- **API Communication:** Axios  
- **Utilities:** Day.js, Lodash  
- **Custom Hooks:** useTrip, useBackgroundImage, and more  
- **Dev Tools:** ESLint, Prettier, Husky, GitHub Actions

---

## 📦 Deployment Instructions (on VM)

This project is designed to be deployed on a **virtual machine (VM)**.

### 1. Download the Project

Download the repository from GitHub:  
🔗 https://github.com/danielpasker/TripBuddy  
Alternatively: Download as a ZIP and extract it.

### 2. Open Terminal in Project Directory

```bash
cd TripBuddy
```

### 3. Run Deployment Commands

```bash
sudo su
./deploy.sh
```

---

## 🧩 Husky Pre-commit Setup

Husky is used to automatically lint and test the code on each commit.

To activate Husky:

```bash
npm install
```

After activation:

- ESLint will validate code on every commit  
- Tests (if defined) will run automatically

> To disable, comment out the contents of `.husky/pre-commit`.

---

## 🧪 Testing

To run tests:

```bash
cd TripBuddy-server
npm run test
```

---

## 🔌 API Overview

API interaction is handled inside `client/src/api`.

| Method | Endpoint                      | Description                                 |
|--------|-------------------------------|---------------------------------------------|
| POST   | `/auth/login`                 | Authenticate user                           |
| POST   | `/trip/generate`              | Create new travel itinerary                 |
| GET    | `/match`                      | Find travel companion matches               |
| GET    | `/alerts/:location`           | Get live travel alerts by region            |
| POST   | `/feedback`                   | Submit user feedback                        |
| GET    | `/api/destinations`           | Search destinations (Google Places API)     |
| POST   | `/api/files`                  | Upload image files                          |
| GET    | `/image-search/:query`        | Get image results from Pexels               |
| POST   | `/join-requests`              | Send request to join a trip                 |
| GET    | `/join-requests/:tripId`      | Get requests for a specific trip            |
| POST   | `/join-requests/:id/approve`  | Approve a join request                      |
| POST   | `/join-requests/:id/decline`  | Decline a join request                      |
| POST   | `/posts`                      | Create new post                             |
| GET    | `/posts`                      | Get all posts                               |
| GET    | `/posts/:id`                  | Get post by ID                              |
| PUT    | `/posts/:id`                  | Update post by ID                           |
| DELETE | `/posts/:id`                  | Delete post by ID                           |
| POST   | `/posts/like/:postId`         | Like/unlike a post                          |
| POST   | `/trip-plan`                  | Create trip plan                            |
| POST   | `/trip-plan/:tripId/activity` | Add activity to a day in the trip plan      |
| POST   | `/trip`                       | Save a new trip                             |
| GET    | `/trips/match`                | Get filtered and ranked trips               |
| GET    | `/trips/:id`                  | Get trip details by ID                      |
| GET    | `/trips/:tripId/plan`         | Get plan for a specific trip                |
| PATCH  | `/trips/:tripId/open-to-join` | Set whether a trip is open to new joiners   |
| GET    | `/users/:id`                  | Get user details by ID                      |
| GET    | `/users/:userId/trips`        | Get all trips created by a user             |
| PUT    | `/users/profile-picture`      | Update user’s profile image                 |
| PUT    | `/users/description`          | Update user’s profile description           |
| PUT    | `/users/details`              | Update user preferences (age, diet, etc.)   |

---

## 👥 Team

- **Shiran Shmuel**  
- **Daniel Pasker**  
- **Roni Lem**  
- **Lior Oliel**  
- **Gaya Vishne**