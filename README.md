# TeamTask Pro - Project Management Platform

TeamTask Pro is a modern, full-stack project management application built with **Laravel 11** and **React**. It is designed for both personal productivity and team collaboration, featuring a professional UI with data-driven insights.

## ✨ Key Features

- **📊 Advanced Dashboard**: Real-time project statistics and activity overview using data visualizations (Recharts).
- **🌓 Premium Theme Support**: Seamless Dark and Light mode toggle with state persistence.
- **📁 Dual Project Modules**: 
  - **Team Projects**: Collaborative spaces with member management.
  - **Personal Workspace**: Private projects for individual task tracking.
- **✅ Task Management**: Prioritize tasks (High, Medium, Low) and track progress with interactive status badges.
- **🎨 Professional UI**: Modern sidebar navigation, glassmorphism effects, and responsive design built with **React-Bootstrap** and **Inter** typography.
- **🔐 Secure Authentication**: Robust user authentication system powered by **Laravel Sanctum**.

## 🚀 Tech Stack

- **Backend**: Laravel 11 (PHP 8.2+)
- **Frontend**: React 18 with Vite
- **Styling**: CSS3 Custom Variables (Vanilla CSS) & React-Bootstrap
- **Database**: MySQL/MariaDB
- **Icons**: React Icons (Feather Icons)
- **Charts**: Recharts

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TeamTask-Pro.git
   cd TeamTask-Pro
   ```

2. **Backend Setup**:
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   ```

3. **Frontend Setup**:
   ```bash
   npm install
   npm run dev
   ```

4. **Environment Configuration**:
   Update your `.env` file with your database credentials.

## 📸 Screenshots

*(Add screenshots here to wow your interviewer!)*

## 📄 License

This project is open-source and licensed under the [MIT license](LICENSE).
