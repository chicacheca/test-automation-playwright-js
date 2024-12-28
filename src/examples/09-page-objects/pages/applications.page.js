/**
 * Page object describing the applications page
 */
const {AppPage} = require("./app.page");

export class ApplicationsPage extends AppPage {

    constructor(page) {
        super(page, "admin/prihlasky");
        this.aplicationsLink = this.page.getByRole("link", {name: "Přihlášky"});
        this.loadingIndicator = this.page.locator("#DataTables_Table_0_processing");
        this.applicationsTable = this.page.locator(".dataTable");
        this.applicationsTableRows = this.applicationsTable.locator("tbody").locator("tr");
        this.searchField = this.page.locator("input[type='search']");
    }

    async goToApplicationsPage() {
        await this.aplicationsLink.click();
    }

    async waitForTableToLoad() {
        await this.page.waitForLoadState();
        await this.loadingIndicator.waitFor({state: "hidden"});
    }

    async getApplicationsTableRows() {
        await this.waitForTableToLoad();
        return await this.applicationsTableRows.all();
    }

    async searchInApplicationsTable(text) {
        await this.searchField.fill(text);
        await this.loadingIndicator.waitFor({state: "visible"});
    }

}
