# PRD — SauceDemo · Inventario y contador del carrito

**Proyecto:** saucedemo (nuevo) · **URL:** https://www.saucedemo.com · **Fecha de escaneo:** 2026-11-03
**Fase:** Analyzer + Executor (exploración en vivo 2026-11-03) · **Mapa:** `docs/inventario/mapa-elementos.json`
**Usuario:** `standard_user` / `secret_sauce`. Son credenciales públicas que muestra la misma página de login.

## 1. Alcance (estricto)

| Dentro | Fuera |
|---|---|
| Agregar y remover productos desde `/inventory.html`, de uno en uno y varios | Login (solo es el medio para llegar) |
| Contador del carrito (badge) en el ícono superior derecho | Sort, checkout, menú lateral, detalle de producto como funcionalidad propia |
| `/cart.html` y `/inventory-item.html?id=N` **solo** para contrastar el badge | Otros usuarios (`problem_user`, etc.) |

Lo que no está en esta tabla no va como TC.

## 2. Leyenda de evidencia

- **[V]** Verificado: lo vi en `scan_page` / `get_page_elements` / `evaluate` o en una captura de la página real.
- **[S]** Supuesto: viene del conocimiento público de SauceDemo y **no** se ha visto en esta corrida.

Las herramientas del Analyzer no devuelven atributos `data-test`. El Executor los leyó con `evaluate` (`[...document.querySelectorAll('[data-test]')]`) el 2026-11-03: **todos los `data-test` de la § 4 quedaron [V]**.

## 3. Productos (6) — [V]

Orden por defecto: «Name (A to Z)».

| itemId (URL detalle) | Nombre | Slug (sufijo del id del botón) | Precio |
|---|---|---|---|
| 4 | Sauce Labs Backpack | `sauce-labs-backpack` | $29.99 |
| 0 | Sauce Labs Bike Light | `sauce-labs-bike-light` | $9.99 |
| 1 | Sauce Labs Bolt T-Shirt | `sauce-labs-bolt-t-shirt` | $15.99 |
| 5 | Sauce Labs Fleece Jacket | `sauce-labs-fleece-jacket` | $49.99 |
| 2 | Sauce Labs Onesie | `sauce-labs-onesie` | $7.99 |
| 3 | Test.allTheThings() T-Shirt (Red) | `test.allthethings()-t-shirt-(red)` | $15.99 |

El `itemId` sale de los ids `item_<N>_title_link` / `item_<N>_img_link` [V]. El `data-test` de esos enlaces usa guiones: `item-<N>-title-link` / `item-<N>-img-link` [V].

## 4. Selectores (confirmados en vivo, 2026-11-03)

### 4.1 `/inventory.html` (título «Products», `[data-test="title"]`)

| Elemento | Selector confirmado [V] | Notas |
|---|---|---|
| Botón agregar | `[data-test="add-to-cart-<slug>"]` = `#add-to-cart-<slug>` (también `name`) · clase `btn btn_primary btn_small btn_inventory` · texto «Add to cart» | los 6 vistos |
| Botón remover | `[data-test="remove-<slug>"]` = `#remove-<slug>` · clase `btn btn_secondary btn_small btn_inventory` · texto «Remove» | aparece al agregar; los 6 vistos |
| Lista | `[data-test="inventory-list"]` (`.inventory_list`) | |
| Tarjeta de producto | `[data-test="inventory-item"]` (`.inventory_item`) | **el mismo data-test se usa en las filas de `/cart.html` y en el contenedor del detalle** |
| Nombre | `[data-test="inventory-item-name"]` (`.inventory_item_name`) dentro de `[data-test="item-<N>-title-link"]` | |
| Descripción | `[data-test="inventory-item-desc"]` | |
| Precio | `[data-test="inventory-item-price"]` (`.inventory_item_price`), texto `$29.99` | |
| Imagen | `[data-test="inventory-item-<slug>-img"]` | |
| Enlace del carrito | `[data-test="shopping-cart-link"]` (`a.shopping_cart_link`, `role="button"`, sin `tabindex`, **sin `href`**, dentro de `#shopping_cart_container`) | `aria-label`: «Cart, empty» / «Cart, 1 items» / «Cart, 2 items» |
| Badge del carrito | `[data-test="shopping-cart-badge"]` (`span.shopping_cart_badge`, hijo del enlace) | **no existe en el DOM con 0 productos** |
| Sort (fuera de alcance) | `[data-test="product-sort-container"]` · opción activa `[data-test="active-option"]` | |
| Menú | `#react-burger-menu-btn` (abre) · `#react-burger-cross-btn` (cierra) | |
| Reset App State | `[data-test="reset-sidebar-link"]` = `#reset_sidebar_link` | |

