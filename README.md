# SauceDemo (Swag Labs) — Aplicación bajo prueba

**URL:** [https://www.saucedemo.com/](https://www.saucedemo.com/)

SauceDemo (_Swag Labs_) es una tienda e-commerce de demostración mantenida por Sauce Labs, diseñada específicamente como entorno de práctica para automatización de pruebas. Es una SPA construida en React, sin backend real: el estado se mantiene en el navegador (localStorage/sesión), por lo que no genera datos persistentes ni efectos secundarios.

## Características relevantes para QA

- Entorno público, estable y gratuito, sin necesidad de registro.
- Catálogo fijo de 6 productos con precios constantes → ideal para asserts determinísticos.
- Elementos con atributos `data-test`, lo que favorece locators estables.
- Usuarios predefinidos que simulan comportamientos distintos (bloqueo, defectos de UI, latencia, errores).
- Sin CAPTCHA, 2FA ni rate limiting.
- Estado reiniciable desde el menú lateral (_Reset App State_).

## Módulos / pantallas

| Pantalla                   | Ruta                        | Descripción                                                                            |
| -------------------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| Login                      | `/`                         | Autenticación con usuario y contraseña; muestra mensajes de error en pantalla.         |
| Inventory                  | `/inventory.html`           | Listado de productos con ordenamiento y acciones de agregar/remover.                   |
| Product Detail             | `/inventory-item.html?id=N` | Detalle del producto con imagen, descripción, precio y acción al carrito.              |
| Cart                       | `/cart.html`                | Productos seleccionados, con opciones de remover, continuar comprando o ir a checkout. |
| Checkout: Your Information | `/checkout-step-one.html`   | Formulario de First Name, Last Name y Zip/Postal Code.                                 |
| Checkout: Overview         | `/checkout-step-two.html`   | Resumen del pedido con subtotal, impuesto y total.                                     |
| Checkout: Complete         | `/checkout-complete.html`   | Confirmación de compra finalizada y saludos.                                           |

## Usuarios de prueba

Password para todos: `secret_sauce`

| Usuario                   | Comportamiento                                                                |
| ------------------------- | ----------------------------------------------------------------------------- |
| `standard_user`           | Operación normal, sin defectos.                                               |
| `locked_out_user`         | Login rechazado con mensaje de usuario bloqueado.                             |
| `problem_user`            | Defectos intencionales de UI (imágenes incorrectas, campos que no responden). |
| `performance_glitch_user` | Tiempos de respuesta elevados; útil para validar esperas y timeouts.          |
| `error_user`              | Errores en acciones del carrito y checkout.                                   |
| `visual_user`             | Desviaciones visuales; orientado a pruebas de regresión visual.               |

## Catálogo

| Producto                          | Precio |
| --------------------------------- | ------ |
| Sauce Labs Backpack               | $29.99 |
| Sauce Labs Bike Light             | $9.99  |
| Sauce Labs Bolt T-Shirt           | $15.99 |
| Sauce Labs Fleece Jacket          | $49.99 |
| Sauce Labs Onesie                 | $7.99  |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

## Funcionalidades automatizables

**Login**

- Autenticación válida e inválida, usuario bloqueado y validación de campos vacíos.
- Mensajes de error visibles en el contenedor de error y cierre del mismo.

**Inventory**

- Agregar y remover productos (individual y múltiple).
- Contador del carrito en el ícono superior derecho.
- Ordenamiento: Name (A→Z), Name (Z→A), Price (low→high), Price (high→low).
- Navegación al detalle del producto y retorno al listado.

**Cart**

- Verificación de productos, cantidades y precios.
- Remover productos y validar carrito vacío.
- Continue Shopping / Checkout.

**Checkout**

- Validación de campos obligatorios (First Name, Last Name, Zip Code).
- Cálculo de subtotal (_Item total_), impuesto (_Tax_, 8%) y total.
- Cancelación del flujo en ambos pasos.
- Confirmación final del pedido.

**Menú lateral (hamburguesa)**

- All Items, About (redirección externa a saucelabs.com), Logout, Reset App State.

## Consideraciones

- La sesión se mantiene en el navegador; cerrar sesión o limpiar el almacenamiento reinicia el estado.
- El estado del carrito persiste entre pantallas pero no entre usuarios distintos.
- Al ser un entorno demo, no existen endpoints de API para precondiciones: todo setup se hace vía UI o manipulando el almacenamiento del navegador.
