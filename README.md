# RFQ Admin Dashboard

A modern React-based admin dashboard for RFQ (Request for Quote) management, built with TypeScript and Material-UI.

## 🚀 Tech Stack

### Core Technologies

- **Framework**: React 18+ with TypeScript
- **Routing**: React Router v6
- **State Management**: Redux Toolkit + RTK Query
- **UI Library**: Material-UI (MUI) v5
- **Styling**: Styled Components / Emotion CSS-in-JS
- **Build Tool**: Vite
- **Package Manager**: pnpm

### Additional Libraries

- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Date Handling**: Day.js
- **HTTP Client**: Axios (with RTK Query)
- **Authentication**: JWT handling with secure storage
- **Notifications**: React Hot Toast
- **Tables**: TanStack Table v8
- **File Upload**: React Dropzone

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd RFQ-Admin
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_NODE_ENV=development
   VITE_ENABLE_ANALYTICS=false
   VITE_ENABLE_DEBUG=true
   ```

4. **Start the development server**

   ```bash
   pnpm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Header, Sidebar)
│   └── ProtectedRoute.tsx
├── hooks/              # Custom React hooks
│   └── redux.ts        # Typed Redux hooks
├── pages/              # Page components
│   ├── Login.tsx
│   └── Dashboard.tsx
├── store/              # Redux store configuration
│   ├── api/           # RTK Query API slices
│   ├── slices/        # Redux slices
│   └── index.ts       # Store configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── constants.ts
│   └── validation.ts
├── App.tsx
└── main.tsx
```

## 🔧 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## 🎨 Features

- **Authentication**: JWT-based authentication with protected routes
- **Responsive Design**: Mobile-first responsive design with Material-UI
- **State Management**: Centralized state management with Redux Toolkit
- **Form Validation**: Robust form validation with React Hook Form + Zod
- **Data Visualization**: Interactive charts with Recharts
- **Type Safety**: Full TypeScript support throughout the application
- **Modern UI**: Clean, modern interface with Material-UI components

## 🔐 Authentication

The application includes a complete authentication system that integrates with the RFQ Admin API. Features include:

### Login System

- **Real API Integration**: Connects to the actual RFQ Admin API endpoints
- **Form Validation**: Robust validation using React Hook Form + Zod
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Visual feedback during authentication processes
- **Password Visibility Toggle**: Show/hide password functionality

### Password Recovery

- **Forgot Password**: Email-based password reset
- **OTP Verification**: 6-digit OTP verification system
- **Step-by-step Process**: Guided password reset flow
- **Secure Reset**: Multi-step verification for security

### Demo Credentials

To test the application:

1. Navigate to the login page
2. Use the pre-filled demo credentials:
   - **Email**: admin@rfq.com
   - **Password**: AdminPassword123!
3. Click "Sign In" to access the dashboard

### API Endpoints Used

- `POST /auth/login` - Admin login
- `GET /auth/profile` - Get admin profile
- `POST /auth/forgot-password` - Send OTP for password reset
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Reset password with OTP
- `POST /auth/logout` - Admin logout

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deployment

1. **Build the application**

   ```bash
   pnpm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
