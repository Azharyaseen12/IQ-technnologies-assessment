# Task Manager - Frontend

React frontend for the Task Manager application.

## Tech Stack

- **React 18** - UI library
- **Axios** - HTTP client
- **CSS3** - Custom styling with CSS variables
- **No UI framework** - Hand-crafted responsive design

## Architecture

The frontend follows component-based architecture with clear separation of concerns:

- **Single Responsibility**: Each component handles one specific concern
- **Service Layer**: API calls isolated in `services/api.js`
- **Container/Presentational Pattern**: `TaskList` manages state, child components handle display
- **Reusable Components**: `TaskItem` and `TaskForm` are pure presentational components

## Project Structure

```
frontend/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── TaskList.js     # Main container (state management)
│   │   ├── TaskItem.js     # Individual task display
│   │   └── TaskForm.js     # Add/Edit form modal
│   ├── services/
│   │   └── api.js          # API communication layer
│   ├── App.js              # Root component
│   ├── App.css             # Component styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles & CSS variables
├── package.json
└── README.md
```

## Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Filter tasks by status (All / Active / Completed)
- ✅ Real-time task count updates
- ✅ Loading states and error handling
- ✅ Confirmation dialogs for destructive actions
- ✅ Accessible form validation
- ✅ Smooth animations and transitions
- ✅ Keyboard-navigable interface

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure API URL (Optional)

By default, the frontend expects the backend at `http://localhost:8000/api`.

To change this, create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run tests |
| `npm run eject` | Eject from Create React App |

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)
