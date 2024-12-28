import { expect, test } from "@playwright/test";
import {
  ICO,
  clientName,
  address,
  substituteName,
  contactName,
  contactPhone,
  contactEmail,
  startDate,
  endDate,
} from "./order/fixtures.js";
import { OrderPage } from "./order/pages/order.page.js";

const NAVBAR_TEACHERS = "Pro učitelé";
const NAVBAR_NEW_ORDER = "Objednávka pro MŠ/ZŠ";
const ORDER_PAGE_TITLE = "Nová objednávka";
const ORDER_FORM_TITLE = "Objednávka akce";
const SUBURBAN_CAMP = "Příměstský tábor";
const AFTERNOON = "Odpolední";
const CHILDREN = "23";
const AGE = "8-12";
const ADULTS = "3";
const ORDER_SUCCESS = "Děkujeme za objednávku";
const ORDER_SUCCESS_MESSAGE =
  "Objednávka byla úspěšně uložena a bude zpracována. O postupu vás budeme informovat. Zkontrolujte si také složku SPAM";
const ARES_OK_TOAST = "Data z ARESu úspěšně načtena";
const ORDER_SUCCESS_TOAST = "Objednávka byla úspěšně uložena";

test.describe("Objednávka pro MŠ/ZŠ", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("Navigace", async () => {
    test("Aplikace umožňuje uživateli v menu Pro učitele vytvoření nové objednávky pro MŠ/ZŠ", async ({
      page,
    }) => {
      const orderPage = new OrderPage(page);

      await orderPage.navbar(NAVBAR_TEACHERS, NAVBAR_NEW_ORDER);

      await expect(orderPage.pageHeader).toHaveText(ORDER_PAGE_TITLE);
      await expect(orderPage.contentHeader).toHaveText(ORDER_FORM_TITLE);
    });
  });

  test.describe("Aplikace umožňuje vytvoření nové objednávky pro MŠ/ZŠ", async () => {
    // let orderPage; or we can do this and set it in beforeEach and then just use in consequent tests
    // if we let const orderPage = new OrderPage(page); in tests then it highlights the fixtures in order-advanced.spec

    test.beforeEach(async ({ page }) => {
      const orderPage = new OrderPage(page);

      await page.goto("/objednavka/pridat");
      await orderPage.navbar(NAVBAR_TEACHERS, NAVBAR_NEW_ORDER);
    });

    test("Po vyplnění IČO do formuláře Objednávka pro MŠ/ZŠ se automaticky načte jméno odběratele a adresa odběratele z ARESu", async ({
      page,
    }) => {
      const orderPage = new OrderPage(page);
      await orderPage.setCompanyId(ICO);
      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await orderPage.toast.waitFor();
      await orderPage.setClientName(clientName);
      await orderPage.setAddress(address);
      //await expect(orderPage.toast).toHaveText(ORDER_SUCCESS_TOAST);

      const values = await orderPage.getFilledValues();
      expect(values.client).toEqual(clientName);
      expect(values.address).toEqual(address);
    });

    test("Uživatel nemůže uložit špatně vyplněnou přihlášku", async ({
      page,
    }) => {
      const orderPage = new OrderPage(page);

      await orderPage.setCompanyId(ICO);
      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await orderPage.toast.waitFor();
      //await expect(orderPage.toast).toHaveText(ORDER_SUCCESS_TOAST);

      await orderPage.setClientName(clientName);
      await orderPage.setAddress(address);
      await orderPage.setSubstitute(substituteName);
      await orderPage.setContactName(contactName);
      await orderPage.setContactPhone(contactPhone);
      await orderPage.setContactEmail(contactEmail);
      // missing date
      await orderPage.selectType(SUBURBAN_CAMP);

      const suburbanCampForm = orderPage.suburbanCampForm;
      await suburbanCampForm.setTerm(AFTERNOON);
      await suburbanCampForm.setNumberOfStudents(CHILDREN);
      await suburbanCampForm.setStudentAge(AGE);
      await suburbanCampForm.setNumberOfAdults(ADULTS);
      await orderPage.submit();

      await expect(orderPage.pageHeader).toHaveText(ORDER_PAGE_TITLE);
      await expect(orderPage.contentHeader).toHaveText(ORDER_FORM_TITLE);
    });

    test("Uživatel může uložit vyplněnou přihlášku na příměstský tábor", async ({
      page,
    }) => {
      const orderPage = new OrderPage(page);

      await orderPage.setCompanyId(ICO);
      // TODO until ARES ("Data z ARESu se nepodařilo načíst, vyplňte je prosím ručně")
      await orderPage.toast.waitFor();
      //await expect(orderPage.toast).toHaveText(ORDER_SUCCESS_TOAST);

      await orderPage.setClientName(clientName);
      await orderPage.setAddress(address);
      await orderPage.setSubstitute(substituteName);
      await orderPage.setContactName(contactName);
      await orderPage.setContactPhone(contactPhone);
      await orderPage.setContactEmail(contactEmail);
      await orderPage.setStartDate(startDate);
      await orderPage.setEndDate(endDate);
      await orderPage.selectType(SUBURBAN_CAMP);

      const suburbanCampForm = orderPage.suburbanCampForm;
      await suburbanCampForm.setTerm(AFTERNOON);
      await suburbanCampForm.setNumberOfStudents(CHILDREN);
      await suburbanCampForm.setStudentAge(AGE);
      await suburbanCampForm.setNumberOfAdults(ADULTS);
      await orderPage.submit();

      await expect(orderPage.toast).toHaveText(ORDER_SUCCESS_TOAST);
      await expect(orderPage.contentHeader).toHaveText(ORDER_SUCCESS);
      await expect(orderPage.orderConfirmationText).toHaveText(
        ORDER_SUCCESS_MESSAGE
      );
    });
  });
});
