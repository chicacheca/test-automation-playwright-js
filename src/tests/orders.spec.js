import { expect, test } from "@playwright/test";
import { ApplicationPages } from "./pages/application.pages.js";
import { OrdersPage } from "./pages/orders.page.js";
import { icoNumber, clientName, clientAddress,
    substitute, contactName, contactPhone, contactEmail,
    startDate1, endDate1, startDate2, endDate2, startDate3, endDate3,
    campStudentsNumber, campStudentsAge, campAdultsNumber,
    natureStudentsNumber, natureStudentsAge, natureAdultsNumber, natureStartTime, natureEndTime,
    orderConfirmationTitle
 } from "../fixtures/fixtures.js";

test.describe("Orders", async () => {
    let application;
    let order;

    test.describe("Navigation to Orders Page", async () => {

        test.beforeEach(async ({ page }) => {
            application = new ApplicationPages(page);
            await application.open();
        });

        test("User can navigate to Orders for schools from 'For Teachers' menu item", async ({ page }) => {
            await expect(application.forTeachersMenuItemLocator).toBeVisible();
            await application.forTeachersMenuItemLocator.click();
            await expect(application.newOrderLocator).toBeVisible();
        });

        test("Order form should open upon clicking on 'For Teachers' menu item and user can fill in order details", async ({ page }) => {
            await application.gotoNewOrder();

            order = new OrdersPage(page);
            const isOrderFormEnabled = await order.isOrderFormVisibleAndEnabled();
            await expect(isOrderFormEnabled).toBe(true);

            await order.campLinkLocator.click();
            const isCampOrderFormEnabled = await order.isCampOrderFormVisibleAndEnabled();
            await expect(isCampOrderFormEnabled).toBe(true);
        });
    });

    test.describe("Order creation", async () => {
        let order;

        test.beforeEach(async ({ page }) => {
            order = new OrdersPage(page)
            await order.open();
        });

        test("Should fill client and client address fields based on ICO number", {
            annotation: {
                type: "Bug",
                description: "Client name and address not fetched from ARES"
            }
        }, async ({ page }) => {
            await order.icoFieldLocator.fill(icoNumber);
            await page.keyboard.press("Enter");            
            await expect(order.icoFieldLocator).toHaveValue(icoNumber);            
            await expect(order.clientFieldLocator).toHaveValue(clientName);
            await expect(order.addressFieldLocator).toHaveValue(clientAddress);
        });

        test("User can submit filled in order for the camp", {
            annotation: {
                type: "With workaround",
                description: "Information from ARES not filled in, workaround included to fill the client data manually"
            }
        }, async ({ page }) => {
            await order.fillClientInfo(icoNumber, clientName, clientAddress, substitute, contactName, contactPhone, contactEmail);
            await order.fillTermInfo(startDate1, endDate1, startDate2, endDate2, startDate3, endDate3);
            await order.campLinkLocator.click();
            await order.fillCampOrderInfo(campStudentsNumber, campStudentsAge, campAdultsNumber);
            await order.campSubmitButtonLocator.click();
            await expect(order.toastMessage).toHaveText("Objednávka byla úspěšně uložena");
            await expect(order.orderConfirmationTitle).toHaveText(orderConfirmationTitle);
        });
    
        test("User can submit filled in order for the school in nature", {
            annotation: {
                type: "With workaround",
                description: "Information from ARES not filled in, workaround included to fill the client data manually"
            }
        }, async ({ page }) => {
            await order.fillClientInfo(icoNumber, clientName, clientAddress, substitute, contactName, contactPhone, contactEmail);
            await order.fillTermInfo(startDate1, endDate1, startDate2, endDate2, startDate3, endDate3);
            await order.schoolNatureLinkLocator.click();
            await order.fillNatureOrderInfo(natureStudentsNumber, natureStudentsAge, natureAdultsNumber, natureStartTime, natureEndTime);
            await order.schoolNatureSubmitButtonLocator.click();
            await expect(order.toastMessage).toHaveText("Objednávka byla úspěšně uložena");
            await expect(order.orderConfirmationTitle).toHaveText(orderConfirmationTitle);
        });

        test("User should not be able to submit incomplete order - empty fields", async ({ page }) => {
            await order.campLinkLocator.click();
            await order.campSubmitButtonLocator.click();

            const isOrderFormEnabled = await order.isOrderFormVisibleAndEnabled();
            await expect(isOrderFormEnabled).toBe(true);

            const isCampOrderFormEnabled = await order.isCampOrderFormVisibleAndEnabled();
            await expect(isCampOrderFormEnabled).toBe(true);

            await expect(order.toastMessage).not.toBeVisible();
        });

        test("User should not be able to submit incomplete order - invalid email address", async ({ page }) => {
            await order.fillClientInfo(icoNumber, clientName, clientAddress, substitute, contactName, contactPhone, "invalid-email@cz");
            await order.fillTermInfo(startDate1, endDate1, startDate2, endDate2, startDate3, endDate3);
            await order.campLinkLocator.click();
            await order.fillCampOrderInfo(campStudentsNumber, campStudentsAge, campAdultsNumber);
            await order.campSubmitButtonLocator.click();

            const isOrderFormEnabled = await order.isOrderFormVisibleAndEnabled();
            await expect(isOrderFormEnabled).toBe(true);

            const isCampOrderFormEnabled = await order.isCampOrderFormVisibleAndEnabled();
            await expect(isCampOrderFormEnabled).toBe(true);

            await expect(order.toastMessage).not.toHaveText("Objednávka byla úspěšně uložena");
            await expect(order.toastMessage).toHaveText("Některé pole obsahuje špatně zadanou hodnotu");
            await expect(order.fieldErrorLocator).toHaveText("Zadaná adresa neexistuje, zkontrolujte překlepy");
        });
    });
});