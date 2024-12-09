import {expect, test} from "@playwright/test";
import {
    username,
    password,
    applicationsPageSize,
    applicationsSearchText
} from "../fixtures/fixtures.js";
import {
    pageTitleLocator,
    openLoginPage,
    login,
    goToApplications,
    getTableRows,
    searchInTable,
    waitForTableLoad
} from "../fixtures/functions.js"
import {RegExp} from "../fixtures/regular-expressions.js";

/*
Lekce 6: Organizace kódu

Napiš funkce na:
a. otevření login stránky (openLoginPage)
b. přihlášení (funkce se dvěma parametry: login(username, password))
c. přechod na stránku s přihláškami (goToApplications)
d. získání řádků tabulky (getTableRows)
e. hledání v tabulce (searchInTable)
f. počkání na načtení tabulky (waitForTableToLoad)

Zrefaktoruj testy aby používaly tyto funkce
*/


test.describe("Applications Page", () => {
    test.beforeEach(async ({ page }) => { 
        await openLoginPage(page);
        await login(page, username, password);
        await goToApplications(page);

        await page.waitForLoadState();
        await waitForTableLoad(page);

        await expect(pageTitleLocator(page), 'page title should be displayed').toHaveText("Přihlášky");
    });

    test("Should list all applications", async ({ page }) => {
        const rows = await getTableRows(page);
        await expect(rows.length, "table should have >= " + applicationsPageSize + " rows").toBeGreaterThanOrEqual(applicationsPageSize);
    });

    test("Applications should contain data in correct format", async ({ page}) => {
        const rows = await getTableRows(page);

        for (const row of rows) {
            const cells = row.locator("td");            
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });

    test("Applications should be filtered", {
        annotation: {
            type: "Filtering scope",
            description: "Applications are filtered also based on the information within the application details, not only from applications overview."
        }
    }, async ({ page }) => {
        const rows = await getTableRows(page);
        await searchInTable(page, applicationsSearchText);
        await page.waitForLoadState();
        await waitForTableLoad(page);

        const filteredRows = await page
            .locator(".dataTable")
            .locator("tbody")
            .locator("tr")
            .all();

        await expect(filteredRows.length, "table should have < " + rows.length + " rows").toBeLessThan(rows.length);

        for (const row of filteredRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });
});