### 4.2 `/cart.html` (título «Your Cart»)

| Elemento | Selector confirmado [V] |
|---|---|
| Lista | `[data-test="cart-list"]` |
| Encabezados | `[data-test="cart-quantity-label"]` «QTY» · `[data-test="cart-desc-label"]` «Description» |
| Fila de producto | `[data-test="inventory-item"]` (clase `.cart_item`) |
| Cantidad | `[data-test="item-quantity"]` (`.cart_quantity`), «1» |
| Nombre / precio | `[data-test="inventory-item-name"]` / `[data-test="inventory-item-price"]` |
| Remover | `[data-test="remove-<slug>"]` = `#remove-<slug>` (clase `cart_button`) |
| Continue Shopping | `[data-test="continue-shopping"]` = `#continue-shopping` |
| Checkout (fuera de alcance) | `[data-test="checkout"]` = `#checkout` |

Al remover en el carrito, la fila se reemplaza por `<div class="removed_cart_item"></div>` **vacío y sin data-test**: contar filas con `.cart_item` o `[data-test="inventory-item"]`, nunca con hijos de `cart-list`.

### 4.3 `/inventory-item.html?id=N` (detalle)

| Elemento | Selector confirmado [V] |
|---|---|
| Back to products | `[data-test="back-to-products"]` = `#back-to-products` |
| Contenedor | `[data-test="inventory-item"]` (`.inventory_details_container`) |
| Nombre / precio | `[data-test="inventory-item-name"]` / `[data-test="inventory-item-price"]` |
| Botón agregar | **`[data-test="add-to-cart"]` = `#add-to-cart` — genérico, sin slug** |
| Botón remover | **`[data-test="remove"]` = `#remove` — genérico, sin slug** |

### 4.4 Metadata del scan [V]
En las tres páginas: sin formularios, `spinnerVisible: false`, `modalVisible: false` y sin `dependencies`. Framework `unknown`; los ids `react-burger-*` indican React. No hay campos `disabled` ni `prefilled` relevantes. En el estado escaneado los 6 botones dicen «Add to cart» y están habilitados.

## 5. Comportamiento observado

| # | Observación | Evidencia |
|---|---|---|
| O-1 | Sin sesión, `/inventory.html` redirige a `/` con «Epic sadface: You can only access '/inventory.html' when you are logged in.» | [V] `reports/saucedemo_inventory_sin_login.png` |
| O-2 | Estado inicial de la sesión entregada: carrito vacío, 6 «Add to cart», **sin badge** en el ícono | [V] `reports/saucedemo_inventory_inicial.png`, `reports/exploracion/00_inventario_inicial_vacio.png` |
| O-3 | `/cart.html` vacío coincide con O-2 (sin filas) | [V] `reports/saucedemo_cart_vacio.png` |
| O-4 | El detalle usa un botón genérico `#add-to-cart`, no `#add-to-cart-<slug>` | [V] `reports/saucedemo_detalle_id4.png` + get_page_elements |

Las capturas de la exploración del Executor están en `docs/inventario/exploracion/` (en la tabla siguiente se citan solo por nombre de archivo). Todos los clics fueron físicos (`smart_click` / `click` de Playwright, sin healing); los estados se leyeron con `evaluate`.

## 6. § Comportamiento por confirmar en vivo — RESUELTO por el Executor (2026-11-03)

