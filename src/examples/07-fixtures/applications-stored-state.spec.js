import {expect, test} from "@playwright/test";
import {
    applicationsPageSize,
    applicationsSearchResultText,
    applicationsSearchText, ApplicationTexts,
} from "../../fixtures/fixtures.js"
import {RegExp} from "../../fixtures/regular-expressions";
import {
    goToApplicationsPage,
    waitForTableToLoad,
    getApplicationsTableRows,
    searchInApplicationsTable,
    getPageTitle, stateFile
} from "./app";

/**
 * Lesson 7: Stored state
 */
test.describe("Applications Page: Stored State Example", async () => {
    let page;

    test.beforeAll(async ({ browser }) => {
        // create new context with stored state
        const context = await browser.newContext({
            storageState: stateFile
        });

        // creates new page and assigns it to the page variable
        page = await context.newPage();
    });

    test.beforeEach(async () => {
        await page.goto("/");
        await goToApplicationsPage(page);
        await waitForTableToLoad(page);
        await expect(getPageTitle(page)).toHaveText(ApplicationTexts.applicationsPage.applicationsSectionName);
    });

    test("should list all applications", async () => {
        const allRows = await getApplicationsTableRows(page);
        await expect(allRows.length, "table should have >= " + applicationsPageSize + " rows")
            .toBeGreaterThanOrEqual(applicationsPageSize);

        for (const row of allRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }

        // this would be current test state - serves no purpose except to show the state
        await page.context().storageState({ path: "state/state-test-1.json" });
    });

    test("should filter in applications", async () => {
        const allRows = await getApplicationsTableRows(page);
        await expect(allRows.length, "table should have >= " + applicationsPageSize + " rows")
            .toBeGreaterThanOrEqual(applicationsPageSize);

        await searchInApplicationsTable(page, applicationsSearchText);
        await waitForTableToLoad(page);

        const filteredRows = await getApplicationsTableRows(page);
        await expect(filteredRows.length, "table should have < " + allRows.length + " rows")
            .toBeLessThan(allRows.length);

        for (const row of filteredRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toMatch(applicationsSearchResultText);
        }

        // this would be current test state - serves no purpose except to show the state
        await page.context().storageState({ path: "state/state-test-2.json" });
    });
});
