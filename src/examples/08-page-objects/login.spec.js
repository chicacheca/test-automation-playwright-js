/**
 * Lesson 8: Code organization: Page Object Model - Exercise 1
 */
import { expect, test } from "@playwright/test";
import {
  ApplicationTexts,
  password,
  userFullName,
  username,
} from "../../fixtures/fixtures.js";
import { LoginPage } from "./pages/login.page";

test.describe("Login Page", async () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await test.expect(page).toHaveTitle(ApplicationTexts.loginPage.title);
  });

  test("should show login form", { tag: "@ci" }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    await expect(
      loginPage.emailField,
      "email field should be visible"
    ).toBeVisible();
    await expect(
      loginPage.emailField,
      "email field should be enabled"
    ).toBeEnabled();

    await expect(
      loginPage.passwordField,
      "password field should be visible"
    ).toBeVisible();
    await expect(
      loginPage.passwordField,
      "password field should be enabled"
    ).toBeEnabled();

    await expect(
      loginPage.loginButton,
      "login button should be visible"
    ).toBeVisible();
    await expect(
      loginPage.loginButton,
      "login button text should have text"
    ).toHaveText("Přihlásit");
  });

  test(
    "should login with valid credentials",
    { tag: "@ci" },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      // await loginPage.emailField.fill(username);
      // await loginPage.passwordField.fill(password);
      // await loginPage.loginButton.click();

      await loginPage.login(username, password);

      await expect(loginPage.usernameDropdown).toHaveText(userFullName);
    }
  );

  test(
    "should not login with invalid credentials",
    { tag: "@ci" },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      // const emailField = getEmailField(page);
      // const passwordField = getPasswordField(page);
      // const loginButton = getLoginButton(page);

      // await loginPage.emailField.fill(username);
      // await loginPage.passwordField.fill('invalid');
      // await loginPage.loginButton.click();

      await loginPage.login(username, "invalid");

      await expect(loginPage.toast).toHaveText(
        "Některé pole obsahuje špatně zadanou hodnotu"
      );
      await expect(loginPage.fieldError).toHaveText(
        "Tyto přihlašovací údaje neodpovídají žadnému záznamu."
      );

      await expect(loginPage.emailField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.loginButton).toBeVisible();
    }
  );

  test("should logout", { tag: "@ci" }, async ({ page }) => {
    const loginPage = new LoginPage(page);

    // await loginPage.emailField.fill(username);
    // await loginPage.passwordField.fill(password);
    // await loginPage.loginButton.click();

    await loginPage.login(username, password);

    await expect(await loginPage.usernameDropdown).toHaveText(userFullName);

    await loginPage.usernameDropdown.click();
    await loginPage.logoutLink.click();

    await expect(await loginPage.usernameDropdown).toBeVisible({
      visible: false,
    });
    await expect(await loginPage.navbarRight).toHaveText("Přihlásit");
  });
});
