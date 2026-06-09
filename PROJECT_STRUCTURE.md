# Mentor LMS - Project Structure

This document provides a detailed overview of the Mentor LMS project structure, organized by directories and their purposes.

## Root Directory Structure

```
mentor-lms/
├── .github/                 # GitHub workflows and configurations
├── Modules/                 # Laravel modules (Blog, Exam, Installer, PaymentGateways, Updater)
├── app/                     # Main Laravel application code
├── bootstrap/               # Laravel bootstrap files
├── config/                  # Laravel configuration files
├── database/                # Database migrations, seeders, and factories
├── docker/                  # Docker configuration files
├── lang/                    # Laravel language files
├── public/                  # Publicly accessible files (entry point)
├── resources/               # Views, frontend assets, and resources
├── routes/                  # Laravel route definitions
├── storage/                 # Laravel storage directory
├── tests/                   # Test files
├── vendor/                  # Composer dependencies
├── .env                     # Environment configuration
├── .env.example             # Example environment configuration
├── .gitignore               # Git ignore rules
├── artisan                  # Laravel CLI tool
├── composer.json            # PHP dependencies
├── package.json             # Node.js dependencies
├── README.md                # Main project documentation
├── vite.config.ts           # Vite configuration for frontend
└── ...                      # Other configuration files
```

## Core Directories

### `app/` - Main Application Code

```
app/
├── Enums/                   # PHP enumerations for various types
├── Helpers/                 # Helper functions
├── Http/
│   ├── Controllers/         # Laravel controllers
│   ├── Middleware/          # HTTP middleware
│   └── Requests/            # Form request validation
├── Mail/                    # Mailable classes
├── Models/                  # Eloquent models
├── Notifications/           # Notification classes
├── Providers/               # Service providers
└── Services/                # Custom services and business logic
```

### `resources/` - Frontend and Views

```
resources/
├── css/                     # CSS stylesheets
├── js/                      # JavaScript/TypeScript code
│   ├── app.tsx              # Main application entry point
│   ├── components/          # Reusable React components
│   ├── data/                # Static data files
│   ├── hooks/               # Custom React hooks
│   ├── icons/               # Icon components
│   ├── layouts/             # Page layouts
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Page components organized by section
│   │   ├── auth/            # Authentication pages
│   │   ├── blogs/           # Blog pages
│   │   ├── cart/            # Shopping cart pages
│   │   ├── course-player/   # Course player components
│   │   ├── courses/         # Course listing and details
│   │   ├── dashboard/       # Admin/instructor dashboard
│   │   ├── inner/           # Inner pages
│   │   ├── installer/       # Installation wizard
│   │   ├── instructors/     # Instructor profiles
│   │   ├── intro/           # Homepage and landing pages
│   │   ├── job-circulars/   # Job listings
│   │   ├── notification/    # Notification system
│   │   └── student/         # Student dashboard
│   ├── ssr.tsx              # Server-side rendering entry
│   └── types/               # TypeScript type definitions
└── views/                   # Laravel Blade templates
```

### `Modules/` - Laravel Modules

```
Modules/
├── Blog/                    # Blog module
├── Installer/               # Installation module
├── PaymentGateways/         # Payment gateway integrations
└── Updater/                 # System update functionality
```

### `routes/` - Route Definitions

```
routes/
├── admin.php                # Admin-specific routes
├── auth.php                 # Authentication routes
├── instructor.php           # Instructor-specific routes
├── payout.php               # Payout system routes
├── student.php              # Student-specific routes
├── web.php                  # Main web routes
└── console.php              # Console/Artisan command routes
```

### `database/` - Database Management

```
database/
├── migrations/              # Database migration files
├── seeders/                 # Database seeders
└── factories/               # Model factories for testing
```

### `lang/` and `storage/app/lang/` - Language Files

```
lang/
└── en/                      # English language files
    ├── auth.php             # Authentication messages
    ├── button.php           # Button text translations
    ├── common.php           # Common terms
    ├── dashboard.php        # Dashboard-specific translations
    ├── frontend.php         # Frontend translations
    ├── input.php            # Input placeholders and labels
    ├── settings.php         # Settings page translations
    └── ...

storage/app/lang/
├── default/                 # Default language files
└── groups/                  # Group-specific language files
```

### `public/` - Public Assets

```
public/
├── assets/                  # Compiled assets
├── build/                   # Vite build output
├── script/                  # JavaScript scripts
├── index.php                # Laravel entry point
└── ...                      # Images, favicons, etc.
```
