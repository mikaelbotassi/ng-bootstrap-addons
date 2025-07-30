# To publish:
npm version patch   # Para correção (1.0.0 → 1.0.1)
npm version minor   # Para nova funcionalidade sem breaking change (1.0.0 → 1.1.0)
npm version major   # Para breaking changes (1.0.0 → 2.0.0)

npm run build

npm publish --access public