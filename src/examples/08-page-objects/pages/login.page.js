/**
 * Page object describing the login page
 * @type {exports.LoginPage}
 */
export class LoginPage {

    constructor(page) {
        this.page = page;
        this.emailField = this.page.getByLabel("Email");
        this.passwordField = this.page.getByLabel("Heslo");
        this.loginButton = this.page.getByRole("button", { name: "Přihlásit"});
        this.toast = this.page.locator(".toast-message");
        this.fieldError = this.page.locator(".invalid-feedback");
        this.navbarRight = this.page.locator(".navbar-right");
        this.logoutLink = this.page.locator("#logout-link");
        this.usernameDropdown = this.navbarRight.locator("[data-toggle='dropdown']");
    }

    async open() {
        await this.page.goto("/prihlaseni");
    }

    async login(username, password) {
        await this.emailField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }
}
