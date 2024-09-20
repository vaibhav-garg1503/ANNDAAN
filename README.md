# XcessFood: Food Donation System

## Overview
The Food Donation System is a web-based platform designed to facilitate the collection and distribution of surplus food from hostels in Kasargod to orphanages, food banks, old age homes, and other needy organizations. By connecting donors with recipients, the system aims to minimize food waste and help fight hunger in the community.

## Features
- **Donor Registration:** Hostels in Kasargod can register as donors to offer surplus food.
- **Recipient Registration:** Agencies like food banks and orphanages can register to receive donations.
- **Admin Verification:** Admins verify new registrations to ensure the authenticity of donors and recipients.
- **Donation Management:** Donors can log food donations, which are then visible to verified recipients.
- **Homepage Slideshow:** The homepage includes a slideshow with information about the food donation system.
- **Authentication:** User login and session management using `localStorage`.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript, Axios
- **Backend:** Node.js, Express.js
- **Database:** MSSQL

## Setup and Installation
1. **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/food-donation-system.git
    ```
2. **Navigate to the Project Directory**
    ```bash
    cd food-donation-system
    ```
3. **Install Dependencies**
    ```bash
    npm install
    ```
4. **Configure the Database**
   - Create a database in MSSQL.
   - Update the database configuration in the `config` folder (e.g., `config.js`).
5. **Run the Backend Server**
    ```bash
    npm start
    ```
6. **Open the Frontend**
   - Open `index.html` in your browser to access the application.

## Usage
- **Donors:** Register, log in, and donate surplus food using the 'Donate' button.
- **Recipients:** Register, log in, and view available donations.
- **Admins:** Verify new users and manage donations.

## Project Structure
```
food-donation-system/
│
├── backend/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── assets/
│   ├── home/
│   │   ├── home.js
│   │   ├── home.css
│   │   └── home.html
│   │
│   ├── pages/
│   │   ├── about-page/
│   │   ├── donors-page/
│   │   ├── join-page/
│   │   └── recipient-page/
│   │
│   ├── partials/
│
└── README.md
```

## Contributing
Contributions are welcome! Please open an issue to discuss your ideas or submit a pull request.