| # | Pregunta | Hipótesis [S] | Resultado |
|---|---|---|---|
| P-1 | Al agregar 1 producto, ¿el badge aparece con «1» y el botón pasa a «Remove» con id/data-test `remove-<slug>`? | Sí | **CONFIRMADO.** Clic en `add-to-cart-sauce-labs-backpack` → aparece `span[data-test="shopping-cart-badge"]` con «1»; el botón pasa a `id`/`data-test` = `remove-sauce-labs-backpack`, texto «Remove», clase `btn_secondary`. `localStorage['cart-contents']` = `[4]`; `aria-label` del enlace = «Cart, 1 items». Evidencia: `P1_agregar_1_badge_1.png` |
| P-2 | Al agregar varios (p. ej. 3 y luego los 6), ¿el badge sube de a uno hasta «6»? | Sí | **CONFIRMADO.** Agregando de a uno, el badge leyó 2 → 3 → 4 → 5 → 6. Los 6 botones quedan en `remove-<slug>` / «Remove». `cart-contents` = `[4,0,1,5,2,3]` (orden de inserción). Evidencia: `P2_agregar_6_badge_6.png` (página completa) |
| P-3 | Al remover uno, ¿el badge baja en 1 y el botón vuelve a «Add to cart» / `add-to-cart-<slug>`? | Sí | **CONFIRMADO.** Con 6, clic en `remove-sauce-labs-onesie` → badge «5», botón vuelve a `add-to-cart-sauce-labs-onesie` / «Add to cart». `cart-contents` = `[4,0,1,5,3]`. Evidencia: `P3_remover_1_badge_5.png` |
| P-4 | Al remover todos, ¿el badge **desaparece** del DOM o queda en «0»? | Desaparece | **CONFIRMADO: desaparece del DOM.** Removiendo de a uno: 4 → 3 → 2 → 1 → (sin badge). `querySelectorAll('[data-test="shopping-cart-badge"]').length` = 0, el `<a>` queda vacío, `aria-label` = «Cart, empty». Ojo: `cart-contents` queda en `"[]"` (no `null`, como en una sesión nueva o tras Reset). Evidencia: `P4_remover_todos_sin_badge.png` |
| P-5 | Tras recargar con F5, ¿el carrito persiste? ¿Vive en `localStorage['cart-contents']`, y con qué formato? | Persiste; array de ids | **CONFIRMADO.** Con Bike Light + Red T-Shirt: badge «2», `cart-contents` = `"[0,3]"` (string JSON con array de **itemId numéricos**, en orden de inserción). Tras `navigate` a la misma URL y tras recarga real (verificada con marcador en `window` que desaparece): badge «2», solo `remove-sauce-labs-bike-light` y `remove-test.allthethings()-t-shirt-(red)` en «Remove». Cookie de sesión: `session-username=standard_user`. Evidencia: `P5_recarga_badge_2_persiste.png`, `P5_recarga_real_badge_2_persiste.png`. Nota: `press_key F5` del MCP **no** recarga la página; para la spec usar `page.reload()` |
| P-6 | ¿`/cart.html` lista exactamente los productos agregados y el número de filas es igual al badge? Al volver con `#continue-shopping`, ¿se conservan el badge y los botones? | Sí | **CONFIRMADO.** Clic físico en el ícono (`click_and_wait_popup`: sin popup, navega en la misma pestaña a `/cart.html`). 2 filas = badge «2»: «Sauce Labs Bike Light» $9.99 y «Test.allTheThings() T-Shirt (Red)» $15.99, QTY 1 cada una. `continue-shopping` → inventario con badge «2» y los mismos 2 «Remove». Remove de Bike Light **desde el carrito** → badge «1», 1 fila, `cart-contents` = `[3]`; al volver, Bike Light está en «Add to cart». Remover la última fila deja 0 `.cart_item` y sin badge. Evidencia: `P6_cart_2_filas_badge_2.png`, `P6_continue_shopping_conserva_2.png`, `P6_remove_desde_cart_badge_1.png`, `P6_inventario_tras_remove_en_cart.png`, `P6_cart_vacio_tras_remove.png` |
| P-7 | En `/inventory-item.html?id=N`, ¿`#add-to-cart` / `#remove` actualizan el **mismo** badge? Al volver al inventario, ¿la tarjeta refleja el cambio? | Sí | **CONFIRMADO.** Detalle `id=4` (entrando por `item-4-title-link`): badge «1» → `[data-test="add-to-cart"]` → badge «2», el botón pasa a `[data-test="remove"]`/`#remove` «Remove», `cart-contents` = `[3,4]`; `back-to-products` → Backpack en «Remove», badge «2». Detalle `id=3` (ya en carrito) abre con `#remove`; clic → badge «1», `cart-contents` = `[4]`; al volver, Red T-Shirt en «Add to cart». Evidencia: `P7_detalle_id4_add_badge_2.png`, `P7_volver_inventario_backpack_remove.png`, `P7_detalle_id3_remove_badge_1.png`, `P7_volver_inventario_red_add.png` |
| P-8 | Warning `guia_sin_cursor_pointer`: ¿cuál `<a>` es? | Probablemente el enlace del carrito | **CONFIRMADO: es el enlace del carrito.** De todos los `<a>` de inventario y carrito, el único con `cursor` ≠ `pointer` es `[data-test="shopping-cart-link"]` (`cursor: auto`; su contenedor `#shopping_cart_container` también `auto`). El enlace no tiene `href` (navega por JS) pero sí `role="button"` (sin `tabindex`, corregido en la corrida run01). **Entra al alcance** como hallazgo menor (Guía GDD-DDS-G-03). El clic físico sobre él sí funciona. Evidencia: `evaluate` sobre `getComputedStyle` (sin captura posible: el cursor no sale en screenshots) |
| P-R | Reset App State (`#react-burger-menu-btn` → `[data-test="reset-sidebar-link"]`) | Limpia el badge; los botones quedan desfasados | **CONFIRMADO.** Con 3 productos (badge «3»): tras Reset, badge eliminado del DOM y `cart-contents` = `null` (borrado), **pero los 3 botones siguen en «Remove»** (`remove-sauce-labs-backpack`, `-bike-light`, `-onesie`) y el menú queda abierto. Clic físico en un «Remove» desfasado: el botón vuelve a «Add to cart», sin badge, `cart-contents` sigue `null`. Tras navegar/recargar, los 6 quedan en «Add to cart». **Para aislar tests: Reset + `page.reload()`, o limpiar `localStorage` antes de cargar.** Evidencia: `RESET_01_menu_abierto_badge_3.png`, `RESET_02_tras_reset_menu_abierto.png`, `RESET_03_sin_badge_botones_siguen_remove.png`, `RESET_04_clic_remove_desfasado.png`, `RESET_05_tras_recargar_todo_add_to_cart.png` |
| P-D | Doble clic rápido sobre «Add to cart» | Sin desfase | **CONFIRMADO: el botón alterna; no hay doble conteo.** Dos clics físicos consecutivos sin espera sobre el botón de Bolt T-Shirt (ubicado por la tarjeta): agrega y quita → sin badge, `cart-contents` = `[]`. Tres clics → badge «1», `cart-contents` = `[1]`, botón «Remove». Nunca hay ids duplicados. Limitación: el MCP no tiene `dblclick` nativo (`execute_batch` responde «Herramienta desconocida: dblclick»); se usaron dos/tres `click` reales seguidos. Evidencia: `DOBLECLIC_01_dos_clics_seguidos.png`, `DOBLECLIC_02_tres_clics_badge_1.png` |

