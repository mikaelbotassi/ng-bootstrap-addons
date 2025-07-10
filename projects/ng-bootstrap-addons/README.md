# NgBootstrap Addons

A modern and comprehensive Angular library that provides components, directives, and utilities to accelerate enterprise application development. Created to work perfectly with Bootstrap 5 and ngx-bootstrap, this library provides ready-to-use components with consistent design and high quality.

[![npm version](https://badge.fury.io/js/ng-bootstrap-addons.svg)](https://www.npmjs.com/package/ng-bootstrap-addons)
[![GitHub](https://img.shields.io/github/license/mikaelbotassi/ng-bootstrap-addons)](https://github.com/mikaelbotassi/ng-bootstrap-addons/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mikaelbotassi/ng-bootstrap-addons)](https://github.com/mikaelbotassi/ng-bootstrap-addons/stargazers)

## 🚀 Version

> **📌 Versioning Strategy**: Our library follows Angular's major version releases. Version 19.x is compatible with Angular 19+, version 20.x will be compatible with Angular 20+, and so on.

## 🎯 Demo Application

🌟 **Try it live!** We've created a comprehensive demo application that showcases all components and their features:

### Running the Demo
```bash
# Clone the repository
git clone https://github.com/mikaelbotassi/ng-bootstrap-addons.git

# Install dependencies
npm install

# Start the demo application
npm start
```

The demo application includes:
- **📋 Interactive examples** of all components
- **🎨 Live customization** options
- **📖 Usage documentation** and code examples
- **🔧 Form integration** examples
- **♿ Accessibility** demonstrations
- **📱 Responsive** design showcases

### Demo Features
- **Component Gallery**: Browse all available components with live examples
- **Interactive Playground**: Test component properties and see real-time changes
- **Code Snippets**: Copy-paste ready code examples for each component
- **Form Integration**: See how components work with Angular Reactive Forms
- **Accessibility Testing**: Validate ARIA compliance and keyboard navigation
- **Theme Customization**: Preview different Bootstrap themes and customizations

## 📋 Table of Contents

- [Demo Application](#-demo-application)
- [Features](#-features)
- [Main Use Cases](#-main-use-cases)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration and Customization](#-configuration-and-customization)
- [Components](#-components)
- [Directives](#-directives)
- [Pipes](#-pipes)
- [Utilities](#-utilities)
- [Testing](#-testing)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

## ✨ Features

- **🎯 Production Ready**: Tested and optimized components with comprehensive unit tests
- **📱 Responsive**: Mobile-first design with Bootstrap 5 integration
- **🔧 TypeScript**: Fully typed for better development experience
- **🎨 Customizable**: Easily customizable styles with CSS variables and SCSS
- **♿ Accessible**: ARIA support and accessibility standards compliance
- **🧪 Well Tested**: Comprehensive unit test coverage (95%+)
- **📦 Tree-shakable**: Only necessary code is included in the bundle
- **🔄 Reactive Forms**: Native integration with Angular Reactive Forms
- **🌐 Internationalization**: Support for multiple locales (pt-BR, en-US)
- **🎭 Custom Icons**: Dependency-free SVG icons using CSS masks
- **📋 Floating Labels**: Bootstrap 5 floating labels support
- **🔍 Advanced Search**: Flexible autocomplete with remote data sources

## 🎯 Main Use Cases

This library was specially created for:

- **📋 Forms with Elegant UI**: Create beautiful and functional forms quickly
- **🔧 Complement to ngx-bootstrap**: Fill gaps and add missing functionalities in ngx-bootstrap
- **🚀 Enterprise Applications**: Robust components for complex systems
- **⚡ Rapid Development**: Accelerate development with ready-made components
- **🎨 Visual Consistency**: Maintain consistent design throughout the application

> **💡 Tip**: This library is the perfect complement for those who already use ngx-bootstrap and want a more complete and modern UI.

## 📦 Installation

```bash
npm install ng-bootstrap-addons
```

> **📌 Note**: Use the version that matches your Angular version. For Angular 19+, use ng-bootstrap-addons 19.x.

### Required Dependencies

```bash
npm install @angular/cdk@^19.2.10 ngx-bootstrap@^19.0.2 ngx-mask@^19.0.6 bootstrap@^5.3.3
```

## 🚀 Quick Start

### Standalone Components (Recommended)

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { InputComponent } from 'ng-bootstrap-addons/inputs';
import { SelectComponent } from 'ng-bootstrap-addons/selects';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputComponent, SelectComponent],
  template: `
    <nba-input 
      [label]="'Name'" 
      [(ngModel)]="name"
      [required]="true">
    </nba-input>
    
    <nba-select 
      [label]="'Category'" 
      [options]="categories"
      [(ngModel)]="selectedCategory">
    </nba-select>
  `
})
export class AppComponent {
  name = '';
  selectedCategory = '';
  categories = [
    { value: '1', label: 'Category 1' },
    { value: '2', label: 'Category 2' }
  ];
}
```

### Module-based Setup

```typescript
import { NgBootstrapAddonsModule } from 'ng-bootstrap-addons';

@NgModule({
  imports: [
    NgBootstrapAddonsModule,
    // other imports...
  ],
})
export class AppModule { }
```

### 📋 Version Compatibility Matrix

| ng-bootstrap-addons | Angular | ngx-bootstrap | ngx-mask | Bootstrap | Status |
|:-------------------:|:-------:|:-------------:|:--------:|:---------:|:------:|
| **19.0.1** | 19.x | 19.x | 19.x | 5.3+ | ✅ **Current** |
| **19.1.x** | 19.x | 19.x | 19.x | 5.3+ | 🔄 **Next** |
| **20.x** | 20.x | 20.x | 20.x | 5.3+ | 🔄 **Planned** |

> **💡 Strategy**: We maintain major version alignment with Angular. When Angular releases version X, we release ng-bootstrap-addons version X to ensure compatibility and leverage the latest features.

## 🎨 Configuration and Customization

### Theme Customization

This library uses **Bootstrap 5.3+** as a base and provides custom CSS variables for enhanced theming:

```scss
// styles.scss or in your main styles file

// Customize Bootstrap variables
:root {
  --bs-primary: #your-primary-color;
  --bs-secondary: #your-secondary-color;
  --bs-success: #your-success-color;
  // ... other variables
}

// Custom library variables
:root {
  --nba-input-border-radius: 0.375rem;
  --nba-input-focus-color: #0d6efd;
  --nba-error-color: #dc3545;
  --nba-success-color: #198754;
}
```

### Icons Configuration

The library now uses **dependency-free SVG icons** implemented with CSS masks:

```scss
// No external dependencies required!
// Icons are built-in and use currentColor for theming
.eye-icon {
  color: var(--bs-primary); // Will inherit your theme colors
}
```

### Locale Configuration

```typescript
// app.config.ts
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localePt);
registerLocaleData(localeEn);

// For date pickers
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
defineLocale('pt-br', ptBrLocale);
```

## 🧩 Components

> **� Tip**: All components support Bootstrap 5 floating labels, reactive forms integration, and accessibility features.

### 📭 Empty Data Component

Display elegant empty states with customizable SVG illustrations.

```html
<nba-empty-data 
  [title]="'No Records Found'" 
  [subtitle]="'Try adjusting your search criteria'">
</nba-empty-data>
```

**Features:**
- Built-in SVG illustrations
- Customizable titles and messages
- Responsive design
- Bootstrap styling integration

### 📎 Drag & Drop Upload Component

Modern file upload component with drag & drop functionality.

```html
<nba-drag-drop-upload
  [acceptedTypes]="['.pdf', '.jpg', '.png']"
  [maxFileSize]="5242880"
  [multiple]="true"
  (onFilesSelected)="handleFiles($event)">
</nba-drag-drop-upload>
```

**Features:**
- Drag & drop interface
- File type validation
- Size limit enforcement
- Progress tracking
- Multiple file support

### ❌ Form Error Message Component

Automatic display of form validation errors with internationalization support.

```html
<nba-form-error-message 
  [control]="userForm.get('email')">
</nba-form-error-message>
```

**Features:**
- Automatic error detection
- Custom error messages
- Internationalization ready
- Bootstrap styling

### 🔍 AutoComplete Search Component

Advanced autocomplete with flexible API integration and modal support.

```html
<nba-ac-search-lov
  [acUrl]="'api/users/search'"
  [acParams]="searchParams"
  [displayField]="'name'"
  [valueField]="'id'"
  [(ngModel)]="selectedUser"
  [required]="true">
</nba-ac-search-lov>
```

**Features:**
- Flexible API integration (query, body, or path params)
- Modal for multiple results
- Debounced search
- Keyboard navigation
- Custom result templates

### 📅 DateTime Range Picker Component

Date range selector with Bootstrap floating labels and locale support.

```html
<nba-datetime-range-input
  [label]="'Select Period'"
  [customConfigs]="dateConfigs"
  [(ngModel)]="dateRange"
  [required]="true">
</nba-datetime-range-input>
```

**Features:**
- Bootstrap 5 floating labels
- pt-BR and en-US locale support
- Time selection support
- Custom date formats
- Validation integration

### 📝 Enhanced Input Component

Versatile input with password toggle, masks, and floating labels.

```html
<nba-input
  [label]="'Password'"
  [type]="'password'"
  [required]="true"
  [showPasswordToggle]="true"
  [(ngModel)]="password">
</nba-input>
```

**Features:**
- Password visibility toggle with custom SVG icons
- Input masking support
- Bootstrap floating labels
- Real-time validation
- Multiple input types

### 📝 Input Placeholder Component

Simple input with placeholder functionality.

```html
<nba-input-placeholder
  [placeholder]="'Enter your name'"
  [(ngModel)]="name">
</nba-input-placeholder>
```

### 🔄 Switch Component

Modern toggle switch with smooth animations.

```html
<nba-switch
  [label]="'Enable notifications'"
  [(ngModel)]="notificationsEnabled"
  [disabled]="false">
</nba-switch>
```

**Features:**
- Smooth animations
- Disabled state support
- Bootstrap integration
- Accessibility compliant

### 📋 Select Component

Enhanced dropdown with search and Bootstrap floating labels.

```html
<nba-select
  [label]="'Choose Category'"
  [options]="categories"
  [valueField]="'id'"
  [displayField]="'name'"
  [required]="true"
  [(ngModel)]="selectedCategory">
</nba-select>
```

**Features:**
- Search functionality
- Bootstrap floating labels
- Custom value/display fields
- Validation support
- Keyboard navigation

### ☑️ Multiselect Component

Advanced multiselect with checkboxes and batch operations.

```html
<nba-multiselect
  [label]="'Select Options'"
  [options]="options"
  [showSelectAll]="true"
  [(ngModel)]="selectedOptions"
  [required]="true">
</nba-multiselect>
```

**Features:**
- Checkbox-based selection
- Select all/none functionality
- Custom SVG icons (circle, circle-dot, circle-check)
- Tag-based display
- Search filtering

### 📄 Textarea Component

Enhanced textarea with Bootstrap floating labels and validation.

```html
<nba-textarea
  [label]="'Comments'"
  [rows]="4"
  [maxLength]="500"
  [required]="true"
  [(ngModel)]="comments">
</nba-textarea>
```

**Features:**
- Bootstrap floating labels
- Character counting
- Auto-resize functionality
- Validation integration
- Customizable rows

### 🏷️ Label Component

Customizable label with required field indicators.

```html
<nba-label
  [for]="'username'"
  [required]="true"
  [text]="'Username'">
</nba-label>
```

**Features:**
- Required field asterisk
- Bootstrap styling
- Accessibility support
- Custom styling options

## 🎯 Directives

### 🖱️ Click Outside

Detects clicks outside the element for dropdowns and modals.

```html
<div clickOutside (clickedOutside)="closeModal()">
  <!-- modal content -->
</div>
```

### 🎛️ Control Value Accessor

Base directive for seamless Angular Forms integration.

```html
<input controlValueAccessor [(ngModel)]="value">
```

### 💰 Currency Directive

Automatic formatting of monetary values with real-time updates.

```html
<input currency 
  [hasCurrency]="true" 
  [decimalPlaces]="2" 
  [(ngModel)]="amount">
```

**Features:**
- Real-time currency formatting
- Configurable decimal places
- Initial value formatting
- Form integration

### 🔒 Input Password Directive

Password visibility toggle with custom SVG icons.

```html
<input type="password" input-password>
```

**Features:**
- Eye/eye-off SVG icons using CSS masks
- Smooth toggle animations
- Focus/blur behavior
- No external dependencies

## 🔧 Pipes

### 🔢 Numeric Pipe

Advanced number formatting.

```html
{{ value | numeric:'1.2-2':'pt-BR' }}
```

## 🛠️ Utilities

### 📅 DateUtils

Comprehensive date manipulation utilities with locale support.

```typescript
import { DateUtils } from 'ng-bootstrap-addons/utils';

// Format dates
const formatted = DateUtils.formatDate(new Date(), 'DD/MM/YYYY');

// Parse Brazilian dates
const brazilianDate = DateUtils.fromBrazilianDate('25/12/2024');

// Parse US dates
const usDate = DateUtils.fromUSDate('12/25/2024');

// Get locale-specific format
const format = DateUtils.getDateFormat('pt-BR'); // 'DD/MM/YYYY'
const format2 = DateUtils.getDateFormat('en-US'); // 'MM/DD/YYYY'
```

**Features:**
- Multi-locale support (pt-BR, en-US)
- Date parsing and formatting
- Timezone handling
- Validation utilities

### 📄 File Utilities

Comprehensive file manipulation functions.

```typescript
import { fileToBlob, convertBlobToFile } from 'ng-bootstrap-addons/utils';

// Convert file to blob
const blob = await fileToBlob(file);

// Convert blob to file
const convertedFile = convertBlobToFile({
  nome: 'document.pdf', 
  item: blobData
});
```

### 🔧 Command Pattern

Async operation management with the Command pattern.

```typescript
import { Command1 } from 'ng-bootstrap-addons/utils';

const command = new Command1<ResultType, ParamsType>((params) => 
  this.service.getData(params)
);

// Execute command
const result = await command.execute(params);
```

## 🧪 Testing

The library maintains **95%+ test coverage** with comprehensive unit tests covering:

### Test Coverage Areas
- **Components**: Rendering, interaction, and integration tests
- **Directives**: Behavior validation and DOM manipulation
- **Services**: Business logic and API integration
- **Pipes**: Data transformation accuracy
- **Utilities**: Helper function reliability

### Running Tests

```bash
# Run all tests
ng test

# Run tests with coverage
ng test --code-coverage

# Run specific component tests
ng test --include="**/empty-data.component.spec.ts"

# Run tests in watch mode
ng test --watch
```

### Test Quality Metrics
- ✅ **95%+ Code Coverage**: Comprehensive test coverage
- ✅ **Unit Tests**: Isolated component testing
- ✅ **Integration Tests**: Component interaction validation
- ✅ **Accessibility Tests**: ARIA compliance verification
- ✅ **Form Integration**: Reactive forms validation
- ✅ **Error Handling**: Edge case coverage
- ✅ **Performance**: Load and stress testing

### Demo Application Testing
The demo application serves as a comprehensive integration test suite:

```bash
# Run demo application
npm start

# Test all components interactively
# Verify responsive behavior
# Validate accessibility features
# Test form integrations
```

## 🚀 Development

### Development Environment Setup

```bash
# Clone the repository
git clone https://github.com/mikaelbotassi/ng-bootstrap-addons.git
cd ng-bootstrap-addons

# Install dependencies
npm install

# Start development server with demo
npm start
```

### Demo Application Development

The demo application showcases all components and serves as a development playground:

```bash
# Start demo application
npm start

# The demo runs on http://localhost:4200
# Features live reload for development
# Includes all component examples
```

### Library Development

```bash
# Build the library
ng build ng-bootstrap-addons

# Run tests
ng test

# Run tests with coverage
ng test --code-coverage

# Build for production
ng build ng-bootstrap-addons --configuration production
```

### Development Tools

- **Hot Reload**: Instant updates during development
- **Source Maps**: Full debugging support
- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with Angular rules
- **Testing**: Karma + Jasmine setup
- **Coverage**: Istanbul code coverage reports

### Project Structure

```
ng-bootstrap-addons/
├── projects/
│   ├── ng-bootstrap-addons/          # Main library
│   │   ├── components/               # UI components
│   │   ├── directives/              # Utility directives
│   │   ├── inputs/                  # Input components
│   │   ├── selects/                 # Selection components
│   │   ├── pipes/                   # Data transformation
│   │   ├── services/                # Business logic
│   │   ├── utils/                   # Utilities
│   │   ├── textarea/                # Textarea component
│   │   ├── drag-drop-upload/        # File upload
│   │   ├── form-error-message/      # Error handling
│   │   ├── label/                   # Label component
│   │   └── src/tests/               # Unit tests
│   └── demo/                        # Demo application
│       └── src/app/
│           ├── components/          # Demo components
│           └── containers/          # Demo containers
├── README.md                        # This file
└── package.json                     # Project configuration
```

### Publishing

```bash
# Build the library
ng build ng-bootstrap-addons

# Navigate to dist directory
cd dist/ng-bootstrap-addons

# Publish to npm
npm publish
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Standards

- Use TypeScript strict mode
- Follow Angular Style Guide conventions
- Write tests for new features
- Use Conventional Commits
- Keep documentation updated

## 📋 Roadmap

### Version 19.0.x (Current)
- [x] 🎨 Bootstrap 5 floating labels integration
- [x] � Dependency-free SVG icons using CSS masks
- [x] �🌐 Enhanced i18n support (pt-BR, en-US)
- [x] 📱 Mobile-first responsive design
- [x] ♿ Improved accessibility features
- [x] 🧪 95%+ test coverage
- [x] 📋 Comprehensive demo application
- [ ] 🔍 Advanced search and filtering
- [ ] 🎨 Theme customization tools
- [ ] 📊 Performance optimizations

> **💡 Note**: We follow Angular's release schedule. Major versions are released every 6 months to ensure compatibility with the latest Angular features.

## 🔗 Useful Links

- 🌐 [**Live Demo Application**](https://ng-bootstrap-addons-demo.netlify.app/) - Interactive component showcase
- 📦 [NPM Package](https://www.npmjs.com/package/ng-bootstrap-addons)
- 🐙 [GitHub Repository](https://github.com/mikaelbotassi/ng-bootstrap-addons)
- 📖 [Complete Documentation](https://github.com/mikaelbotassi/ng-bootstrap-addons#readme)
- 🐛 [Report Issues](https://github.com/mikaelbotassi/ng-bootstrap-addons/issues)
- 💡 [Feature Requests](https://github.com/mikaelbotassi/ng-bootstrap-addons/issues/new)
- 🎯 [Development Guide](https://github.com/mikaelbotassi/ng-bootstrap-addons/wiki/Development-Guide)
- 🧪 [Testing Guide](https://github.com/mikaelbotassi/ng-bootstrap-addons/wiki/Testing-Guide)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Mikael Botassi de Oliveira

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 👨‍💻 Author

**Mikael Botassi de Oliveira**

- Full Stack Developer specialized in Angular and Node.js
- Creator of NgBootstrap Addons library
- Focused on creating solutions that accelerate enterprise application development

### Contact

- 📧 Email: [mikaelbotassi@gmail.com](mailto:mikaelbotassi@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/mikaelbotassi](https://www.linkedin.com/in/mikaelbotassi/)
- 🐙 GitHub: [github.com/mikaelbotassi](https://github.com/mikaelbotassi)

---

## 🙏 Acknowledgments

Special thanks to:

- Angular team for the excellent framework
- ngx-bootstrap community for the base components that inspired this library
- Bootstrap community for the robust CSS framework
- Open source community for contributions and feedback
- Developers who use and test this library in real applications
- All contributors and users of this library

---

⭐ **If this library was useful to you, consider giving it a star on [GitHub](https://github.com/mikaelbotassi/ng-bootstrap-addons)!**

---

*Last updated: July 2025*