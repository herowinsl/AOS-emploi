# AOS-emploi

A professional web application for employment services and member management built with modern React technologies.

## Project Overview

**AOS-emploi** is a comprehensive employment services platform designed to provide information about employment services, news/updates (actualités), and a protected member dashboard (espace-adherent). The application features multi-page routing, authentication, and various interactive components.

### Key Features

- **Public Pages**: Home, Services, News (Actualités), Contact, About sections
- **Service Details**: Detailed pages for each service offering
- **News Management**: Blog-style news/actualités with detail pages
- **Member Dashboard**: Protected area for authenticated users (espace-adherent)
- **Authentication**: Login/Registration system with protected routes
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Multi-language Support**: Language context for internationalization
- **Modern UI Components**: Custom components and UI elements with Flowbite integration

## Technology Stack

### Frontend Framework & Build Tools
- **React** 18.3.1 - UI library for building interactive interfaces
- **Vite** 5.4.21 - Fast build tool and development server (ES modules)
- **React Router DOM** 7.14.0 - Client-side routing and navigation

### Styling & UI
- **Tailwind CSS** 3.4 - Utility-first CSS framework
- **Flowbite** 4.0.1 - UI component library
- **Flowbite React** 0.12.17 - React components for Flowbite
- **Tailwind Typography** 0.5.19 - Typography plugin for Tailwind
- **PostCSS** 8.5.9 - CSS transformation tool

### Animation & Motion
- **Framer Motion** 11.18.2 - Animation library for React components
- **Motion** 12.38.0 - Additional motion library

### Icons & UI Libraries
- **Lucide React** 1.7.0 - Icon library with React components
- **Huge Icons (Core Free)** 4.1.1 - Additional icon set
- **Huge Icons React** 1.1.6 - React wrapper for Huge Icons

### Form & HTTP
- **React Hook Form** 7.72.1 - Lightweight form state management
- **Axios** 1.14.0 - HTTP client for API requests
- **Sonner** 2.0.7 - Toast notifications

### Development Tools
- **ESLint** 9.39.4 - Code quality and linting
- **ESLint Plugin React Hooks** 7.0.1 - React hooks linting rules
- **ESLint Plugin React Refresh** 0.5.2 - Fast refresh linting
- **Autoprefixer** 10.4.27 - CSS vendor prefix automation
- **TypeScript** (types) - Type definitions for React

## Project Structure

```
src/
├── pages/                    # Main page components
│   ├── HomePage.jsx
│   ├── ServicesPage.jsx
│   ├── ServiceDetailPage.jsx
│   ├── ActualitiesPage.jsx
│   ├── ActualitiesDetailPage.jsx
│   ├── ContactPage.jsx
│   ├── AuthPage.jsx
│   ├── EspaceAdherentPage.jsx
│   └── NotFoundPage.jsx
├── components/
│   ├── Home/                # Homepage sections
│   │   ├── HeroSection.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── ActualitesSection.jsx
│   │   └── ...
│   ├── auth/                # Authentication components
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Field.jsx
│   ├── layout/              # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── PageWrapper.jsx
│   ├── services/            # Service display components
│   │   └── ServiceCard.jsx
│   ├── actualities/         # News components
│   │   ├── PostCard.jsx
│   │   └── PostList.jsx
│   ├── espace-adherent/     # Member dashboard components
│   │   ├── DashboardSidebar.jsx
│   │   ├── ProfileSection.jsx
│   │   ├── OverviewSection.jsx
│   │   └── DocumentsSection.jsx
│   ├── common/              # Reusable common components
│   │   ├── Button.jsx
│   │   ├── SectionTitle.jsx
│   │   ├── ErrorBanner.jsx
│   │   └── ...
│   └── ui/                  # UI utility components
├── context/
│   ├── AuthContext.jsx      # Authentication state management
│   └── LangContext.jsx      # Language/internationalization context
├── hooks/
│   ├── useAuth.js          # Authentication hook
│   ├── usePosts.js         # News/posts hook
│   ├── useServices.js      # Services hook
│   ├── usePostDetail.js    # Single post detail hook
│   └── usePage.js          # Page utilities hook
├── services/
│   ├── api.js              # General API calls
│   ├── authAPI.js          # Authentication API calls
├── data/
│   ├── servicesDetails.js  # Services data
│   └── cadreAssociatifContent.js
├── mocks/
│   └── actualities.js      # Mock data for news
├── routes/
│   └── index.jsx           # Route definitions
├── lib/
│   └── utils.js            # Utility functions
├── App.jsx                 # Main app component
└── main.jsx                # Entry point
```

## Development Workflow

### Prerequisites
- Node.js 16+ (or compatible version)
- npm, yarn, pnpm, or bun package manager

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` with Hot Module Replacement (HMR) enabled for instant updates during development.

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

### Code Quality

```bash
npm run lint
```

Runs ESLint to check code quality and enforce linting rules.

## Key Architecture Decisions

### Authentication Flow
- Custom authentication system with Context API for state management
- Protected routes using `ProtectedRoute` component
- Axios-based API calls for login/registration
- Auth context provides user state across the application

### State Management
- **React Context API** for global state:
  - `AuthContext` - User authentication and authorization
  - `LangContext` - Language/internationalization support
- **React Hook Form** for form state management
- Custom hooks for data fetching (usePosts, useServices, etc.)

### Routing
- Client-side routing with React Router v7
- Protected routes for authenticated-only pages
- Nested routing for about sections
- Dynamic slug-based routing for services and news details

### Styling Approach
- **Tailwind CSS** for responsive utility-first styling
- Custom component library integration with Flowbite
- Consistent spacing and color scales
- Mobile-first responsive design

### API Integration
- **Axios** for HTTP requests
- Separate API modules:
  - `authAPI.js` - Authentication endpoints
  - `api.js` - General API endpoints
- Mock data fallback for development

### Component Architecture
- Functional components with hooks
- Separation of concerns: Pages, Components, Layouts
- Reusable common components (`/common` folder)
- UI-specific components (`/ui` folder)
- Feature-specific components organized by domain

## Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory if needed for:
- API endpoints
- Authentication tokens
- Third-party service keys

## Performance Considerations

- **Vite** for fast development and optimized production builds
- **React Fast Refresh** for instant component updates
- Efficient routing with lazy loading opportunities
- Optimized bundle size with tree-shaking

## Future Development Areas

- Backend API integration (currently uses mock data)
- Advanced member dashboard features
- Document management system for members
- Email notifications and alerts
- Analytics and reporting

## Contributing

When contributing to this project:
1. Follow the existing code structure and component organization
2. Use React hooks and functional components
3. Maintain consistency with the Tailwind CSS styling approach
4. Ensure all new components are responsive
5. Test authentication flows thoroughly

## License

[Add your license information here]

## Contact & Support

For questions or support regarding AOS-emploi, contact the development team.

---

**Last Updated**: April 2026
**Version**: 0.0.0
