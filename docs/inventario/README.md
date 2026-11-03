# Inventario y contador del carrito

- **URL:** https://www.saucedemo.com (React). Se puede cambiar con `SAUCE_URL` (config/env.ts).
- **Usuario:** `standard_user` / `secret_sauce` (públicas, las muestra la página de login). Vienen de `data/users.ts`.
- **PRD:** [`PRD.md`](PRD.md) · **Matriz:** [`PLAN.json`](PLAN.json) · **Mapa:** [`mapa-elementos.json`](mapa-elementos.json) · **Capturas de la exploración:** [`exploracion/`](exploracion/)

## Alcance

Solo se automatiza:

- Agregar y remover productos en `/inventory.html`, de uno en uno y varios.
- El contador (badge) del ícono del carrito, arriba a la derecha.

`/cart.html` y el detalle (`/inventory-item.html?id=N`) se usan **solo** para contrastar el badge. El login es precondición. Quedan fuera: checkout, sort, menú, login negativo, otros usuarios y Reset App State.

## Cómo correr

Las pruebas usan la configuración del proyecto (`playwright.config.ts`) y llevan la etiqueta `@inventario`.

```bash
npm ci
npx playwright install chromium               # solo la primera vez
npm run test:inventario                      # los 13 TC de inventario
npx playwright test --grep @inventario --headed --workers=1   # con el navegador visible
npx playwright test --grep TC-06             # un solo caso
npx playwright test --grep @inventario --grep-invert "@defecto-conocido"   # sin TC-12 ni TC-13
```

Cada test adjunta al reporte HTML capturas intermedias junto con el `cart-contents` de ese momento.

## Resultado al 2026-11-03

11 de 13 pasan. TC-12 y TC-13 fallan por dos defectos de severidad baja:

- **TC-12:** con 1 producto, el aria-label del ícono dice «Cart, 1 items» (esperado «Cart, 1 item»).
- **TC-13:** el cursor del ícono del carrito es `auto` (esperado `pointer`, guía GDD-DDS-G-03).

## Matriz

| TC | Título | Spec |
|---|---|---|
| TC-01 | Estado inicial: sin badge, 6 «Add to cart» y catálogo completo | `inventory/agregar-remover` |
| TC-02 | Agregar 1: badge «1» y botón «Remove» | `inventory/agregar-remover` |
| TC-03 | Agregar 2 (incluye el slug con «.» y «()»): badge «2» | `inventory/agregar-remover` |
| TC-04 | Agregar los 6: el badge sube de 1 en 1 hasta «6» | `inventory/agregar-remover` |
| TC-05 | Remover 1 de varios: N-1 y vuelve «Add to cart» | `inventory/agregar-remover` |
| TC-06 | Remover todos: el badge desaparece del DOM | `inventory/agregar-remover` |
| TC-07 | Clics rápidos repetidos alternan el estado sin duplicar el conteo | `inventory/agregar-remover` |
| TC-08 | Persistencia tras `page.reload()` | `inventory/contador-carrito` |
| TC-09 | Badge = filas de `/cart.html`; se conserva al volver | `inventory/contador-carrito` |
| TC-10 | Remover desde el carrito se refleja en el badge y en el inventario | `inventory/contador-carrito` |
| TC-11 | Detalle: los botones genéricos mueven el mismo contador | `inventory/contador-carrito` |
| TC-12 | `@defecto-conocido` aria-label «Cart, 1 item» (hoy dice «1 items») | `inventory/contador-carrito` |
| TC-13 | `@defecto-conocido` cursor pointer en el ícono (hoy `auto`) | `inventory/contador-carrito` |

TC-12 y TC-13 esperan el comportamiento **correcto**, así que **fallan** mientras el defecto exista. No se marcaron con `test.fail()`: cuando lo corrijan, el caso pasa sin tocar el código.

En las specs, cada check de profundidad es un `test.step` con su prefijo: `[NEG]`, `[CTRL]`, `[BORDE]` o `[COPY]`.

## Estructura

Se apoya en la base del proyecto (`BasePage`, `LoginPage`, `CartPage`, `HeaderComponent`, `ItemRow` y el fixture `inventoryPage`) y le agrega solo lo que estas pruebas necesitan:

```
data/inventory.ts                       itemId y slug de cada producto (sobre data/products.ts) y el copy esperado
utils/carrito-storage.ts                leer/vaciar localStorage['cart-contents']
utils/evidencia.ts                      captura + cart-contents adjuntos al reporte
pages/ProductDetailPage.ts              detalle del producto (botones genéricos add-to-cart / remove)
pages/InventoryPage.ts                  + botones por slug, quitar, clics seguidos, doble clic, abrir detalle, recargar
pages/components/HeaderComponent.ts     + contador(), aria-label y cursor del ícono
pages/CartPage.ts                       + encabezados QTY / Description
fixtures/test.ts                        + fixture productDetailPage
tests/inventory/agregar-remover.spec.ts TC-01 a TC-07
tests/inventory/contador-carrito.spec.ts TC-08 a TC-13
```

## Trampas (PRD §10), codificadas en el POM

1. **El detalle no usa slug:** usa `[data-test="add-to-cart"]` / `[data-test="remove"]`, genéricos. Por eso tiene su propio Page Object (`ProductDetailPage.ts`).
2. **Slug con `.` y `()`** (`test.allthethings()-t-shirt-(red)`): como `#id` no es CSS válido. Todo botón se arma con `[data-test="..."]`.
3. **Sin productos no hay badge:** `HeaderComponent.expectContador(0)` exige `toHaveCount(0)`, nunca `toHaveText('0')`.
4. **El `data-test` del botón cambia al agregar** (`add-to-cart-<slug>` → `remove-<slug>`). Para los clics repetidos se ubica el botón por la tarjeta y la etiqueta `button` (`InventoryPage.clicsSeguidos()`): los enlaces de la tarjeta también tienen `role="button"`.
5. **El enlace del carrito** no tiene texto, id ni `href`, y su rol es `button`. Solo se encuentra por `[data-test="shopping-cart-link"]`.
6. **Ruta protegida:** sin sesión, la app redirige al login. El fixture `inventoryPage` hace el login en cada test.
7. **El estado vive en `localStorage['cart-contents']`.** Cada test se aísla con su propio contexto (localStorage limpio) y lo afirma en el `beforeEach`. **No** se usa Reset App State, porque deja los botones desfasados (PRD P-R; anotado como OBS-01, fuera de alcance).
8. **El orden depende del sort:** los productos se ubican por nombre o slug, nunca por índice.
9. **`[data-test="inventory-item"]` se repite** en el inventario, el carrito y el detalle. Siempre va acotado a la lista de la página.
10. **Una fila removida del carrito deja un `div.removed_cart_item` vacío.** Las filas se cuentan con `.cart_item`.
11. **«Vacío» en el storage puede ser `null` o `"[]"`.** `leerCarrito()` trata los dos como `ids: []`.

Además: un F5 por teclado no recarga la página; la spec usa `page.reload()` (en `InventoryPage.recargar()`).

## Observaciones fuera de alcance (no son TC)

- **OBS-01:** Reset App State deja los botones en «Remove» con el carrito vacío hasta recargar.
- **OBS-02:** con `/cart.html` vacío, «Checkout» está habilitado.
- **OBS-03:** el menú trae «Dynamic Catalog».
- **OBS-04:** el estándar `id_url` (detalle por `?id=N`) no aplica a este alcance.
- El enlace del carrito no tiene `href` ni `tabindex`: no se alcanza con Tab.
