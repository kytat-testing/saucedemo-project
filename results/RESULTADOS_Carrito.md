# RESULTADOS — SauceDemo · Carrito (Cart)

- **Sitio:** https://www.saucedemo.com (sitio publico de practica de Sauce Labs)
- **Usuario:** `standard_user` / `secret_sauce`
- **Fecha de ejecucion:** 03-nov-2026, 10:57 (hora Colombia) · sesion 63
- **Herramienta:** Playwright 1.58.2 · Chromium (`channel: 'chromium'`) · patron POM
- **Alcance pedido:** 2 puntos del carrito
  1. *Cart — Verificacion de productos, cantidades y precios*
  2. *Cart — Continue Shopping / Checkout*

## Veredicto

✅ **15 de 15 pruebas en verde** (20,4 s, 6 workers en paralelo). Sin defectos. 1 observacion de comportamiento (NAV-07).

## 1. Verificacion de productos, cantidades y precios (`@carrito`)

| Id | Caso | Resultado | Duracion |
|---|---|---|---|
| CART-01 | Carrito vacio: sin productos y sin contador | ✅ | 3,6 s |
| CART-02 | Un producto: nombre, descripcion, precio y cantidad 1 | ✅ | 4,9 s |
| CART-03 | Varios productos (3): lista, orden, precios y cantidades | ✅ | 4,5 s |
| CART-04 | Los 6 productos: contador = suma de cantidades; total = catalogo (145,94) | ✅ | 5,4 s |
| CART-05 | Precios del inventario = catalogo esperado (6/6) | ✅ | 5,7 s |
| CART-06 | Quitar un producto actualiza lista y contador | ✅ | 5,3 s |
| CART-07 | Quitar todos deja el carrito vacio y sin contador | ✅ | 3,4 s |
| CART-08 | El carrito se conserva al recargar la pagina | ✅ | 3,8 s |

**Como se verifica:** cada fila del carrito se compara con **dos oraculos** independientes —lo que el
inventario mostraba en el momento de agregar (captura en vivo) y el catalogo de `data/products.ts`—
para que un precio mal pintado en las dos pantallas no pase desapercibido.

## 2. Continue Shopping / Checkout (`@navegacion`)

| Id | Caso | Resultado | Duracion |
|---|---|---|---|
| NAV-01 | Continue Shopping vuelve al inventario conservando el carrito (botones "Remove") | ✅ | 6,4 s |
| NAV-02 | Continue Shopping con el carrito vacio | ✅ | 7,8 s |
| NAV-03 | Seguir comprando y agregar otro producto suma al carrito existente | ✅ | 4,5 s |
| NAV-04 | Checkout lleva a "Checkout: Your Information" con sus 3 campos | ✅ | 6,7 s |
| NAV-05 | Cancel en el checkout regresa al carrito sin perder productos | ✅ | 6,7 s |
| NAV-06 | El resumen del checkout repite productos/cantidades; subtotal = catalogo y total = subtotal + impuesto | ✅ | 8,5 s |
| NAV-07 | Checkout con el carrito vacio (fija el comportamiento actual) | ✅ ⚠️ | 6,5 s |

## Observaciones

- ⚠️ **OBS-1 — Checkout con carrito vacio permitido.** El boton *Checkout* lleva a "Your Information"
  aunque el carrito no tenga productos. NAV-07 fija ese comportamiento con una anotacion; si el sitio
  empieza a bloquearlo, la prueba fallara y avisara del cambio. Es decision de producto si debe impedirse.
- 📝 **Cantidades:** SauceDemo no permite cambiar la cantidad; cada producto entra con `item-quantity = 1`.
  Por eso "cantidades" se verifica como cantidad 1 por fila **y** contador del carrito = suma de cantidades.

## Notas tecnicas

- SauceDemo usa `data-test` → `testIdAttribute: 'data-test'` en la config; todos los selectores son
  `getByTestId`, sin selectores posicionales.
- La busqueda de productos por nombre es **exacta** (`getByText(nombre, { exact: true })`): `hasText`
  haria coincidencia parcial.
- Cada prueba corre en su propio contexto, asi que el carrito (localStorage) no se hereda entre pruebas.
- En esta maquina falta `chrome-headless-shell` → se usa `channel: 'chromium'`.

## Entregables

- Proyecto: `projects/saucedemo-qa/` (README con instrucciones para VS Code)
- Reporte resumen: `projects/saucedemo-qa/reports/Reporte_QA_SauceDemo_Carrito.html`
- Reporte Playwright: `projects/saucedemo-qa/reports/html/index.html`
- Resultado crudo: `projects/saucedemo-qa/results/resultados.json`