Estado final de la exploración: carrito vacío (sin badge, `cart-contents` = `[]`, 6 «Add to cart»). Evidencia: `FINAL_carrito_vacio.png`.

## 7. Criterios de aceptación propuestos (acotados al alcance)

- **CA-1 Agregar individual:** al dar «Add to cart» en un producto, el botón cambia a «Remove» y el badge muestra 1.
- **CA-2 Agregar múltiple:** cada producto agregado suma 1 al badge. Con los 6 agregados, el badge muestra 6 y todos los botones dicen «Remove».
- **CA-3 Remover individual:** al dar «Remove», el botón vuelve a «Add to cart» y el badge resta 1.
- **CA-4 Remover todos:** con 0 productos, el badge no se muestra (no queda en «0»). _Confirmado (P-4)._
- **CA-5 Coherencia:** el número del badge es igual al número de productos en «Remove» del inventario y al número de filas de `/cart.html`.
- **CA-6 Persistencia:** el estado del carrito (badge y botones) se mantiene tras recargar la página y tras ir y volver de `/cart.html`. _Confirmado (P-5/P-6)._
- **CA-7 Detalle:** agregar o remover desde `/inventory-item.html?id=N` modifica el mismo contador y se refleja en la tarjeta del inventario. _Confirmado (P-7)._

