import { sanitizeText } from "../../../fixtures/helpers";

/**
 * Page object describing the applications page
 */
const {AppPage} = require("./app.page");

export class ApplicationsPage extends AppPage {

    constructor(page) {
        super(page, "admin/prihlasky");
        this.loadingIndicator = this.page.locator("#DataTables_Table_0_processing");
        this.applicationsTable = this.page.locator(".dataTable");
        this.applicationsTableRows = this.applicationsTable.locator("tbody").locator("tr");
        this.searchField = this.page.locator("input[type='search']");
    }

    async waitForTableToLoad() {
        await this.page.waitForLoadState();
        await this.loadingIndicator.waitFor({state: "hidden"});
    }

    async getApplicationsTableRows() {
        await this.waitForTableToLoad();
        const rows = await this.applicationsTableRows.all();
        return Promise.all(rows.map(async row => new TableRow(this.page, row)));
    }

    async searchInApplicationsTable(text) {
        await this.searchField.fill(text);
        await this.loadingIndicator.waitFor({state: "visible"});
    }

}

export class TableRow {

    constructor(page, rowElement) {
        this.page = page;
        this.rowElement = rowElement;
    }

    async getValues() {
        const cells = await this.rowElement.locator("td");
        return {
            name: await cells.nth(0).textContent(),
            date: await cells.nth(1).textContent(),
            paymentType: await cells.nth(2).textContent(),
            toPay: await cells.nth(3).textContent()
        }
    }

    async openInfo() {
        await this.rowElement.locator("[data-can='view']").click();
        await this.page.waitForLoadState();

        // Advanced: returning another advanced page object
        return new ApplicationInfoPage(this.page);
    }

}

/**
 * Advanced page object for the application detail page
 */
export class ApplicationInfoPage {

    constructor(page) {
        this.page = page;
        this.tableRows = this.page.locator(".table-twocols").locator("tr");
    }

    async getDetail() {
        let data = [];
        await this.page.waitForLoadState();

        // get all rows
        const rows = await this.tableRows.all();

        for (const row of rows) {
            const key = await row.locator("td").nth(0).textContent();
            const value = (await row.locator("td").nth(1).textContent())
            // push the key-value pair to the data array
            data.push([key, sanitizeText(value)]);
        }

        return data;
    }
}
