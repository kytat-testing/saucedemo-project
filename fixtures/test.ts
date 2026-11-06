import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInformationPage } from '../pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { USUARIOS } from '../data/users';

interface Paginas {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInformationPage;
  checkoutOverviewPage: CheckoutOverviewPage;
  checkoutCompletePage: CheckoutCompletePage;
  productDetailPage: ProductDetailPage;
}

/**
 * `inventoryPage` llega ya con sesion iniciada y el carrito VACIO: cada prueba
 * tiene su propio contexto, asi que el carrito (localStorage) no se hereda.
 */
export const test = base.extend<Paginas>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page, loginPage }, use) => {
    await loginPage.login(USUARIOS.estandar);
    const inventory = new InventoryPage(page);
    await inventory.expectEstaAbierta();
    await inventory.header.expectContador(0);
    await use(inventory);
  },
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInfoPage: async ({ page }, use) => use(new CheckoutInformationPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),
  checkoutCompletePage: async ({ page }, use) => use(new CheckoutCompletePage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
});

export { expect } from '@playwright/test';
