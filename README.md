
# Music App

This is a music player application where users can create playlists, add songs, and manage their personal music library. The frontend is built with React and the backend is developed using Flask.

## Features

- **User Authentication**: Users can register and log in to their accounts.
- **Playlist Management**: Users can create, manage, and delete playlists.
- **Song Management**: Users can add and remove songs from playlists.
- **Music Playback**: Users can play songs from their playlists.

## Technologies Used

- **Frontend**: React, JavaScript, CSS
- **Backend**: Flask, Python, SQLite
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

Before running the project, you need to have the following software installed:

- **Node.js and npm** (for managing frontend dependencies)
- **Python 3.x** (for running the backend)
- **pip** (for installing Python dependencies)
- **Flask** (for the backend API)
- **SQLite** (for the database, or configure another database as needed)

## Getting Started

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables (e.g., `JWT_SECRET_KEY`) for the Flask app.

4. Run the Flask server:
   ```bash
   python run.py
   ```

   The backend will be available at `http://localhost:5000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the necessary frontend dependencies:
   ```bash
   npm install
   ```

3. Run the React app in development mode:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

### Build for Production

To build the frontend for production, run the following command in the `frontend` directory:

```bash
npm run build
```

This will create an optimized production build in the `build/` directory.
You can then serve the static files using a web server or integrate it with the Flask backend.

## Folder Structure

- **`backend/`**: Contains the Flask backend code and database configurations.
- **`frontend/`**: Contains the React frontend code.
- **`requirements.txt`**: List the dependencies for the backend.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


