# Policy Management Software

A comprehensive policy management system built with Node.js, Express, and MongoDB. This application enables management of insurance policies, user accounts, agents, and carriers with support for bulk data import via CSV files.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Usage Examples](#usage-examples)

## Features

- **Policy Management**: Create, search, and aggregate policies
- **User Management**: Store and manage user information
- **Agent & Account Management**: Track agents and user accounts
- **Bulk Import**: Upload policies via CSV files with automatic data processing
- **Database Relationships**: Proper foreign key relationships between models
- **Rate Limiting**: Built-in protection against excessive requests
- **Security**: Helmet.js for HTTP header protection
- **Message Scheduling**: Schedule messages using cron jobs
- **Error Handling**: Comprehensive error handling and graceful shutdown

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose 9.1.2
- **Security**: Helmet.js, Express Rate Limit
- **File Upload**: Multer 2.0.2
- **Data Processing**: XLSX (Excel files)
- **Job Scheduling**: node-cron
- **Development**: Nodemon

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Clone the Repository

```bash
git clone <repository-url>
cd policy-management-repo
```

### Install Dependencies

```bash
npm install
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=4444
MONGO_URI=mongodb://127.0.0.1:27017/policy_db
NODE_ENV=development
```

### MongoDB Setup

Ensure MongoDB is running on your system:

```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or run MongoDB manually
mongod
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:4444` and automatically reload on file changes (via Nodemon).

### Production Mode

```bash
node src/app.js
```

## Project Structure

```
policy-management-repo/
├── src/
│   ├── app.js                 # Main Express application
│   ├── controllers/           # Request handlers
│   │   ├── policy.controller.js
│   │   ├── upload.controller.js
│   │   └── message.controller.js
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Policy.js
│   │   ├── Agent.js
│   │   ├── UserAccount.js
│   │   ├── PolicyCategory.js
│   │   └── PolicyCarrier.js
│   ├── routes/               # API route definitions
│   │   ├── index.js
│   │   ├── policy.routes.js
│   │   ├── upload.routes.js
│   │   └── message.routes.js
│   ├── services/             # Business logic
│   │   └── policy.service.js
│   ├── workers/              # Background workers
│   │   └── import.worker.js  # CSV import worker thread
│   ├── dbConfig/             # Database configuration
│   │   └── dbConfig.js
│   └── cron/                 # Scheduled jobs
│       └── message.cron.js
├── uploads/                  # CSV uploads directory
├── package.json
└── README.md
```

## API Endpoints

### Base URL
```
http://localhost:4444/api
```

### Policy Endpoints

#### 1. Search Policies by Username
- **Endpoint**: `GET /policy/search`
- **Query Parameters**:
  - `userName` (string, required): The first name of the user to search for
- **Description**: Retrieves all policies associated with a specific user
- **Response**: Array of policy objects with populated references
- **Example**:
  ```bash
  curl "http://localhost:4444/api/policy/search?userName=Torie%20Buchanan"
  ```

#### 2. Aggregate Policies by User
- **Endpoint**: `GET /policy/aggregate`
- **Description**: Returns aggregated data showing the total number of policies per user
- **Response**: Array of objects with user IDs and policy counts
- **Example**:
  ```bash
  curl "http://localhost:4444/api/policy/aggregate"
  ```

### Upload Endpoints

#### 3. Upload Policy CSV File
- **Endpoint**: `POST /upload`
- **Method**: POST (multipart/form-data)
- **Parameters**:
  - `file` (file, required): CSV file containing policy data
- **Description**: Uploads a CSV file and imports all data into the database (processed in background worker)
- **Response**: Upload status message
- **CSV Headers Supported**:
  - `firstname`, `email`, `phone`, `address`, `city`, `state`, `zip`, `dob`, `gender`, `userType`, `account_type`
  - `agent`, `account_name`, `category_name`, `company_name`, `policy_number`, `policy_start_date`, `policy_end_date`
  - And other policy-related fields
- **Example**:
  ```bash
  curl -X POST \
    -F "file=@policies.csv" \
    "http://localhost:4444/api/upload"
  ```

### Message Endpoints

#### 4. Schedule Message
- **Endpoint**: `POST /message/schedule`
- **Method**: POST (application/json)
- **Body Parameters**:
  - `message` (string, required): The message content to schedule
  - `schedule` (string, required): Cron expression for scheduling (e.g., "0 9 * * MON" for 9 AM Mondays)
- **Description**: Schedules a message to be sent/processed at specified times
- **Response**: Schedule confirmation
- **Example**:
  ```bash
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{
      "message": "Daily reminder",
      "schedule": "0 9 * * *"
    }' \
    "http://localhost:4444/api/message/schedule"
  ```

## Database Models

### User
```javascript
{
  firstName: String,
  dob: Date,
  address: String,
  phone: String,
  state: String,
  zip: String,
  email: String,
  gender: String,
  userType: String,
  timestamps: true
}
```

### Policy
```javascript
{
  policyNumber: String,
  startDate: Date,
  endDate: Date,
  user: ObjectId (ref: "User"),
  category: ObjectId (ref: "PolicyCategory"),
  carrier: ObjectId (ref: "PolicyCarrier"),
  agent: ObjectId (ref: "Agent"),
  account: ObjectId (ref: "UserAccount"),
  timestamps: true
}
```

### Agent
```javascript
{
  agentName: String,
  timestamps: true
}
```

### UserAccount
```javascript
{
  accountName: String,
  timestamps: true
}
```

### PolicyCategory (LOB)
```javascript
{
  categoryName: String,
  timestamps: true
}
```

### PolicyCarrier
```javascript
{
  companyName: String,
  timestamps: true
}
```

## Usage Examples

### 1. Upload a CSV File

```bash
# Assuming you have a policies.csv file
curl -X POST \
  -F "file=@policies.csv" \
  "http://localhost:4444/api/upload"
```

The CSV should contain columns like:
```
firstname,email,phone,address,state,zip,dob,gender,account_type,agent,account_name,category_name,company_name,policy_number,policy_start_date,policy_end_date
```

### 2. Search for Policies by User

```bash
curl "http://localhost:4444/api/policy/search?userName=John%20Doe"
```

Response:
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "policyNumber": "POL123456",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2025-01-01T00:00:00.000Z",
    "user": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "firstName": "John",
      "email": "john@example.com"
    },
    "category": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "categoryName": "Commercial Auto"
    },
    "carrier": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "companyName": "Nationwide"
    },
    "agent": { /* agent details */ },
    "account": { /* account details */ }
  }
]
```

### 3. Get Aggregated Policy Statistics

```bash
curl "http://localhost:4444/api/policy/aggregate"
```

Response:
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "totalPolicies": 5
  },
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
    "totalPolicies": 3
  }
]
```

### 4. Schedule a Message

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Daily policy review reminder",
    "schedule": "0 9 * * MON-FRI"
  }' \
  "http://localhost:4444/api/message/schedule"
```

## Security Features

- **Rate Limiting**: Limits each IP to 100 requests per 15 minutes
- **Content Security Policy**: Configured via Helmet.js
- **HTTP Strict Transport Security (HSTS)**: 1-year max age with preload
- **Error Handling**: Comprehensive error handling for unhandled promises and uncaught exceptions

## Graceful Shutdown

The application handles graceful shutdown on:
- `SIGTERM` signal
- `SIGINT` signal (Ctrl+C)
- Unhandled promise rejections
- Uncaught exceptions

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running on `localhost:27017`
- Check the `.env` file for correct `MONGO_URI`

### Schema Registration Error
- Ensure all model files are properly imported before use
- The models are automatically registered when the application starts

### CSV Upload Issues
- Verify CSV format matches the expected headers
- Check that the `uploads/` directory exists and has write permissions
- Ensure file size is reasonable

## License

ISC

## Support

For issues or questions, please create an issue in the repository or contact the development team.
