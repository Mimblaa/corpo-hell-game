
# Corpo Hell Game

## Project Overview


**Corpo Hell Game** is a satirical browser game that parodies the absurdities of corporate life. Compete in office-themed mini-games, generate hilarious avatars, and climb the corporate leaderboard! The project combines a playful React frontend with an AI-powered Python backend, delivering a unique blend of fun, creativity, and parody. All features are designed as interactive games or challenges, not as real productivity tools.

---



## Key Features

- **AI Avatar Generation**: Instantly create photorealistic avatars using the Stable Diffusion model. Users can customize gender, skin tone, hairstyle, accessories, and more, with results generated on demand.

  <!-- Place a screenshot or GIF of the avatar generation feature below -->
  ![Avatar Generation Example](docs/screenshots/avatar-generation.png)

- **SVG & Predefined Avatars**: Instead of generating, users can also select from a set of ready-made SVG avatars. This allows for instant avatar assignment without waiting for AI generation. SVG avatars are lightweight, customizable, and ideal for quick profile setup.

  ![SVG Avatar Example](docs/screenshots/svg-avatar.png)

- **Conversational AI**: Engage in dynamic conversations with AI-powered chatbots, simulating real corporate communication and support scenarios.

  ![AI Chat Example](docs/screenshots/ai-chat.png)

- **Random Identity Generator**: Generate random names and faces for avatars, ideal for testing, onboarding, or role-play scenarios.

  ![Random Identity Example](docs/screenshots/random-identity.png)



- **Mini-Games & Corporate Apps**: The dashboard is packed with interactive mini-games and playful challenges, all themed around the chaos of office life. These are not real productivity tools, but game-like experiences, such as:
  - **Calendar**: Gamified planning of (fake) workdays and meetings.
  - **Notepad**: Doodle, draw, and present as part of creative office tasks.
  - **Email Client**: Play with simulated emails, often with a humorous or unexpected twist.
  - **Calculator**: Solve quirky office math puzzles and challenges.

  ![Task Dashboard](docs/screenshots/task-example.png)

  ![Email Rask Example](docs/screenshots/email.png)

  ![Quiz Example](docs/screenshots/quiz.png)

  ![Drawing Example](docs/screenshots/drawing.png)

- **Player Statistics & Progress**: Track your progress like in any good game! The app records your completed challenges, quiz scores, and achievements, letting you compete with yourself or others on the corporate leaderboard. All stats are for fun and game progression only.

  ![Statistics Example](docs/screenshots/statistics.png)


- **Notifications & Calls**: Simulate corporate notifications and call features, enhancing the realism of the environment.

  ![Notifications Example](docs/screenshots/notifications.png)

  ![Calls Example](docs/screenshots/calls.png)

---

## Technology Stack

### Frontend
- **React** (with hooks and functional components)
- **React DnD** for drag-and-drop functionality
- **React Quill** for rich text editing
- **Modern JavaScript (ES6+)**
- **Custom CSS Modules** for scoped styling

### Backend
- **FastAPI** for high-performance API endpoints
- **Stable Diffusion (Diffusers, Torch, Transformers)** for AI image generation
- **Pydantic** for data validation
- **Faker** for random name generation
- **Uvicorn** as the ASGI server

---

## Getting Started

### 1. Clone the Repository

```powershell
git clone https://github.com/your-username/corpo-hell-game.git
cd corpo-hell-game
```

### 2. Frontend Setup

Install all required dependencies:

```powershell
npm install
```

Create a `.env` file in the root directory and add your OpenAI API key for chat features:

```
REACT_APP_OPENAI_API_KEY=your_actual_openai_api_key_here
```

To launch the React development server:

```powershell
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to use the app.

### 3. Backend Setup

Navigate to the backend directory:

```powershell
cd backend
```

Install Python dependencies (preferably in a virtual environment):

```powershell
pip install -r requirements.txt
```

Start the FastAPI backend server:

```powershell
uvicorn generate_avatar:app --reload
```

The backend API will be available at [http://localhost:8000](http://localhost:8000).

---

## Configuration & Environment Variables

### Frontend
- Create a `.env` file in the project root with:
  ```
  REACT_APP_OPENAI_API_KEY=your_actual_openai_api_key_here
  ```
  This key is required for AI chat features. You can obtain an API key from [OpenAI](https://platform.openai.com/account/api-keys).

### Backend
- No API keys are required by default. If you extend the backend to use external APIs, document and add them to a `.env` file in the `backend/` directory.

---

## Useful Commands

### Frontend
- `npm start` – Launches the development server
- `npm run build` – Builds the app for production
- `npm test` – Runs the test suite

### Backend
- `uvicorn generate_avatar:app --reload` – Starts the FastAPI server with hot reload

---

## Directory Structure

```
corpo-hell-game/
│
├── backend/
│   ├── generate_avatar.py         # FastAPI app for avatar/image generation
│   ├── requirements.txt          # Python dependencies
│   └── ...
├── public/                       # Static files for React
├── src/                          # All React components and modules
│   ├── apps_components/          # Productivity widgets (Notepad, Email, etc.)
│   ├── calendar_components/      # Calendar and scheduling tools
│   ├── calls_components/         # Call simulation features
│   ├── chat_components/          # AI chat and messaging
│   ├── notification_components/  # Notification system
│   ├── onedrive_components/      # Local storage
│   ├── task_components/          # Task management and AI task generator
│   └── ...
├── package.json                  # Frontend dependencies and scripts
└── README.md                     # Project documentation
```

---

## Additional Information

- **Performance**: For best results in avatar generation, use a machine with a CUDA-enabled GPU. CPU-only systems will work but may be significantly slower.
- **Extensibility**: The backend is modular and can be extended with new endpoints or AI models. The frontend is component-based for easy feature addition.
- **Testing**: The project includes scripts for running frontend tests. Backend endpoints can be tested with tools like Postman or curl.
- **Security**: Do not commit your `.env` files or API keys to version control. Use `.gitignore` to keep secrets safe.
- **Collaboration**: The codebase is organized for team development, with clear separation of concerns and modular design.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
