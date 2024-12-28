import { expect, test } from "@playwright/test";

const timestamp = Math.floor(Date.now() / 1000);
const ICO = "22834958";
const clientName = "Czechitas z.ú.";
const address = "Václavské náměstí 837, 11000 Praha";
const substituteName = "Jméno Zástupce";
const contactName = "Jméno Kontaktu";
const contactPhone = "774952432";
const contactEmail = `email-${timestamp}@czechitas.com`;
const startDate = "2023-05-02";
const endDate = "2023-05-12";

test.describe("Objednávka pro MŠ/ZŠ", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Navigace", async () => {
    test("Aplikace umožňuje uživateli v menu Pro učitele vytvoření nové objednávky pro MŠ/ZŠ", async ({
      page,
    }) => {
      await page.getByRole("button", { name: "Pro učitelé" }).click();
      await page.getByRole("link", { name: "Objednávka pro MŠ/ZŠ" }).click();
      await expect(page.locator("h1")).toHaveText("Nová objednávka");
      await expect(page.locator("#ico")).toBeVisible();
    });
  });

  test.describe("Aplikace umožňuje vytvoření nové objednávky pro MŠ/ZŠ", async () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/objednavka/pridat");
    });

    test("Po vyplnění IČO do formuláře Objednávka pro MŠ/ZŠ se automaticky načte jméno odběratele a adresa odběratele z ARESu", async ({
      page,
    }) => {
      await page.locator("#ico").fill(ICO);
      await page.keyboard.press("Enter");
      await page.locator(".toast-message").waitFor();

      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await fillNameAndAddress(page);

      await expect(page.locator("#client")).toHaveValue(clientName);
      await expect(page.locator("#address")).toHaveValue(address);
    });

    test("Uživatel nemůže uložit špatně vyplněnou přihlášku", async ({
      page,
    }) => {
      await page.locator("#ico").fill(ICO);
      await page.keyboard.press("Enter");
      await page.locator(".toast-message").waitFor();
      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await fillNameAndAddress(page);

      await page.getByRole("tab", { name: "Příměstský tábor" }).click();

      await page.getByRole("button", { name: "Uložit objednávku" }).click();

      await expect(page.locator("h1")).toHaveText("Nová objednávka");
      await expect(page.locator("#ico")).toBeVisible();
      await expect(page.locator("#contact_name")).toBeVisible();
    });

    test("Uživatel může uložit vyplněnou přihlášku na příměstský tábor", async ({
      page,
    }) => {
      await page.locator("#ico").fill(ICO);
      await page.keyboard.press("Enter");
      await page.locator(".toast-message").waitFor();
      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await fillNameAndAddress(page);

      await page.locator("#substitute").fill(substituteName);
      await page.locator("#contact_name").fill(contactName);
      await page.locator("#contact_tel").fill(contactPhone);
      await page.locator("#contact_mail").fill(contactEmail);
      await page.locator("#start_date_1").fill(startDate);
      await page.locator("#end_date_1").fill(endDate);
      await page.getByRole("tab", { name: "Příměstský tábor" }).click();
      await page.locator("#camp-students").fill("20");
      await page.locator("#camp-age").fill("10");
      await page.locator("#camp-adults").fill("2");
      await page.getByRole("button", { name: "Uložit objednávku" }).click();

      await expect(page.locator("h3")).toHaveText("Děkujeme za objednávku");
    });
  });
});

async function fillNameAndAddress(page) {
  await page.locator("#client").fill(clientName);
  await page.locator("#address").fill(address);
}
