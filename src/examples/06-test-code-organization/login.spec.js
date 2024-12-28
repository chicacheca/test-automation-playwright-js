/**
 * Lesson 6: Code organization: functions - Exercise 1
 */
import {username, password, userFullName} from "../../fixtures/fixtures.js"
import {expect, test} from "@playwright/test";

const pageTitle = "Přihlášení - Czechitas";

async function openLoginPage(page) {
    await page.goto("/prihlaseni");
}

function getEmailField(page) {
    return page.getByLabel("Email");
}

function getPasswordField(page) {
    return page.getByLabel("Heslo");
}

function getLoginButton(page) {
    return page.getByRole("button", { name: "Přihlásit"});
}

function getToast(page) {
    return page.locator(".toast-message");
}

function getFieldError(page) {
    return page.locator(".invalid-feedback");
}

function getRightNavbar(page) {
    return page.locator(".navbar-right")
}

function getUserNameDropdown(page) {
    return getRightNavbar(page).locator('[data-toggle="dropdown"]');
}

function getLogoutLink(page) {
    return page.locator("#logout-link");
}

async function login(page, username, password) {
    await page.goto("/prihlaseni");
    await page.getByLabel("Email").fill(username);
    await page.getByLabel("Heslo").fill(password);
    await page.getByRole("button", { name: "Přihlásit"}).click();
}

test.describe("Login Page", async () => {

    test.beforeEach(async ({ page }) => {
        await openLoginPage(page);
        await test.expect(page).toHaveTitle(pageTitle);
    });

    test("should show login form", async ({ page }) => {

        const emailField = await getEmailField(page);
        await expect(emailField, "email field should be visible").toBeVisible();
        await expect(emailField, "email field should be enabled").toBeEnabled();

        const passwordField = await getPasswordField(page);
        await expect(passwordField, "password field should be visible").toBeVisible();
        await expect(passwordField, "password field should be enabled").toBeEnabled();

        const loginButton = await getLoginButton(page);
        await expect(loginButton, "login button should be visible").toBeVisible();
        await expect(loginButton, "login button text should have text").toHaveText("Přihlásit");
    });

    test("should login with valid credentials", async ({page}) => {

        await getEmailField(page).fill(username);
        await getPasswordField(page).fill(password);
        await getLoginButton(page).click();

        // await login(page, username, password);

        const userName = await getUserNameDropdown(page);
        await expect(userName).toHaveText(userFullName);
        // await expect(await getUserNameDropdown(page).textContent()).toEqual(userFullName);
    });

    test("should not login with invalid credentials", async ({ page }) => {
        const emailField = getEmailField(page);
        const passwordField = getPasswordField(page);
        const loginButton = getLoginButton(page);

        await emailField.fill(username);
        await passwordField.fill("invalid");
        await loginButton.click();

        // login(page, username, "invalid");

        const toast = await getToast(page);
        const errorField = await getFieldError(page);

        await expect(toast).toHaveText("Některé pole obsahuje špatně zadanou hodnotu");
        await expect(errorField).toHaveText("Tyto přihlašovací údaje neodpovídají žadnému záznamu.");

        await expect(emailField).toBeVisible();
        await expect(passwordField).toBeVisible();
        await expect(loginButton).toBeVisible();
    });

    test("should logout", async ({ page }) => {
        await getEmailField(page).fill(username);
        await getPasswordField(page).fill(password);
        await getLoginButton(page).click();

        await expect(await getUserNameDropdown(page)).toHaveText(userFullName);

        await getUserNameDropdown(page).click();
        await getLogoutLink(page).click();

        await expect(await getUserNameDropdown(page)).toBeVisible({ visible: false });
        await expect(await getRightNavbar(page)).toHaveText("Přihlásit");
    });
});
