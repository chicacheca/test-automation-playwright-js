import { test, expect } from "./order-advanced/pages/playwrightFixtures.js";
import { OrderPage } from "./order-advanced/pages/order.page.js";

const navForTeachers = "Pro učitelé";
const navOrder = "Objednávka pro MŠ/ZŠ";
const ICO = "22834958";
const clientName = "Czechitas z.ú.";
const address = "Václavské náměstí 837, 11000 Praha";
const substituteName = "Jméno Zástupce";
const contactName = "Jméno Kontaktu";
const contactPhone = "774952432";
const timestamp = Math.floor(Date.now() / 1000);
const contactEmail = `email-${timestamp}@czechitas.com`;
const startDate = "2023-05-02";
const endDate = "2023-05-12";
const pageName = "Nová objednávka";
const confirmation = "Děkujeme za objednávku";

test.describe("Objednávka pro MŠ/ZŠ", async () => {
  test.describe("Navigace", async () => {
    test("Aplikace umožňuje uživateli v menu Pro učitele vytvoření nové objednávky pro MŠ/ZŠ", async ({
      orderPage,
    }) => {
      await orderPage.navigate(navForTeachers, navOrder);

      await expect(orderPage.pageHeader).toHaveText(pageName);
    });
  });

  test.describe("Aplikace umožňuje vytvoření nové objednávky pro MŠ/ZŠ", async () => {
    test.use({
      orderPage: async ({ page }, use) => {
        const orderPage = new OrderPage(page);

        await page.goto("/objednavka/pridat");
        await orderPage.navigate(navForTeachers, navOrder);

        await use(orderPage);

        await page.close();
      },
    });

    // test.beforeEach(async ({ page, orderPage }) => {
    //   await page.goto("/objednavka/pridat");
    //   await orderPage.navigate(navForTeachers, navOrder);
    //    await orderPage.setICO(ICO); // is it worth to setICO in beforeEach/fixture??
    // });

    test("Po vyplnění IČO do formuláře Objednávka pro MŠ/ZŠ se automaticky načte jméno odběratele a adresa odběratele z ARESu", async ({
      orderPage,
    }) => {
      await orderPage.setICO(ICO);
      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await orderPage.fillNameAndAddress(clientName, address);

      await expect(orderPage.client).toHaveValue(clientName);
      await expect(orderPage.address).toHaveValue(address);
    });

    test("Uživatel nemůže uložit špatně vyplněnou přihlášku", async ({
      orderPage,
    }) => {
      await orderPage.setICO(ICO);
      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await orderPage.fillNameAndAddress(clientName, address);

      await orderPage.setUrbanCamp("Odpolední", "20", "10", "2");
      await orderPage.submit();

      await expect(orderPage.pageHeader).toHaveText(pageName);
      await expect(orderPage.client).toHaveValue(clientName);
      await expect(orderPage.address).toHaveValue(address);
    });

    test("Uživatel může uložit vyplněnou přihlášku na příměstský tábor", async ({
      orderPage,
    }) => {
      await orderPage.setICO(ICO);
      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await orderPage.fillNameAndAddress(clientName, address);

      await orderPage.setOrder(
        substituteName,
        contactName,
        contactPhone,
        contactEmail,
        startDate,
        endDate
      );
      await orderPage.setUrbanCamp("Odpolední", "20", "10", "2");
      await orderPage.submit();

      await expect(orderPage.contentHeader).toHaveText(confirmation);
    });
  });
});
