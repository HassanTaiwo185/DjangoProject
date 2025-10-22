Real-Time Chat App
This is a real-time chat application built with Django Channels, WebSockets, and Redis. It supports multiple users and chat rooms, with a React frontend that showcases live updates.
Features
* Real-time messaging using WebSockets.
* User authentication and profile management.
* Chat room creation and participation.
* Scalable architecture with Django, Redis, and Celery.
Prerequisites
Before you begin, ensure you have the following installed on your system:
* Python 3.10+ (Django)
* Node.js & npm (React)
* Git
* Redis Server (for local development)
Local Setup Guide
Follow these steps to get the application running on your local machine.
Step 1: Clone the Repository
Clone the project from your repository to your local machine.
git clone <your-repository-url>
cd <your-repository-name>

Step 2: Backend Setup (Django)
Navigate to the backend directory to set up the Django API.
cd backend

1. Create and activate a Python virtual environment
For macOS/Linux:
python3 -m venv .venv
source .venv/bin/activate

For Windows:
python -m venv .venv
.venv\Scripts\activate

2. Install Python dependencies
Install all the required packages from the requirements.txt file.
pip install -r requirements.txt

3. Database Configuration
You have two options for the database:
* Option A: Use the default SQLite database (recommended for simple local setup).
* Option B: Connect to a PostgreSQL database (e.g., on AWS RDS or a local instance).
Option A (SQLite): No extra setup is required. The project is configured to use SQLite by default for development.
Option B (PostgreSQL): You will need a running PostgreSQL server. If you're using AWS RDS, follow these steps to get the database credentials from your AWS Console:
* Log in to your AWS account.
* Navigate to the Amazon RDS dashboard.
* Select your PostgreSQL database instance.
* Click on the Connectivity & security tab.
* Find the Endpoint & port and Credentials sections to get the DB_HOST, DB_PORT, DB_USER, and DB_PASSWORD.
4. Create the Backend .env file
Create a new file named .env in the backend directory and add the following configuration. Replace the placeholder values with your own if you are not using SQLite.
# Django secret key
SECRET_KEY=django-insecure-a7munyer4qud+-6gv_uj4016kzo!b_y94ywf5o8zdf_$frzm+6

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Redis configuration (for Celery and Channels)
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0

# Database settings
DB_NAME=postgres
DB_USER=Hassanphine
DB_PASSWORD=H.a.s.s.a.n123
DB_HOST=microflow-database.ctescc44o1zj.us-east-2.rds.amazonaws.com
DB_PORT=5432

5. Apply database migrations
Run the migrations to create the database schema.
python3 manage.py migrate

6. Start the Django development server
python3 manage.py runserver

Your backend server will be running at http://127.0.0.1:8000.
Step 3: Frontend Setup (React)
Open a new terminal window and navigate to the frontend directory.
cd frontend

1. Install npm dependencies
npm install

2. Create the Frontend .env file
Create a file named .env in the frontend directory with the following configuration:
VITE_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
VITE_WS_URL=ws://127.0.0.1:8000/

3. Start the React development server
npm run dev

Your frontend will be running at http://localhost:5173.
Step 4: Run the App
With both the Django and React development servers running, you can access the application in your browser at http://localhost:5173.
Tip: To test the real-time features, open two browser tabs and log in with different users. You will be able to see messages appear instantly in both tabs.
Project Demo
This is a short demo GIF showing two users chatting in real-time.


￼

￼
