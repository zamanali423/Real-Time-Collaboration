# Real-Time-Collaboration

This project demonstrates a React application with real-time collaboration capabilities. It includes functionality for observing DOM changes using `MutationObserver`, updating documents, and real-time notifications using socket.io.

## Prerequisites
Node.js and npm installed
<br/>
MongoDB installed and running

## Installation
### 1.Clone the repository:

```

git clone https://github.com/zamanali423/Real-Time-Collaboration.git
cd real-time-collaboration

```

### 2.Install server dependencies:

```

cd server
npm install

```

### 3.Install client dependencies:

```

cd ../client
npm install


```

## Setup Environment Variables
Create a `.env` file in the `server` directory with the following content:

```

PORT=3001
MONGO_URI=mongodb://localhost:27017/realtime-collaboration
JWT_SECRET=your_secret_key

```

# Running the Application
### 1.Start the server:

```

cd server
npm start

```

### 2.Start the client:

```

cd ../client
npm start

```

### 3.Open your browser and navigate to:

```

http://localhost:3000

```

## Features
1.Real-time document updates
<br/>
2.Notifications for document changes
<br/>
3.ecure authentication with JWT


# Brief Report: Real-Time Collaboration Development
## 1. Development Process:

### Planning:

Defined project requirements and created a feature list.
<br/>
Designed the application architecture, separating the client and server.
<br/>
<strong>Choose technologies:</strong> React for the frontend, Node.js/Express for the backend, MongoDB for the database, and socket.io for real-time communication.

### Backend Development:

Set up Express server with necessary routes for document `CRUD` operations.
<br/>
Implemented `JWT-based` authentication.
<br/>
Created MongoDB models for document storage.
<br/>
Integrated `socket.io` for real-time notifications.

### Frontend Development:

Set up React project with necessary dependencies.
<br/>
Created components for displaying and updating documents.
<br/>
Integrated `React-Quill` for rich text editing.
<br/>
Used `socket.io-client` for real-time updates.

### 2. Challenges Encountered:

#### Real-Time Synchronization:
Ensuring consistent state across multiple clients required careful handling of socket events and state management.

#### Rich Text Editing:
Integrating `ReactQuill` and ensuring sanitized content with `DOMPurify` to prevent `XSS` attacks.

#### Security:
Implementing secure `JWT-based` authentication and handling token expiry correctly.

### 3. Solutions Implemented:

#### Real-Time Synchronization:
Used `socket.io` for real-time communication.
<br/>
Ensured updates were broadcasted to all connected clients using socket events.

#### Rich Text Editing:
Used `ReactQuill` for rich text editing.
<br/>
Implemented `DOMPurify` to sanitize HTML content.

#### Security:
Implemented middleware to handle `JWT` verification.
<br/>
Managed `token` expiry by prompting users to re-login when their token expired.
