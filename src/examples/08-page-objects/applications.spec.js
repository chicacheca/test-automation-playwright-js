/**
 * Lesson 8: Code organization: Page Object Model - Exercise 2
 */
import {expect, test} from "@playwright/test";
import {
    username,
    password,
    ApplicationTexts,
    applicationsSearchText, applicationsPageSize
} from "../../fixtures/fixtures.js"
import {RegExp} from "../../fixtures/regular-expressions";
import {LoginPage} from "./pages/login.page";
import {ApplicationsPage} from "./pages/applications.page";

test.describe("Applications Page", async () => {

    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        const applicationsPage = new ApplicationsPage(page);

        await loginPage.open();
        await loginPage.login(username, password);
        await applicationsPage.goToApplicationsPage();
        await test.expect(page).toHaveTitle(ApplicationTexts.applicationsPage.title);
    });

    test("should list all applications", async ({ page }) => {
        const applicationsPage = new ApplicationsPage(page);

        // get all rows
        const allRows = await applicationsPage.getApplicationsTableRows(page);
        await expect(allRows.length, "table should have >= " + applicationsPageSize + " rows")
            .toBeGreaterThanOrEqual(applicationsPageSize);

        // iterate over rows
        for (const row of allRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });

    test("should filter in applications", async ({ page }) => {
        const applicationsPage = new ApplicationsPage(page);

        // get all rows
        const allRows = await applicationsPage.getApplicationsTableRows();
        await expect(allRows.length, "table should have >= " + applicationsPageSize + " rows")
            .toBeGreaterThanOrEqual(applicationsPageSize);

        // search in table
        await applicationsPage.searchInApplicationsTable(applicationsSearchText);
        await applicationsPage.waitForTableToLoad();

        // get filtered rows
        const filteredRows = await applicationsPage.getApplicationsTableRows();
        await expect(filteredRows.length, "table should have < " + allRows.length + " rows")
            .toBeLessThan(allRows.length);

        // iterate over filtered rows
        for (const row of filteredRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toContain(applicationsSearchText);
        }
    });
});
