# Test Automation — SauceDemo

Suite de automatización de pruebas E2E para [https://www.saucedemo.com/](https://www.saucedemo.com/), cubriendo los flujos de login, inventario, carrito, checkout y compra.

## Stack

- **Lenguaje:** TypeScript
- **Framework de automatización:** Playwright Test
- **Runtime:** Node.js 18+
- **Patrón de diseño:** Page Object Model (POM)
- **Reportes:** Playwright HTML Reporter / Allure

## Estructura del proyecto

```
.
├── pages/                      # Page Objects (login, inventory, cart, checkout)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/                      # Casos de prueba por módulo
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── purchase-flow.spec.ts
├── data/                       # Datos de prueba y usuarios
├── utils/                      # Helpers, generadores de datos, fixtures
├── playwright-report/          # Reportes de ejecución
├── playwright.config.ts        # Configuración de Playwright
├── tsconfig.json
└── package.json
```

## Instalación

```bash
git clone <repo-url>
cd saucedemo-automation

npm install
npx playwright install
```

## Ejecución

```bash
# Toda la suite
npx playwright test

# Por módulo
npx playwright test tests/login.spec.ts

# Por tag
npx playwright test --grep @smoke

# Con navegador visible
npx playwright test --headed

# Navegador específico
npx playwright test --project=chromium

# Modo UI / debug
npx playwright test --ui
npx playwright test --debug

# Ver reporte
npx playwright show-report
```

## Usuarios de prueba

| Usuario                   | Password       | Uso                             |
| ------------------------- | -------------- | ------------------------------- |
| `standard_user`           | `secret_sauce` | Flujos felices                  |
| `locked_out_user`         | `secret_sauce` | Validación de usuario bloqueado |
| `problem_user`            | `secret_sauce` | Escenarios con defectos de UI   |
| `performance_glitch_user` | `secret_sauce` | Escenarios de latencia          |

## 🚀 Roadmap

### 🟢 A. Login

- [ ] Valid login
- [ ] Locked user (locked_out_user)
- [ ] Incorrect password
- [ ] Empty fields validation

### 🟢 B. Inventory

- [ ] Add single product
- [ ] Add multiple products
- [ ] Remove product
- [ ] Validate cart counter

### 🟢 C. Cart

- [ ] Validate correct products
- [ ] Remove product
- [ ] Empty cart validation

### 🟢 D. Checkout

- [ ] ZIP empty → error validation
- [ ] First name empty → error validation
- [ ] Last name empty → error validation
- [ ] Cancel checkout flow

### 🟢 E. Purchase Flow

- [ ] Purchase with 1 product
- [ ] Purchase with multiple products
- [ ] Purchase with random user
- [ ] Validate total amount

## Convenciones

- Nomenclatura de tests: `<modulo> - <escenario> - <resultado_esperado>`
- Cada test es independiente y auto-contenido (sin dependencias de orden).
- Los locators viven únicamente en los Page Objects, tipados con `Locator`.
- Los datos de prueba se gestionan desde `data/`, nunca hardcodeados en los specs.
- Uso de web-first assertions (`await expect(...)`), sin waits fijos.
