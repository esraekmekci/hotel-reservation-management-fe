# Hotel Reservation Management System - Frontend

## Overview
This project is the frontend implementation of the Hotel Reservation Management System. It provides a user interface built with Angular and styled using Bootstrap to interact with the backend API.

## Getting Started
To get started with this project, follow these steps:

1. **Clone the Repository:** Clone this repository to your local machine using git clone 
`git clone https://github.com/esraekmekci/hotel-reservation-management-fe.git`.

2. **Install Dependencies:** Navigate to the project directory and install the necessary dependencies using `npm install`.

3. **Configuration:** Update the API endpoint in the environment configuration file (`src/app/environment.ts`) to point to your backend server.

4. **Build and Run:** Use Angular CLI commands such as `ng serve` to build and run the project locally.

5. **Explore:** Access the application in your web browser and explore the functionalities provided.

## Features
* **Reservation Management:** Allows admin to view, create, update, and cancel reservations.
* **Customer Management:** Provides functionalities for managing customer information.
* **Room Management:** Allows admin to browse available rooms and their features by filtering by date range, type and/or capacity.
* **Feature and Service Management:** Supports the addition and modification of features available in rooms and services offered by the hotel.

## Technologies Used
* Angular
* JavaScript/TypeScript
* Bootstrap
* HTML
* CSS

## Sample Images

* **You can filter rooms by date range, room type and/or room capacity.**

![rooms](src\assets\available_rooms.jpg)

* **You can create reservation with services and also control check in/check out status.**

![create_reservation](src\assets\create_reservation.jpg)

* **You can view reservations and also check their services with quantities.**

![reservations](src\assets\reservations.jpg)

* **You can view features and rooms with those features, also you can easily add, change or delete a feature.**

![edit_feature](src\assets\edit_feature.jpg)
