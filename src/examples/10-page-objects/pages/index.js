import {ApplicationsPage} from "./applications.page";
import {LoginPage} from "./login.page";

export class ApplicationPages {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page, "prihlaseni");
        this.applicationsPage = new ApplicationsPage(page, "admin/prihlasky");
    }
}
