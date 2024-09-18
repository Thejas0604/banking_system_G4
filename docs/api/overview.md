# Banking System API Overview
## Introduction
Welcome to the API documentation for the banking system. This API provides a set of endpoints that allow you to interact with the banking system's core functionalities. Whether you need to create a new account, perform transactions, or retrieve account information, this API has got you covered. In this documentation, you will find detailed information about each endpoint, including request and response formats, authentication requirements, and example usage. Let's dive in and explore the powerful capabilities of the banking system API.
## Customer Endpoints
### Authentication Endpoints
- ``GET /``: Login page
- ``POST /dashboard``: Check credentials and redirect to the dashboard (Protected Route)
### Savings Account Endpoints
- ``GET /savings``: View savings dashboard (Protected Route)
#### Savings-Transfers
- ``GET /transer-savings``: Transfer money from savings account (Protected Route)
- ``POST /transer-do``: On a successful transfer
#### Fixed Deposits
- ``GET /fd``: Fixed Deposits dashboard (Protected Route)
- ``POST /request-loan-online``: On a successful loan request
- ``GET /loan``: Loans dashboard
### Current Account Endpoints
- ``GET /current``: Current Account dashboard (Protected Route)
#### Current-Transfers
- ``GET /transer-current``: Transfer money from current account (Protected Route)
- ``POST /transer-do``: On a successful transfer
## Employee Endpoints
### Authentication Endpoints
- ``GET /``: Login page
- ``POST /dashboard``: Check credentials and redirect to the dashboard (Protected Route)
### Customer Related Endpoints
- ``POST /searched-customer``: View serached customer (Protected Route)
- ``GET /create-customer``: Customer creation page(Protected Route)
- ``POST /create-customer``: Customer Created page(Protected Route)
## Manager Endpoints
### Authentication Endpoints
- ``GET /``: Login page
- ``POST /dashboard``: Check credentials and redirect to the dashboard (Protected Route)
### Customer Related Endpoints
- ``POST /searched-customer``: View serached customer (Protected Route)
- ``GET /create-customer``: Customer creation page(Protected Route)
- ``POST /create-customer``: Customer Created page(Protected Route)
### Loan Related Endpoints
- ``GET /late-loan-payments``: Get late loans info
- ``GET /loans-to-approve``: View to be approved(or declined) loan requests
- ``GET /approve-loan/:id``: Successfully approved the loan
### Branch Report Generation
- ``POST /generate-branch-report``: View the brach report of the selected branch from the dropdown
