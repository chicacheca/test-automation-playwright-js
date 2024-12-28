import { AppPage } from "./app.page";

/**
 * Page object describing the login page
 */
export class LoginPage extends AppPage {

    constructor(page) {
        super(page, "/prihlaseni")
        this.emailField = this.page.getByLabel("Email");
        this.passwordField = this.page.getByLabel("Heslo");
        this.loginButton = this.page.getByRole("button", { name: "Přihlásit"});
        this.fieldError = this.page.locator(".invalid-feedback");
    }

    async open() {
        await this.page.goto("/prihlaseni");
    }

    async fillUsername(username) {
        await this.emailField.fill(username);
    }

    async fillPassword(password) {
        await this.passwordField.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async login(username, password) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }
}
