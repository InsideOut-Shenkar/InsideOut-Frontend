# InsideOut-Frontend

This is the frontend component of the InsideOut project, version 1.2.0. The project is a sophisticated web application designed to provide intuitive interfaces and powerful data visualization for medical risk assessments. The frontend is built using modern JavaScript technologies, including React, Material-UI, and Redux.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development](#development)
- [License](#license)

## Project Overview

The InsideOut frontend serves as the user interface for interacting with the backend services of the InsideOut system. It provides tools for visualizing risk assessments, managing patient and report data.

## Features

- `Designed UI`: Built with Material-UI, ensuring a consistent design across devices.
- `Data Visualization`: Utilizes libraries like ApexCharts and react-gauge-component to present data in an easily digestible format.
- `Form Management`: Powered by Formik and Yup for robust form validation and state management.
- `Authentication`: Integrated with AWS Cognito for secure user authentication.
- `Routing and State Management`: Uses React Router for client-side routing and Redux Toolkit for state management.

## Installation

To get started with the InsideOut frontend, clone the repository and install the necessary dependencies.

```bash
git clone https://github.com/InsideOut-Shenkar/InsideOut-Frontend.git
cd insideout-front
npm install
```

## Environment Variables

The application relies on several environment variables to configure various aspects of the system. These variables must be defined in a `.env` file in the root of the project. Here are the required environment variables:

- `REACT_APP_VERSION`: The current version of the application.
- `GENERATE_SOURCEMAP`: Set to `false` to disable source map generation for production builds.
- `REACT_APP_SERVER_ENDPOINT`: The endpoint URL of the backend server.
- `REACT_APP_ACCESS_KEY_ID`: AWS Access Key ID for authentication.
- `REACT_APP_SECRET_ACCESS_KEY`: AWS Secret Access Key for authentication.
- `REACT_APP_S3_REGION`: The AWS region where the S3 bucket is located.
- `REACT_APP_S3_NAME`: The name of the S3 bucket used by the application.
- `REACT_APP_MF_FILE_NAME`: The name of the multifactor authentication file.
- `REACT_APP_USER_POOL`: The Cognito User Pool ID for user authentication.
- `REACT_APP_CLIENT_ID`: The Cognito Client ID for user authentication.
- `REACT_APP_AWS_REGION`: The AWS region for the Cognito User Pool and other services.

## Usage

After installing the dependencies and setting up the environment variables, you can start the development server to view the application in your browser.

```bash
npm start
```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

To create a production build, run:

```bash
npm run build
```

## Scripts

- **start**: Runs the application in development mode.
- **build**: Builds the application for production.
- **test**: Runs the test suite.
- **eject**: Ejects the app configuration for customization.

## Dependencies

The project relies on several key dependencies:

- `React`: A JavaScript library for building user interfaces.
- `Material-UI`: A popular React UI framework.
- `Redux Toolkit`: Official, opinionated, and powerful set of tools for efficient Redux development.
- `ApexCharts`: A modern charting library for visualizing data.
- `Formik & Yup`: Libraries for form state management and validation.
- `AWS SDK & Cognito`: Provides access to AWS services, including user authentication.

For a complete list of dependencies, refer to the `package.json` file.

## Development

To contribute to the InsideOut frontend, ensure that you follow best practices for React and JavaScript development. Code linting and formatting are enforced using ESLint and Prettier. The project uses the following ESLint configuration:

- **extends**: 
  - react-app
  - react-app/jest

Prettier is used to maintain consistent code formatting. The linting and formatting can be run using:

```bash
npm run lint
npm run format
```

## Authors

- **Lidia Polyakov** - [GitHub](https://github.com/lidiaPolyakov)
- **Asaf Bai** - [GitHub](https://github.com/asafbaibekov)
- **Ibraheem Alnakib** - [GitHub](https://github.com/abrahhem)


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.