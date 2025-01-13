# Thermocooler System API

This document provides details about the API endpoints for managing the thermocooler system, designed for both the admin dashboard and the mobile app.

---

## Base URLs

- **Authentication & General Endpoints**: `/api`
- **WebSocket for Real-Time Updates**: `/ws`

---

## Authentication

Endpoints shared between the admin dashboard and mobile app.

**Base URL**: `/api/auth`

| Method | Endpoint           | Description                                 |
| ------ | ------------------ | ------------------------------------------- |
| POST   | `/signup`          | Create a new user account.                  |
| POST   | `/login`           | Authenticate user and return a token.       |
| POST   | `/logout`          | Log the user out of the system.             |
| POST   | `/forgot-password` | Send email with a recovery code.            |
| POST   | `/reset-password`  | Reset the password using the recovery code. |

---

## Thermocooler Controls

Endpoints for managing the thermocooler system.

**Base URL**: `/api/thermocooler`

| Method | Endpoint                | Description                                 | Access      |
| ------ | ----------------------- | ------------------------------------------- | ----------- |
| GET    | `/status`               | Get the current state of the thermocooler.  | Admin, User |
| POST   | `/set-temperature`      | Set target temperature.                     | Admin, User |
| POST   | `/set-fan-speed`        | Set the fan speed (voltage/current).        | Admin, User |
| POST   | `/set-water-pump-power` | Set power to the water pump.                | Admin, User |
| GET    | `/temperature-data`     | Get temperature readings at various points. | Admin, User |
| GET    | `/energy-usage`         | Get energy consumption data.                | Admin, User |
| POST   | `/power-toggle`         | Turn the system on/off.                     | Admin, User |

---

## Admin-Specific Endpoints

Exclusive endpoints for the admin dashboard.

**Base URL**: `/api/admin`

| Method | Endpoint           | Description                             |
| ------ | ------------------ | --------------------------------------- |
| GET    | `/users`           | Fetch a list of all users.              |
| POST   | `/users`           | Create a new user (manual).             |
| PUT    | `/users/:userId`   | Update user information.                |
| DELETE | `/users/:userId`   | Remove a user from the system.          |
| GET    | `/troubleshooting` | Fetch temperature troubleshooting data. |
| GET    | `/system-logs`     | Get logs for system activity.           |

---

## User Profile

Endpoints for users to manage their profile.

**Base URL**: `/api/profile`

| Method | Endpoint | Description                      | Access      |
| ------ | -------- | -------------------------------- | ----------- |
| GET    | `/`      | Fetch the user profile data.     | Admin, User |
| PUT    | `/`      | Update user profile information. | Admin, User |

---

## Mobile-Specific Endpoints

Endpoints optimized for the mobile app.

**Base URL**: `/api/mobile`

| Method | Endpoint           | Description                               |
| ------ | ------------------ | ----------------------------------------- |
| GET    | `/connected-rooms` | Fetch a list of connected rooms.          |
| GET    | `/home-data`       | Fetch thermocooler and energy usage data. |

---

## WebSocket for Real-Time Updates

Provides real-time updates on system data such as temperature, fan speed, and energy usage.

**Base URL**: `/ws`

| Event Name          | Description                                  |
| ------------------- | -------------------------------------------- |
| `temperatureUpdate` | Pushes updates for temperature readings.     |
| `energyUsageUpdate` | Sends energy usage data in real time.        |
| `statusUpdate`      | Sends updates about system status or errors. |

---

<!-- ## Folder Structure Example

Organize the API code as follows:

<!-- ```
backend/
├── controllers/
│   ├── authController.js
│   ├── thermocoolerController.js
│   ├── adminController.js
│   └── profileController.js
├── routes/
│   ├── authRoutes.js
│   ├── thermocoolerRoutes.js
│   ├── adminRoutes.js
│   ├── profileRoutes.js
│   └── mobileRoutes.js
├── models/
│   ├── User.js
│   ├── Thermocooler.js
│   └── EnergyUsage.js
└── server.js
``` --> -->
