import {expect, test as base} from "@playwright/test";
import {
    applicationsPageSize, applicationsSearchResultText,
    applicationsSearchText, ApplicationTexts, password, username
} from "../../fixtures/fixtures.js"
import {RegExp} from "../../fixtures/regular-expressions";
import {
    login,
    goToApplicationsPage,
    waitForTableToLoad,
    getApplicationsTableRows,
    getPageTitle,
    searchInApplicationsTable,
    applicationsPageTitle,
} from "./app";

/**
 * Lesson 7: Fixtures
 *
 * This code works by creating a new test object that extends the base test object.
 * Notice how test is imported with alias base, and the extended object is called test instead.
 */
const test = base.extend({
    /*
     applicationsPage is the name of the property that will be added to the test object and referenced in the test cases
     */
    applicationsPage: async ({ page }, use) => {
        // Login form steps
        await login(page, username, password);

        // Initial page load steps
        await goToApplicationsPage(page);
        await waitForTableToLoad(page);

        // Verification of the page title
        await expect(getPageTitle(page)).toHaveText(ApplicationTexts.applicationsPage.applicationsSectionName);

        // Setting this fixture to the "applicationsPage" object
        await use(page);
    },
});

test.describe("Applications Page: Fixture Example", async () => {

    // Notice how applicationsPage is passed as a parameter to the test cases -> this is how the fixture is used
    test("should list all applications", async ({ applicationsPage }) => {
        // get all rows
        const allRows = await getApplicationsTableRows(applicationsPage);
        await expect(allRows.length, "table should have >= " + applicationsPageSize + " rows")
            .toBeGreaterThanOrEqual(applicationsPageSize);

        for (const row of allRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });

    test("should filter in applications", async ({ applicationsPage }) => {
        const allRows = await getApplicationsTableRows(applicationsPage);
        await expect(allRows.length, "table should have >= " + applicationsPageSize + " rows")
            .toBeGreaterThanOrEqual(applicationsPageSize);

        await searchInApplicationsTable(applicationsPage, applicationsSearchText);
        await waitForTableToLoad(applicationsPage);

        const filteredRows = await getApplicationsTableRows(applicationsPage);
        await expect(filteredRows.length, "table should have < " + allRows.length + " rows")
            .toBeLessThan(allRows.length);

        for (const row of filteredRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toMatch(applicationsSearchResultText);
        }
    });
});