## 8. Validaciones del Estándar Red 5G

`load_standard` solo detectó **`id_url`** (HIGH), por `inventory-item.html?id=N`:
- Dos pestañas simultáneas no se interfieren. Aplica al alcance solo si se quiere validar que el badge de una pestaña refleje los cambios de la otra tras recargar.
- Cambiar el ID por letras en la URL y recargar. El detalle es fuera de alcance; anotado, no se propone TC.
- Duplicar pestaña con la gestión en curso. Mismo criterio que el primero.

Cierre universal (Regla 1) llevado al alcance:
- **Negativo:** remover un producto que no está (no hay botón), o clics repetidos y rápidos en el mismo botón; el badge no debe desfasarse. _Clics repetidos: P-D._
- **Cada control:** los 6 botones, en los dos estados.
- **Borde:** 0 y 6 productos.
- **Copy:** «Add to cart» / «Remove».

El Planner decide si alguno entra; mantener la matriz proporcional.

## 9. Warnings de `scan_page`

| Warning | Página | Severidad | En alcance |
|---|---|---|---|
| `guia_sin_cursor_pointer` en un `<a>` | inventory, cart, detalle | low | **Sí** — es `[data-test="shopping-cart-link"]` (P-8) |

No salieron otros warnings: sin inputs, sin modales, sin `button_no_label`. El `<a>` del carrito no tiene texto pero sí `aria-label`.

## 10. Trampas descubiertas

1. **El detalle no usa slug:** `#add-to-cart` / `#remove` (genéricos) frente a `#add-to-cart-<slug>` en el inventario. Un Page Object común para ambas pantallas falla. [V]
2. **Slug con caracteres especiales:** `test.allthethings()-t-shirt-(red)` lleva `.` y `()`. En CSS, `#add-to-cart-test.allthethings()...` **no sirve**: usar `[data-test="..."]` / `[id="..."]` o `getByRole`. [V: `[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]` funcionó]
3. **El badge no existe con el carrito vacío:** validar con `toHaveCount(0)`, no con `toHaveText('0')`. [V]
4. **El `id`/`data-test` del botón cambia al agregar** (add-to-cart-<slug> → remove-<slug>). Un locator guardado antes del clic deja de resolver: ubicar el botón por la tarjeta (`[data-test="inventory-item"]` filtrada por nombre) → `button`. [V]
5. **El enlace del carrito no tiene texto, id ni `href`:** no sirve `getByText` ni `getByRole('link')` (tiene `role="button"`). Usar `[data-test="shopping-cart-link"]`. [V]
6. **Ruta protegida:** sin sesión redirige al login (O-1). Cada spec necesita login o un `storageState` (cookie `session-username` + `localStorage['cart-contents']`).
7. **El estado se comparte entre tests** (P-5: vive en `localStorage['cart-contents']`). **Reset App State no basta solo:** deja los botones en «Remove» hasta re-render. Aislar con Reset + `page.reload()` o limpiando `localStorage` antes de navegar.
8. **El orden del inventario depende del sort:** no ubicar productos por índice.
9. **`[data-test="inventory-item"]` se repite** en inventario, filas del carrito y contenedor del detalle: acotar siempre por página.
10. **Fila removida en el carrito:** queda un `div.removed_cart_item` vacío; contar `.cart_item`.
11. **`cart-contents` tiene dos valores para «vacío»:** `null` (sesión nueva o tras Reset) o `"[]"` (tras remover todo). Una aserción sobre storage debe aceptar ambos.

## 11. Fuera de alcance (anotado, no es TC)
- En `/cart.html` vacío, «Checkout» (`#checkout`) está habilitado.
- El menú trae «Dynamic Catalog» (`#dynamic_catalog_sidebar_link`), que no figura en versiones públicas anteriores de SauceDemo.
