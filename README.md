# MindWell

## Project Overview

**MindWell** is a cross-platform mobile application designed to help users achieve emotional balance and improve their mental well-being. It provides a personalized approach to mental health through AI-driven insights and tailored exercises. Users begin with a brief **mental state assessment**, receive a customized profile, and engage with various exercises and tools aimed at stress reduction, mindfulness, and emotional resilience. The project integrates a mobile frontend, a cloud-ready backend API, and a machine learning microservice to deliver a comprehensive mental health companion.

## Features

* **Personalized Assessment:** New users complete a short questionnaire to gauge their current mental state. The app uses this input along with an AI model to generate a **personalized profile** that identifies the user’s emotional tendencies or “profile type.” This helps tailor the content and exercises to the user’s needs from the start (e.g. highlighting areas like anxiety, motivation, or mindfulness focus).

* **Guided Meditation Exercises:** A variety of **meditation and relaxation exercises** are available, such as deep breathing routines, visualization practices, and mindfulness meditations. These exercises are personalized based on the user’s profile and feedback. For example, a user prone to anxiety might see more breathing exercises, while someone seeking focus might get visualization tasks.

* **Emotion Management Tools:** The app includes an in-app **journal and self-reflection** module where users can write down their thoughts and feelings. An AI-based component analyzes journal entries to detect emotional tone and patterns, offering **AI-generated suggestions** for coping strategies. Users can also review prompts for self-reflection, helping them process emotions constructively.

* **Progress Tracking:** Users can track their emotional well-being over time. The app presents progress **charts and tables** (e.g. mood over weeks, streaks of exercise completion) to visualize improvements or patterns. This data is logged via the backend and can be exported for personal use. By viewing progress, users stay motivated and can identify triggers or successful strategies.



## Technology Stack

* **Frontend:** React Native (Expo) – The mobile app is built with React Native for a smooth cross-platform experience on iOS and Android. The Expo framework is used for development and deployment convenience. The UI is written in JavaScript/TypeScript and utilizes libraries for charts, navigation, and state management (for example, `react-native-chart-kit` for progress graphs).

