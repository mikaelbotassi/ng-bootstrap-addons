# NgBootstrap Addons

A modern and comprehensive Angular library that provides components, directives, and utilities to accelerate enterprise application development. Created to work perfectly with Bootstrap 5 and ngx-bootstrap, this library provides ready-to-use components with consistent design and high quality.

[![npm version](https://badge.fury.io/js/ng-bootstrap-addons.svg)](https://www.npmjs.com/package/ng-bootstrap-addons)
[![GitHub](https://img.shields.io/github/license/mikaelbotassi/ng-bootstrap-addons)](https://github.com/mikaelbotassi/ng-bootstrap-addons/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/mikaelbotassi/ng-bootstrap-addons)](https://github.com/mikaelbotassi/ng-bootstrap-addons/stargazers)

## 🚀 Version

**v2.0.0** - Compatible with Angular 18+ | **We recommend version 2.0+**

## 📋 Table of Contents

- [Features](#-features)
- [Main Use Cases](#-main-use-cases)
- [Installation](#-installation)
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

- **🎯 Production Ready**: Tested and optimized components
- **📱 Responsive**: Mobile-first design with Bootstrap 5
- **🔧 TypeScript**: Fully typed for better development experience
- **🎨 Customizable**: Easily customizable styles
- **♿ Accessible**: ARIA support and accessibility standards
- **🧪 Tested**: Comprehensive unit test coverage
- **📦 Tree-shakable**: Only necessary code is included in the bundle
- **🔄 Reactive Forms**: Native integration with Angular Reactive Forms

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

> **📌 Note**: For the best experience, we recommend using version 2.0+ of the library.

### Required Dependencies

```bash
npm install @angular/cdk@>=18.0.0 ngx-bootstrap@>=18.0.0 ngx-mask@>=18.0.0 bootstrap@^5.2.0
```

### AppModule Configuration

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

## 🎨 Configuration and Customization

### Theme Customization

This library uses **Bootstrap 5.2** as a base. To customize your application theme, simply customize Bootstrap CSS variables:

```scss
// styles.scss or in your main styles file

// Customize Bootstrap variables
:root {
  --bs-primary: #your-primary-color;
  --bs-secondary: #your-secondary-color;
  --bs-success: #your-success-color;
  // ... other variables
}

// Or using SCSS
$primary: #your-primary-color;
$secondary: #your-secondary-color;

@import '~bootstrap/scss/bootstrap';
```

### Icons Configuration

The library uses **Tabler Icons**. To include them:

```html
<!-- In your index.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons-sprite.svg">
```

### Advanced Configuration

```typescript
// For specific component configurations
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';

// Locale configuration for dates (pt-BR)
defineLocale('pt-br', ptBrLocale);
```

## 🧩 Components

### 🔍 AutoComplete LOV (List of Values)

Advanced component that combines autocomplete functionalities with list of values selection.

```html
<nba-ac-lov
  [acUrl]="'api/users/search'"
  [acParams]="searchParams"
  [map]="mapConfig"
  [(ngModel)]="selectedUser"
  [required]="true">
</nba-ac-lov>
```

**Features:**
- Dynamic API search
- Modal for multiple results
- Support for additional fields (addons)
- Integrated validation
- Virtualization for large lists

### 📅 DateTime Range Picker

Date interval selector with integrated time support.

```html
<nba-datetime-range-input
  [label]="'Period'"
  [icon]="'ti-calendar'"
  [customConfigs]="dateConfigs"
  [(ngModel)]="dateRange">
</nba-datetime-range-input>
```

**Features:**
- Date range selection
- Time support
- Pre-defined ranges (Today, Last 7 days, etc.)
- Brazilian formatting
- Interval validation

### 📝 Input Component

Versatile input field with multiple functionalities.

```html
<nba-input
  [label]="'Name'"
  [icon]="'ti-user'"
  [type]="'text'"
  [mask]="'000.000.000-00'"
  [required]="true"
  [(ngModel)]="name">
</nba-input>
```

**Features:**
- Mask support (CPF, CNPJ, phone, etc.)
- Currency fields
- Password fields with toggle
- Real-time validation
- Animated placeholders

### 🔄 Switch Component

Modern and accessible switch/toggle component.

```html
<nba-switch
  [label]="'Active'"
  [(ngModel)]="isActive">
</nba-switch>
```

### 📋 Select Component

Custom dropdown with search and multiple options.

```html
<nba-select
  [label]="'Category'"
  [options]="categories"
  [valueKey]="'id'"
  [displayKey]="'name'"
  [(ngModel)]="selectedCategory">
</nba-select>
```

### ☑️ Multiselect Component

Multiple selection with advanced controls.

```html
<nba-multiselect
  [label]="'Profiles'"
  [options]="profiles"
  [showSelectAll]="true"
  [(ngModel)]="selectedProfiles">
</nba-multiselect>
```

### 📄 Textarea Component

Text area with resizing and validation.

```html
<nba-textarea
  [label]="'Notes'"
  [rows]="5"
  [(ngModel)]="notes">
</nba-textarea>
```

### 📎 Drag & Drop Upload

Component for file upload with drag & drop.

```html
<nba-drag-drop-upload
  [acceptedTypes]="['.pdf', '.jpg', '.png']"
  [maxFileSize]="5242880"
  (onFilesSelected)="handleFiles($event)">
</nba-drag-drop-upload>
```

### ❌ Form Error Message

Automatic display of form error messages.

```html
<nba-form-error-message
  [control]="formControl">
</nba-form-error-message>
```

### 📭 Empty Data

Component for empty states with SVG illustration.

```html
<nba-empty-data></nba-empty-data>
```

## 🎯 Directives

### 🖱️ Click Outside

Detects clicks outside the element.

```html
<div clickOutside (clickedOutside)="closeModal()">
  <!-- modal content -->
</div>
```

### 🎛️ Control Value Accessor

Base directive for Angular Forms integration.

### 💰 Currency

Automatic formatting of monetary values.

```html
<input currency [hasCurrency]="true" [decimalPlaces]="2">
```

### 🔒 Input Password

Visibility toggle for password fields.

```html
<input type="password" input-password>
```

## 🔧 Pipes

### 🔢 Numeric Pipe

Advanced number formatting.

```html
{{ value | numeric:'1.2-2':'pt-BR' }}
```

## 🛠️ Utilities

### 📅 DateUtils

Utility functions for date manipulation.

```typescript
import { DateUtils } from 'ng-bootstrap-addons/utils';

const formatted = DateUtils.formatDate(new Date(), 'DD/MM/YYYY');
const brazilianDate = DateUtils.fromBrazilianDate('25/12/2024');
```

### 📄 File Functions

Utilities for file manipulation.

```typescript
import { fileToBlob, convertBlobToFile } from 'ng-bootstrap-addons/utils';

const blob = await fileToBlob(file);
const convertedFile = convertBlobToFile({nome: 'document.pdf', item: blobData});
```

### 🔧 Command Pattern

Implementation of Command pattern for asynchronous operations.

```typescript
import { Command1 } from 'ng-bootstrap-addons/utils';

const command = new Command1<ResultType, ParamsType>((params) => 
  this.service.getData(params)
);
```

### 🎛️ Custom Validators

Custom validators for forms.

```typescript
import { CustomValidatorService } from 'ng-bootstrap-addons/services';
```

## 🧪 Testing

The library has a comprehensive unit testing suite that covers:

- **Components**: Rendering, interaction, and integration tests
- **Directives**: Behavior and functionalities
- **Services**: Business logic and integration
- **Pipes**: Data transformation
- **Utilities**: Helper functions

### Running Tests

```bash
# All tests
ng test

# Specific tests
ng test --testNamePattern="AutoCompleteLovComponent"

# With coverage
ng test --code-coverage
```

### Test Coverage

Tests cover scenarios such as:
- ✅ Component rendering
- ✅ FormControl integration
- ✅ Property validation
- ✅ Accessibility (ARIA)
- ✅ Error states
- ✅ Edge cases
- ✅ Defer loading
- ✅ Content projection

## 🚀 Development

### Development Server

```bash
ng serve
```

### Library Build

```bash
ng build ng-bootstrap-addons
```

### Publishing

```bash
cd dist/ng-bootstrap-addons
npm publish
```

### Project Structure

```
ng-bootstrap-addons/
├── projects/ng-bootstrap-addons/
│   ├── components/          # Reusable components
│   ├── directives/          # Utility directives
│   ├── inputs/              # Input components
│   ├── selects/             # Selection components
│   ├── pipes/               # Transformation pipes
│   ├── services/            # Utility services
│   ├── utils/               # Utility functions
│   ├── textarea/            # Textarea component
│   ├── drag-drop-upload/    # File upload
│   ├── form-error-message/  # Error messages
│   └── src/tests/           # Unit tests
└── README.md
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

- [ ] 🌐 i18n support
- [ ] 🎨 Advanced customizable themes
- [ ] 📱 Mobile-specific components
- [ ] 🔍 Better accessibility
- [ ] ⚡ Performance optimizations
- [ ] 📊 Chart components
- [ ] 🚀 Version 2.0 with breaking changes and improvements

## 🔗 Useful Links

- 📦 [NPM Package](https://www.npmjs.com/package/ng-bootstrap-addons)
- 🐙 [GitHub Repository](https://github.com/mikaelbotassi/ng-bootstrap-addons)
- 📖 [Complete Documentation](https://github.com/mikaelbotassi/ng-bootstrap-addons#readme)
- 🐛 [Report Issues](https://github.com/mikaelbotassi/ng-bootstrap-addons/issues)
- 💡 [Feature Requests](https://github.com/mikaelbotassi/ng-bootstrap-addons/issues/new)

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