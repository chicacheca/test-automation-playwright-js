import { ApplicationsPage } from "./applications.page";
import { LoginPage } from "./login.page";

/**
 * Page object describing full application model
 */
export class ApplicationPages {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.applicationsPage = new ApplicationsPage(page);
        this.toastMessage = this.page.locator(".toast-message");
        this.navbarRight = this.page.locator(".navbar-right");
        this.usernameDropdown = this.navbarRight.locator("[data-toggle='dropdown']");
        this.logoutLink = this.page.locator("#logout-link");
        this.menuLoginLink = this.page.getByRole('link', { name: ' Přihlásit' });
        this.aplicationsLink = this.page.getByRole("link", {name: "Přihlášky"});
    }

    async open() {
        await this.page.goto("/");
    }

    async logout() {
        await this.usernameDropdown.click();
        await this.logoutLink.click();
    }

    async goToApplicationsPage() {
        await this.aplicationsLink.click();
    }
}
