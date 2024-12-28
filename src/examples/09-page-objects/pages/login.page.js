/**
 * Page object describing the login page
 * @type {exports.LoginPage}
 */
const {AppPage} = require("./app.page");

export class LoginPage extends AppPage {

    constructor(page) {
        super(page, "prihlaseni");
        this.emailField = this.page.getByLabel("Email");
        this.passwordField = this.page.getByLabel("Heslo");
        this.loginButton = this.page.getByRole("button", { name: "Přihlásit"});
        this.fieldError = this.page.locator(".invalid-feedback");
    }

    async login(username, password) {
        await this.emailField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }
}
