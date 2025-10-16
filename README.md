# 🌍 TripBuddy

**TripBuddy** is a smart travel assistant that helps users plan customized trips and discover potential travel companions.  
By leveraging modern web technologies and external APIs, the platform delivers dynamic itineraries, real-time travel information, and a streamlined user experience.

---

## ✨ Features

- Generate personalized trip itineraries based on user preferences  
- Search and join existing trips based on user preferences
- Discover places, attractions, and travel routes  
- Smooth and responsive UI designed for ease of use

---

## 🛠️ Technologies Used

- **Frontend:** React, TypeScript, axios 
- **Dev Tools:** ESLint, Prettier, Husky, GitHub Actions
- **Backend**: ExpressJS, Socket.IO ,Typescript


---

## 📦 Deployment Instructions (on VM)

This project is designed to be deployed on a **virtual machine (VM)**.

### Steps to Deploy:

1. **Enter the VM using SSH**

2. **Navigate to the project folder**

```bash
cd TripBuddy
```

3. **Run the deployment script as superuser**

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

For full API documentation, visit the Swagger UI:  
👉 [TripBuddy Swagger Documentation](https://trip-buddy.cs.colman.ac.il/api-docs/)

---


📜 License (Non-Commercial Use Only)

This repository and all associated code are the intellectual property of the TripBuddy development team.
Use of this project is permitted for educational and personal purposes only.

Commercial use, redistribution, or modification for profit is strictly prohibited.

Startups, organizations, or individuals may not use or deploy this project or any derivative without explicit written consent from the maintainers.

For collaboration or permission requests, please contact the project team directly.

---
