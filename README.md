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
