# Banking Credit Management System

A comprehensive Angular application for managing bank clients, credits, and repayments. This front-end application integrates with a Spring Boot REST API backend.

## Features

### Client Management
- View list of clients with search functionality
- View detailed client information
- Create new clients
- Update client information

### Credit Management
- View and filter credits by status and type
- Create different types of credits:
  - Personal Credit
  - Real Estate Credit
  - Professional Credit
- Track credit status (In Progress, Accepted, Rejected)

### Repayment Management
- Add monthly and early repayments
- View repayment history for each credit
- Calculate total repaid amounts
- Calculate remaining amounts

## Technical Implementation

- **Angular 17**: Utilizing the latest Angular features with standalone components
- **Bootstrap 5**: Responsive and modern UI
- **TypeScript**: Strongly typed models and services
- **Reactive Forms**: Form validation and custom validation
- **RESTful API Integration**: Services for connecting to backend endpoints

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`

3. **Build for Production**:
   ```bash
   ng build
   ```

## Backend Integration

This application is designed to work with a Spring Boot backend with the following endpoints:
- `/api/clients` - CRUD operations for clients
- `/api/credits` - CRUD operations for credits
- `/api/repayments` - Operations for repayments

## Authentication

The application includes a basic authentication system (currently mocked). In a production environment, this would connect to a backend authentication service.

## Project Structure

- `src/app/models`: Data models matching backend entities
- `src/app/services`: Services for API integration
- `src/app/components`: Angular components organized by feature
- `src/app/guards`: Route guards for authentication
- `src/app/layouts`: Layout components for different views
