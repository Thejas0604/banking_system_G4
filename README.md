# Functional Banking System

## Description
This project is a comprehensive implementation of a functional bank system, developed as part of a Database Systems course. The system is designed to manage various banking operations efficiently, focusing on robust database architecture and effective data management.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Endpoints](#api-endpoints)
4. [Technologies Used](#technologies-used)
5. [Features](#features)
6. [Screenshots](#screenshots)
7. [Database Schema](#database-schema)

## Installation
1. Clone into your local file system. Make sure to have git install beforehand.

```
git clone https://github.com/Thejas0604/banking_system_G4.git
```
2. Open B_App directory with you terminal. Install node modules with below command. Make sure to install node beforehand.
```
npm i
```
3. Install mysql workbench(or a suitable client) into your PC. Create a database with the database dump in the directory `/Sql_Datbase/database.sql`.
4. Create a .env file on the directory /B_App and fill it like below with your database info.
```
DB_HOST= (your host name)
DB_USER= (your username)
DB_PASS= (your password)
DB_NAME= (database name)
```
 5. Start the server using below command.
```
nodemon app.js
```


## Usage
1. Start the server as described in the installation steps.
2. Access the application via `http://localhost:3000` in your web browser.
3. Use the provided endpoints to manage customers, accounts, and loans.

## API Endpoints

## Technologies Used
- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for Node.js.
- **MySQL**: Relational database management system.
- **EJS**: Templating engine for rendering views.
- **bcrypt**: Library for hashing passwords.
- **jsonwebtoken**: Library for generating and verifying JWT tokens.
- **dotenv**: Module for loading environment variables.
- **body-parser**: Middleware for parsing request bodies.
- **cookie-parser**: Middleware for parsing cookies.

## Features
- **User Authentication and Authorization**: Secure login, registration, and role-based access control.
- **Customer Management**: Create, retrieve, and manage customer records.
- **Account Management**: Full CRUD operations for current, savings, and FD accounts.
- **Loan Management**: Request, approve, and manage loan details.
- **Branch Management**: Generate and retrieve branch reports.
- **Environment Configuration**: Securely manage environment variables with dotenv.
- **Middleware and Templating**: Use Express, body-parser, EJS, and cookie-parser for routing and views.


## Screenshots
![image](https://github.com/Thejas0604/banking_system_G4/assets/109301978/ffc5c5be-8ec4-4dba-a0ce-35a0ac25bdee)
![image](https://github.com/Thejas0604/banking_system_G4/assets/109301978/d438004e-1296-4509-837f-050412a80acb)



## Database Schema

![image](https://github.com/Thejas0604/banking_system_G4/assets/109301978/dcd89c23-7708-4676-bafa-baaec30e28e8)

