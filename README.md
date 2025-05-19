# Banking Credit Management System

A comprehensive web application for managing bank credits, built with Spring Boot and Angular. The system supports different types of credits, client management, and role-based security.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Three user roles: CLIENT, EMPLOYEE, and ADMIN
  - Role-specific access control

- **Client Management**
  - Create and manage client profiles
  - View client details and associated credits

- **Credit Management**
  - Support for three credit types:
    - Personal Credit (with reason field)
    - Real Estate Credit (with property type field)
    - Professional Credit (with reason and company name fields)
  - Credit approval workflow (In Progress, Accepted, Rejected)
  - Credit details tracking (amount, duration, interest rate)

- **Repayment Management**
  - Track monthly repayments
  - Support for early repayments
  - Calculate remaining amounts

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- MySQL Database
- Maven

### Frontend
- Angular 15+
- Angular Material
- TypeScript
- RxJS

## Security Implementation

The application implements a robust security system:

- **Authentication**: JWT-based token authentication
- **Authorization**: Role-based access control
- **User Roles**:
  - `ROLE_CLIENT`: Can view own profile and credits
  - `ROLE_EMPLOYEE`: Can manage clients and credits
  - `ROLE_ADMIN`: Full system access including approval rights

## Getting Started

### Prerequisites
- JDK 17+
- Node.js 14+ and npm
- MySQL 8.0+
- Maven

### Backend Setup
1. Clone the repository
2. Configure database connection in `application.properties`
3. Run `mvn clean install` to build the project
4. Start the server with `mvn spring-boot:run`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `ng serve`
4. Access the application at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/login`: Authenticate user
- `POST /api/auth/register`: Register new user

### Client Management
- `GET /api/clients`: Get all clients (ADMIN, EMPLOYEE)
- `GET /api/clients/{id}`: Get client by ID (ADMIN, EMPLOYEE)
- `POST /api/clients`: Create client (ADMIN, EMPLOYEE)
- `PUT /api/clients/{id}`: Update client (ADMIN, EMPLOYEE)

### Credit Management
- `GET /api/credits`: Get all credits (ADMIN, EMPLOYEE)
- `GET /api/credits/own`: Get current user's credits (CLIENT)
- `POST /api/credits`: Create credit (EMPLOYEE)
- `PUT /api/credits/{id}/status`: Update credit status (ADMIN)

### Repayment Management
- `GET /api/repayments/credit/{creditId}`: Get repayments by credit
- `POST /api/repayments/monthly`: Create monthly repayment
- `POST /api/repayments/early`: Create early repayment
- `GET /api/repayments/total/{creditId}`: Calculate total repaid
- `GET /api/repayments/remaining/{creditId}`: Calculate remaining amount

## Database Schema

The application uses a relational database with the following main entities:
- User (authentication and authorization)
- Client (personal information)
- Credit (base class for all credit types)
- PersonalCredit, RealEstateCredit, ProfessionalCredit (specialized credits)
- Repayment (payment tracking)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request
