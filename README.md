# Task Manager - Full Stack Application

A simple, production-ready task management application built with Django REST Framework and React.

## Overview

This project demonstrates a complete full-stack implementation of a task manager with:
- Clean, responsive UI
- RESTful API design
- SOLID principles throughout
- Comprehensive error handling
- Unit and API tests

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 4.2 + Django REST Framework |
| Frontend | React 18 + Axios |
| Database | SQLite (default) / PostgreSQL (production) |
| Styling | Custom CSS with CSS Variables |

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend runs at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List all tasks |
| POST | `/api/tasks/create/` | Create task |
| GET | `/api/tasks/<id>/` | Get task details |
| PUT/PATCH | `/api/tasks/<id>/update/` | Update task |
| DELETE | `/api/tasks/<id>/delete/` | Delete task |
| PATCH | `/api/tasks/<id>/toggle/` | Toggle completion |

## SOLID Principles Applied

### Backend
- **Single Responsibility**: Separate files for models, serializers, views, and URLs
- **Open/Closed**: Generic DRF views extended for specific needs
- **Interface Segregation**: 4 specialized serializers (List, Detail, Create, Update)
- **Dependency Inversion**: Views depend on serializer abstractions

### Frontend
- **Single Responsibility**: Each component has one job (TaskList manages state, TaskItem renders, TaskForm handles input)
- **Service Layer**: API logic isolated from UI components
- **Reusable Components**: TaskItem and TaskForm are pure and reusable

## Project Structure

```
taskmanager-project/
├── backend/              # Django REST API
│   ├── taskmanager/      # Project config
│   ├── tasks/            # Tasks app
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
└── frontend/             # React app
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── README.md
```

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## License

This project is for educational and assessment purposes.
