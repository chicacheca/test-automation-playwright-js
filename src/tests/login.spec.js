import {expect, test} from "@playwright/test";
import {
    username,
    password,
    userFullName,
} from "../fixtures/fixtures.js"
import {
    openLoginPage,
    emailFieldLocator,
    passwordFieldLocator,
    loginButtonLocator,
    navbarRightLocator,
    currentUserLocator,
    toastMessageLocator,
    fieldErrorLocator,
    logoutLinkLocator,
} from "../fixtures/functions.js"


/*
Lekce 6: Organizace kódu

Prohlédni si, jak se v testech neustále opakuje volání $('nějaký selector') na stále stejné elementy.
“Vytáhni” tato volání do funkcí.
Uprav takto celý soubor login.spec.js
*/

test.describe("Login Page", () => {
    test.beforeEach( async({ page }) => { 
        await openLoginPage(page);
    });

    test("Should display login form", async({ page }) => {
        const emailField = emailFieldLocator(page);
        await expect(emailField, 'email field should be visible').toBeVisible();
        await expect(emailField, 'email field should be enabled').toBeEnabled();

        const passwordField = passwordFieldLocator(page);
        await expect(passwordField, 'password field should be visible').toBeVisible();
        await expect(passwordField, 'password field should be enabled').toBeEnabled();

        const loginButton = loginButtonLocator(page);
        await expect(loginButton, 'login button should be visible').toBeVisible();
        await expect(loginButton, 'login button text should have text').toHaveText('Přihlásit');
    });

    test("Should log in with valid credentials", { tag: "@smoke" }, async ({ page }) => {
        await emailFieldLocator(page).fill(username);
        await passwordFieldLocator(page).fill(password);
        await loginButtonLocator(page).click();

        await expect(currentUserLocator(page), "current user should be displayed").toHaveText(userFullName);
    });

    test("Should not log in with invalid password", async ({ page }) => {
        await emailFieldLocator(page).fill(username);
        await passwordFieldLocator(page).fill("invalid");
        await loginButtonLocator(page).click();

        await expect(toastMessageLocator(page)).toHaveText("Některé pole obsahuje špatně zadanou hodnotu");
        await expect(fieldErrorLocator(page)).toHaveText("Tyto přihlašovací údaje neodpovídají žadnému záznamu.");

        await expect(emailFieldLocator(page), "email field should be visible").toBeVisible();
        await expect(passwordFieldLocator(page), "password field should be visible").toBeVisible();
        await expect(loginButtonLocator(page), "login buton should be visible").toBeVisible();
    });

    test("Should not log in with invalid email", async ({ page }) => {
        await emailFieldLocator(page).fill("abcgmail.com");
        await passwordFieldLocator(page).fill(password);
        await loginButtonLocator(page).click();

        await expect(emailFieldLocator(page), "email field should be visible").toBeVisible();
        await expect(passwordFieldLocator(page), "password field should be visible").toBeVisible();
        await expect(loginButtonLocator(page), "login button should be visible").toBeVisible();
    });

    test("Should log out", async ({ page }) => {
        await emailFieldLocator(page).fill(username);
        await passwordFieldLocator(page).fill(password);
        await loginButtonLocator(page).click();

        await expect(currentUserLocator(page)).toHaveText(userFullName);

        await currentUserLocator(page).click();
        await logoutLinkLocator(page).click();
        await expect(currentUserLocator(page)).toBeVisible({ visible: false });
        await expect(navbarRightLocator(page)).toHaveText('Přihlásit');
    });
});