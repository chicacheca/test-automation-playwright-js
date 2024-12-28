/**
 * Lesson 6: Code organization: functions - Exercise 2
 */
import {expect, test} from "@playwright/test";
import {
    username,
    password,
    defaultApplicationsPageSize,
    applicationsSearchText,
    applicationsPageSize
} from "../../fixtures/fixtures.js"
import {RegExp} from "../../fixtures/regular-expressions";

const pageTitle = "Přihlášky Czechitas";

async function login(page) {
    await page.goto("/prihlaseni");
    await page.getByLabel("Email").fill(username);
    await page.getByLabel("Heslo").fill(password);
    await page.getByRole("button", { name: "Přihlásit"}).click();
}

export async function getPageTitle(page) {
    return await page.getByRole("heading", {level: 1});
}

async function goToApplicationsPage(page) {
    await page.getByRole("link", {name: "Přihlášky"}).click();
}

async function waitForTableToLoad(page) {
    await page.waitForLoadState();
    await page.locator("#DataTables_Table_0_processing").waitFor({state: "hidden"});
}

async function getApplicationsTableRows(page) {
    return await page
        .locator(".dataTable")
        .locator("tbody")
        .locator("tr")
        .all();
}

async function searchInApplicationsTable(page, text) {
    await page.locator("input[type='search']").fill(text);
    await page.locator("#DataTables_Table_0_processing"); // waits for loader to appear
}

test.describe("Applications Page", async () => {

    test.beforeEach(async ({page}) => {
        await login(page);
        await expect(page).toHaveTitle(pageTitle);
        await goToApplicationsPage(page);
        await waitForTableToLoad(page);
    });

    test("should list all applications", async ({ page }) => {
        // get all rows
        const allRows = await getApplicationsTableRows(page);
        await expect(allRows.length, "table should have >= " + applicationsPageSize + " rows")
            .toBeGreaterThanOrEqual(applicationsPageSize);

        // iterate over all rows
        for (const row of allRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });

    test("should filter in applications", async ({ page }) => {
        // get all rows
        const allRows = await getApplicationsTableRows(page);
        await expect(allRows.length, "table should have >= " + applicationsPageSize + " rows")
            .toBeGreaterThanOrEqual(applicationsPageSize);

        // search in table
        await searchInApplicationsTable(page, applicationsSearchText);
        await waitForTableToLoad(page);

        // get filtered rows
        const filteredRows = await getApplicationsTableRows(page);
        await expect(filteredRows.length, "table should have < " + allRows.length + " rows")
            .toBeLessThan(allRows.length);

        // iterate over filtered rows
        for (const row of filteredRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toContain(applicationsSearchText);
        }
    });
});
