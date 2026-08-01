# Task Manager - Backend

Django REST API for the Task Manager application.

## Tech Stack

- **Django 4.2** - Web framework
- **Django REST Framework** - API toolkit
- **django-cors-headers** - CORS handling
- **SQLite** (default) / **PostgreSQL** (production)

## Architecture

The backend follows **SOLID principles** and clean architecture:

- **Single Responsibility**: Each module handles one concern (models, serializers, views)
- **Open/Closed**: Generic DRF views are extended, not modified
- **Interface Segregation**: Separate serializers for list/detail/create/update operations
- **Dependency Inversion**: Views depend on serializer abstractions, not concrete implementations

## Project Structure

```
backend/
├── taskmanager/          # Django project configuration
│   ├── settings.py       # Project settings with environment variables
│   ├── urls.py           # Root URL routing
│   ├── wsgi.py           # WSGI application
│   └── asgi.py           # ASGI application
├── tasks/                # Tasks application
│   ├── models.py         # Task data model with business logic
│   ├── serializers.py    # Data serialization (4 specialized serializers)
│   ├── views.py          # API endpoint views (6 endpoints)
│   ├── urls.py           # App URL routing
│   ├── admin.py          # Django admin configuration
│   └── tests.py          # Unit and API tests
├── manage.py             # Django management script
├── requirements.txt      # Python dependencies
└── .env                  # Environment variables (create this)
```

## Database Schema

### `tasks_task` Table

The application uses a single core model — `Task` — mapped to the `tasks_task` database table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `BIGINT` | `PRIMARY KEY`, `AUTO_INCREMENT` | Unique task identifier |
| `title` | `VARCHAR(200)` | `NOT NULL` | Brief title describing the task |
| `description` | `TEXT` | `NULL` allowed, default `''` | Optional detailed description |
| `completed` | `BOOLEAN` | `NOT NULL`, default `FALSE` | Whether the task has been completed |
| `priority` | `INTEGER` | `NOT NULL`, default `2` | Priority level: `1` = High, `2` = Medium, `3` = Low |
| `created_at` | `DATETIME` | `NOT NULL`, auto-set on insert | Timestamp when the task was created |
| `updated_at` | `DATETIME` | `NOT NULL`, auto-updated on write | Timestamp when the task was last modified |

#### Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| `tasks_task_completed_idx` | `completed` | Fast filtering by completion status |
| `tasks_task_priority_idx` | `priority` | Fast filtering/sorting by priority |
| `tasks_task_created_at_idx` | `created_at` | Fast sorting by creation date (descending) |

#### Priority Choices

| Value | Label |
|-------|-------|
| 1 | High |
| 2 | Medium |
| 3 | Low |

#### Model Methods

- `mark_completed()` — Sets `completed = True` and updates `updated_at`
- `mark_incomplete()` — Sets `completed = False` and updates `updated_at`
- `is_overdue` (property) — Returns `True` if the task is uncompleted and older than 7 days

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List all tasks (paginated) |
| POST | `/api/tasks/create/` | Create a new task |
| GET | `/api/tasks/<id>/` | Get task details |
| PUT/PATCH | `/api/tasks/<id>/update/` | Update a task |
| DELETE | `/api/tasks/<id>/delete/` | Delete a task |
| PATCH | `/api/tasks/<id>/toggle/` | Toggle completion status |

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Create Environment File

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# For PostgreSQL (optional - SQLite used by default)
# DB_ENGINE=django.db.backends.postgresql
# DB_NAME=taskmanager
# DB_USER=postgres
# DB_PASSWORD=yourpassword
# DB_HOST=localhost
# DB_PORT=5432
```

### 4. Run Migrations

```bash
python manage.py migrate
```

### 5. Create Admin User (Optional)

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/`

### 7. Run Tests

```bash
python manage.py test
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | `django-insecure-change-me` | Django secret key |
| `DEBUG` | `True` | Debug mode |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Allowed hosts |
| `DB_ENGINE` | `sqlite3` | Database engine |
| `DB_NAME` | `db.sqlite3` | Database name |
| `DB_USER` | - | Database user |
| `DB_PASSWORD` | - | Database password |
| `DB_HOST` | - | Database host |
| `DB_PORT` | - | Database port |
