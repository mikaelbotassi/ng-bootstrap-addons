# Publishing Guide

This guide provides step-by-step instructions for publishing the ng-bootstrap-addons library to NPM.

## 📋 Prerequisites

Before publishing, ensure you have:
- ✅ NPM account with access to publish packages
- ✅ Logged into NPM: `npm login`
- ✅ All tests passing: `ng test`
- ✅ All changes committed and pushed to repository
- ✅ Updated documentation and README files

## 🚀 Publishing Process

### 1. Version Management

Choose the appropriate version bump based on the changes:

```bash
# For bug fixes (1.0.0 → 1.0.1)
npm version patch

# For new features without breaking changes (1.0.0 → 1.1.0)
npm version minor

# For breaking changes (1.0.0 → 2.0.0)
npm version major
```

> **Note**: This command automatically updates `package.json`, creates a git tag, and commits the changes.

### 2. Build the Library

Navigate to the project root directory and build the library:

```bash
# Navigate to project root
cd /path/to/ng-bootstrap-addons

# Build the library for production
ng build ng-bootstrap-addons --configuration production

# Alternative: Build all projects
ng build
```

### 3. Verify Build Output

Check that the build was successful:

```bash
# Navigate to dist directory
cd dist/ng-bootstrap-addons

# Verify package.json and files are present
ls -la

# Check package.json content
cat package.json
```

### 4. Publish to NPM

From the `dist/ng-bootstrap-addons` directory:

```bash
# Publish as public package
npm publish --access public

# For beta versions (optional)
npm publish --access public --tag beta

# For dry run (test without actually publishing)
npm publish --dry-run
```

## 🔍 Pre-Publication Checklist

Before publishing, verify:

- [ ] **Version number** is correct in `package.json`
- [ ] **Dependencies** are up to date and compatible
- [ ] **Build artifacts** are complete in `dist/` folder
- [ ] **README.md** is updated with latest features
- [ ] **CHANGELOG.md** includes new version notes
- [ ] **Demo application** works with new version
- [ ] **All tests pass** (`ng test`)
- [ ] **Linting passes** (`ng lint`)
- [ ] **No security vulnerabilities** (`npm audit`)

## 📦 Post-Publication Steps

After successful publication:

1. **Create GitHub Release**:
   ```bash
   # Tag the release
   git tag v19.0.2
   git push origin v19.0.2
   ```

2. **Update Documentation**:
   - Update main README.md
   - Update demo application
   - Update any migration guides

3. **Announce the Release**:
   - LinkedIn post
   - GitHub release notes
   - Community forums

4. **Monitor for Issues**:
   - Check NPM download stats
   - Monitor GitHub issues
   - Respond to community feedback

## 🔧 Troubleshooting

### Common Issues:

**Authentication Error**:
```bash
npm login
# Enter your NPM credentials
```

**Permission Denied**:
```bash
# Check if you're logged in
npm whoami

# Verify package access
npm access list packages
```

**Build Failures**:
```bash
# Clean and rebuild
rm -rf dist/
ng build ng-bootstrap-addons --configuration production
```

**Version Conflicts**:
```bash
# Check current version
npm view ng-bootstrap-addons version

# Force version update if needed
npm version patch --force
```

## 📊 Version Strategy

Our versioning follows semantic versioning (SemVer) aligned with Angular:

- **Major Version (X.0.0)**: Angular compatibility updates
- **Minor Version (X.Y.0)**: New features, backward compatible
- **Patch Version (X.Y.Z)**: Bug fixes, backward compatible

Examples:
- `19.0.0` - Initial Angular 19 compatibility
- `19.1.0` - New components or features
- `19.0.1` - Bug fixes and improvements

## 🔗 Useful Commands

```bash
# Check package info
npm view ng-bootstrap-addons

# Check published versions
npm view ng-bootstrap-addons versions --json

# Unpublish (within 24 hours, use carefully)
npm unpublish ng-bootstrap-addons@version

# Deprecate a version
npm deprecate ng-bootstrap-addons@version "Reason for deprecation"
```

## 📞 Support

If you encounter issues during publishing:
- Check [NPM Documentation](https://docs.npmjs.com/)
- Contact repository maintainers
- Create an issue in the GitHub repository

---

**Last Updated**: July 2025