import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import {applicationFixture, resolvePlaceholder} from "./common.steps"

const { Given, When, Then } = createBdd(applicationFixture);

Then("user sees Přihlásit link in the navbar", async ({ app }) => {
    await app.menuLoginLink.isVisible();
});

Then("user sees login form with button Přihlásit", async ({ app }) => {
    await expect(app.loginPage.emailField).toBeVisible();
    await expect(app.loginPage.passwordField).toBeVisible();
    await expect(app.loginPage.loginButton).toBeVisible();
});

Given("user provides username {string} and password {string}", async ({ app }, username, password) => {
    await app.loginPage.fillUsername(resolvePlaceholder(username));
    await app.loginPage.fillPassword(resolvePlaceholder(password));
});

When("user clicks on login button", async ({ app }) => {
    await app.loginPage.clickLoginButton();
});

Then("user is logged in as {string}", async ({ app }, fullName) => {
    await expect(app.usernameDropdown).toHaveText(resolvePlaceholder(fullName));
});

Then("toast message pops up: {string}", async ({ app }, message) => {
    await expect(app.toastMessage).toHaveText(message);
});

Then("login form error is shown: {string}", async ({ app }, error) => {
    await expect(app.loginPage.fieldError).toHaveText(error);
});

When("user clicks on logout in the navbar", async ({ app }) => {
    await app.logout();
});
