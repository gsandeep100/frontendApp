# Angular Application for Case Management

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [Components](#components)
- [Services](#services)
- [API Endpoints](#api-endpoints)
- [Usage Instructions](#usage-instructions)

## Introduction

This Angular application is designed to manage cases, allowing users to create, list, edit, and delete case details. It utilizes standalone components for modular architecture, enhancing maintainability and reusability.

## Getting Started

### Prerequisites

- **Node.js** (v19 or later)
- **Angular CLI** (v18 or later)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the Angular application:
   ```bash
    ng serve
   ```
   The application will be served at `http://localhost:4200/`.

## Project Structure

The project is organized into the following directories and files:

```bash
src/
├── app/
│   ├── components/
│   │   ├── cases-form/          # Standalone component for case form
│   │   ├── cases-list/          # Standalone component for listing cases
│   │   ├── modal/               # Standalone modal component
│   │   └── cases-tab/           # Standalone tab component to switch between form and list
│   ├── models/
│   │   └── case.ts              # Case model interface
│   ├── services/
│   │   ├── cases.service.ts     # Service handling case data API calls
│   │   └── data.service.ts      # Shared service for notifications and data flow
│   ├── helpers/
│   │   └── api.interceptor.ts   # HTTP Interceptor for API requests
│   ├── app.component.ts         # Root component
│   ├── app.module.ts            # Main Angular module
│   ├── app-routing.module.ts    # Application routes
│   └── app.config.ts            # App configuration
├── index.html                   # Main HTML file
├── main.ts                      # Main entry point for Angular
└── style.css                    # Global styles

```

- **components/**: Contains all the standalone Angular components like `cases-form`, `cases-list`, `modal`, and `cases-tab`.
- **models/**: Contains the data models, such as the `Cases` interface.
- **services/**: Contains service files used for API requests and managing shared data between components.

### Key Files:

1. **app.module.ts**: Declares components and imports required for the application.
2. **app-routing.module.ts**: Defines the routes for navigation between different parts of the application.
3. **app.config.ts**: Configuration file containing global settings for the application.

## Routing

The application has basic routing configured in the `app-routing.module.ts` file. This allows navigation between the **Cases** tab, listing, and case creation components.

### Route Configuration:

```typescript
import { Routes } from "@angular/router";
import { CasesTabComponent } from "./components/cases-tab/cases-tab.component";
import { NotFoundComponent } from "./components/not-found/not-found.component";

const routes: Routes = [
  { path: "", component: CasesTabComponent },
  { path: "**", component: NotFoundComponent }, // Fallback route for invalid URLs
];
```

## Components

The application is built using standalone components for modularity and reusability. The components are organized into separate directories based on their functionality.

### Components:

1. **CasesTabComponent**: Main component to switch between the case form and case list components.
2. **CasesFormComponent**: Component to create and edit case details.
3. **CasesListComponent**: Component to list all cases.
4. **ModalComponent**: Component to display modal dialogs.
5. **NotFoundComponent**: Component to display a 404 error page.

## Services

The application uses services to handle API requests and shared data between components. The services are organized into separate files based on their functionality.

### Services:

1. **CasesService**: Service to handle API requests for case data.
2. **DataService**: Shared service for notifications and data flow between components.
3. **ApiInterceptor**: HTTP Interceptor for API requests.

## API Endpoints

The application interacts with the following API endpoints:

- **GET /cases**: Get all cases
- **GET /cases/:id**: Get a case by ID
- **POST /cases/addNewCase**: Create a new case
- **PUT /cases/:id**: Update a case by ID
- **DELETE /cases/:id**: Delete a case by ID

## Usage Instructions

1. **Create a Case**:

   - Click on the **Add New Case** button in the **Cases** tab.
   - Fill in the case details and click **Save** to create a new case.

2. **Edit a Case**:

   - Click on the **Edit** button next to a case in the **Cases List**.
   - Update the case details and click **Save** to update the case.

3. **Delete a Case**:
   - Click on the **Delete** button next to a case in the **Cases List**.
   - Confirm the deletion to remove the case.