* **Backend:** ASP.NET Core (C#) – A RESTful API backend handles authentication, data storage, and business logic. The backend manages user profiles, exercise content, journal entries, and progress records. It exposes endpoints that the mobile app calls to fetch personalized exercise recommendations, submit journal texts, record progress, etc. The choice of ASP.NET Core provides a robust, secure framework for web services, leveraging C# for reliability and performance. (According to the repository’s statistics, \~30% of the code is C#.)

* **Microservice (AI/ML):** Python (Flask) – A microservice built with Flask houses the app’s machine learning components. This service loads NLP models and other ML logic to analyze user input and generate personalized recommendations. For instance, an **emotion analysis model** (such as a HuggingFace transformer for emotion classification) is used to interpret journal entries or survey answers. The Flask service runs separately and communicates with the ASP.NET backend or directly with the frontend to provide AI-driven insights. (Python constitutes a small portion of the codebase, dedicated to these ML features.)

**Note:** In addition to the above, the project uses standard tools like JSON for data exchange between frontend and backend, and it may utilize a database (or file-based storage) on the backend for persisting user data and progress. The exact database technology is not specified, but ASP.NET Core easily integrates with SQL databases or in-memory storage as needed.

## Setup Instructions

Setting up the MentalHealthApp on a local development environment involves preparing the frontend (React Native app), the backend (ASP.NET API), and the AI microservice (Flask). Follow the steps below for each component:

### Prerequisites

* **Node.js** (for running the React Native/Expo app) and **npm** or **yarn** for package management.
* **Expo CLI:** Install Expo globally with `npm install --global expo-cli`, or use npx as needed (Expo is used for running the React Native app).
* **.NET SDK:** Install the .NET 6 SDK (or a compatible version) to build and run the ASP.NET Core backend.
* **Python 3** and **pip** (for the machine learning microservice). It’s recommended to create a Python virtual environment for the project.


## Project Structure

The repository is organized into two main folders for the frontend and backend, plus supporting files and subdirectories for additional services and assets. Below is a brief overview:

* **`frontend/`** – This directory contains the React Native (Expo) project for the mobile app. Key files include the entry point (e.g., `App.js` or `index.js`), and subfolders for components, screens, and utilities. It also contains the **assets** subfolder for images and other media (including the app logo). The frontend is structured following typical React Native conventions, using React Navigation for screen transitions and state management for handling user data locally.

* **`frontend/assets/`** – Contains static assets for the app, such as images (the app’s logo, icons, etc.), fonts, and possibly pre-packaged media for exercises. For example, guided meditation audio or illustration images could reside here if included in the project.

* **`frontend/tts-service/`** – Contains the Python machine learning modules (the "AI microservice"). Within this folder are Python scripts and data files used for the personalized recommendations and emotional analysis features (e.g., `ml_recommender.py`, `train_model.py`, `planet_explanations_extended.json`). The presence of these files indicates the implementation of custom ML logic for generating insights (such as classifying users into certain categories or analyzing progress). This code can run as a separate service or be utilized offline to pre-compute suggestions.

* **`backend/`** – This directory holds the ASP.NET Core backend project. Important contents include:

  * **Controllers/** (expected): Handles HTTP requests for various features (e.g., authentication, exercises, journal entries, progress data). These classes define the API endpoints that the frontend calls.
  * **Models/** and **DTOs/**: Defines data models for users, exercises, entries, etc., and Data Transfer Objects if used.
  * **Services/** or **Business Logic**: Implementation of core logic such as calculating personalized exercise schedules, sending notifications (possibly via a scheduled job), and interfacing with the ML microservice.
  * **Data/**: If a database is used, this might contain Entity Framework context and migration files, or any seed data.
  * **Configuration Files**: `appsettings.json` for configuration (e.g., database strings, external service URLs), and possibly logging or dependency injection setup.
  * Project Files: The `.csproj` and solution files for building the project, as well as a `.gitignore` tuned for Visual Studio. (The repository’s language breakdown confirms the C# backend as a major component.)

* **Root Files:** In the repository root, you’ll find this `README.md`, a `.gitignore` for Node/VisualStudio, and other standard files. Notably, there is currently no dedicated `LICENSE` file provided (see [License](#license) section). The project also includes a `.gitattributes` (likely to handle Git LFS or end-of-line normalization).

Each part of the project is separated for clarity: the mobile app, backend API, and ML service can be developed and tested in isolation. This modular structure makes it easier for multiple contributors to work on different components (for example, mobile developers can focus on the React Native code while backend developers work on the API logic concurrently).

## Screenshots

<img src="https://github.com/user-attachments/assets/41bea057-b448-4650-bf6d-dcbf83ead222" alt="welcome" width="300" />
<img src="https://github.com/user-attachments/assets/49c0592e-7f3a-40ba-ac74-81383c80c8c3" alt="login" width="300" />
<img src="https://github.com/user-attachments/assets/36678b67-c235-4eb6-99d0-24e01edc0963" alt="register1" width="300" />
<img src="https://github.com/user-attachments/assets/3b6b51aa-b77b-4d94-b098-693f82bdcdcc" alt="register2" width="300" />
<img src="https://github.com/user-attachments/assets/d322620e-94e1-44a2-a4e9-9b0d738f7cd7" alt="register4" width="300" />
<img src="https://github.com/user-attachments/assets/4056e3bd-dcf1-4379-bc05-e11cb03c954d" alt="profile" width="300" />
<img src="https://github.com/user-attachments/assets/f11bdf77-3f83-42a9-9799-f6ef9ec5bf40" alt="progress" width="300" />
<img src="https://github.com/user-attachments/assets/01a7f59d-1224-4b77-b62e-61e2abb13b79" alt="chart" width="300" />
<img src="https://github.com/user-attachments/assets/97bbb854-276c-446b-a4e1-bdd7cf6ddcf7" alt="exercises" width="300" />
<img src="https://github.com/user-attachments/assets/4de6b923-00e6-4299-a398-d7ea7ea5efb1" alt="exercise" width="300" />
<img src="https://github.com/user-attachments/assets/c974e6ab-91c5-443d-8320-bc60fb9fe718" alt="emotion" width="300" />
<img src="https://github.com/user-attachments/assets/fc3cce35-d62f-420c-8b0f-507bd512343c" alt="testres" width="300" />
<img src="https://github.com/user-attachments/assets/506e0d03-0175-422a-bc3d-57b6a769f4b4" alt="statisticstest" width="300" />
<img src="https://github.com/user-attachments/assets/bb9e5e09-a2c5-4f26-aa00-c605573822a6" alt="statisticsinter" width="300" />






## Future Improvements

While **MentalHealthApp** is fully functional, there are opportunities to enhance and expand the project in the future:

* **Expanded Content:** Add more exercises and content types, such as yoga stretches, cognitive behavioral therapy (CBT) worksheets, or guided sleep stories. A broader content library would cater to a wider range of user preferences and mental health needs.

* **Enhanced Personalization:** Upgrade the AI personalization with more advanced models or user-specific tuning. For example, using collaborative filtering or reinforcement learning to adjust exercise recommendations based on what’s most effective for similar users. Incorporating sentiment analysis on journal entries (already in place) could be extended to provide users with deeper insights or flags to seek professional help if extreme sentiments are detected.

* **Social & Community Features:** Introduce an optional community aspect – users could share achievements or journal prompts anonymously, or encourage each other in a moderated forum. Group meditation sessions or challenges could foster a sense of community and accountability among users.

* **Improved Gamification:** Build on the gamified elements by adding levels, badges, or a rewards store. For instance, achieving a 30-day streak might unlock new themes or avatar customizations, making the process of habit-building more enjoyable.

* **Platform Deployment:** Deploy the backend and ML service to a cloud platform (such as Azure or AWS) for better scalability and reliability. Similarly, publish the mobile app to the iOS App Store and Google Play Store. This would involve setting up proper CI/CD pipelines, thorough testing on physical devices, and ensuring compliance with store guidelines (especially regarding user data privacy given the sensitive nature of mental health data).

* **User Data Privacy & Security:** As a future update, implement end-to-end encryption for sensitive data, give users options to control or delete their data, and possibly integrate biometric or two-factor authentication for extra security on personal journals.

These improvements can further elevate **MindWell** from a solid prototype to a production-ready platform, providing even more value and trust for its users.


