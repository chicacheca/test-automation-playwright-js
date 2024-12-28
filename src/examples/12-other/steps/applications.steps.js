import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { applicationFixture } from "./common.steps"
import { RegExp } from "../../../fixtures/regular-expressions";

const { When, Then } = createBdd(applicationFixture);

When("user navigates to page Přihlášky", async ({ app }) => {
    await app.goToApplicationsPage();
});

Then("user can see between {int} to {int} applications", async ({ app }, min, max) => {
    const allRows = await app.applicationsPage.getApplicationsTableRows();
    await expect(allRows.length, 'table should have >= ' + min + ' rows').toBeGreaterThanOrEqual(min);
    await expect(allRows.length, 'table should have <= ' + max + ' rows').toBeLessThanOrEqual(max);
});

Then("applications contain valid name, date, payment type and remaining amount to pay", async ({ app }) => {
    const allRows = await app.applicationsPage.getApplicationsTableRows();
    for (const row of allRows) {
        const values = await row.getValues();
        await expect(values.name).toMatch(RegExp.NAME);
        await expect(values.date).toMatch(RegExp.DATE);
        await expect(values.paymentType).toMatch(RegExp.PAYMENT_TYPE);
        await expect(values.toPay).toMatch(RegExp.TO_PAY);
    }
});

When("user enters text into the search field: {string}", async ({ app }, searchString) => {
    await app.applicationsPage.searchInApplicationsTable(searchString);
    await app.applicationsPage.waitForTableToLoad();
});

Then("all names on applications contain {string}", async ({ app }, searchString) => {
    const filteredRows = await app.applicationsPage.getApplicationsTableRows();
    for (const row of filteredRows) {
        const values = await row.getValues();
        await expect(values.name.toLowerCase()).toContain(searchString.toLowerCase());
    }
});

Then("table shows applications:", async ({ app }, dataTable) => {
    const filteredRows = await app.applicationsPage.getApplicationsTableRows();
    for (const row of filteredRows) {
        const index = filteredRows.indexOf(row);
        const actual = await row.getValues();
        const expected = dataTable.hashes()[index];
        expect(actual.name).toEqual(expected.name);
        expect(actual.date).toEqual(expected.date);
        expect(actual.paymentType).toEqual(expected.paymentType);
        expect(actual.toPay).toEqual(expected.toPay);
    }
});
