import { test, expect } from "@playwright/test";
import { username, password, userFullName } from "../fixtures/fixtures"

// Test který provede validní registraci uživatele - zkontroluj, že registrace proběhla úspěšně
test("Successful registration", async ({ page }) => {
    await page.goto("/registrace");
    console.log(await page.title());
    
    await page.locator("#name").fill(userFullName);

    function generateRandomEmail() {
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ""); // YYYYMMDDHHMMSSmmm
        return `randomuser${timestamp}@gmail.com`;
    }
    const randomEmail = generateRandomEmail();

    await page.locator("#email").fill(randomEmail);
    console.log("Generated email: " + randomEmail);
    await page.locator("#password").fill(password);
    await page.locator("#password-confirm").fill(password);
    await page.locator(".btn-primary").click();

    await page.waitForLoadState();
    await page.getByText('Provádím...').waitFor( { state: "hidden" });    

    const userLocator = page
        .locator(".navbar-right")
        .locator(".nav-item")
        .locator("strong");
    console.log("User: " + await userLocator.textContent());
    await expect(userLocator).toHaveText(userFullName);
});

// Test, který provede registraci uživatele s již existujícím emailem - zkontroluj, že registrace neproběhla a ověř chyby
test("Should not register with duplicate email", async ({ page }) => {
    await page.goto("/registrace");
    console.log(await page.title());
    
    await page.locator("#name").fill(userFullName);
    await page.locator("#email").fill(username); // already registered email address
    await page.locator("#password").fill(password);
    await page.locator("#password-confirm").fill(password);
    await page.locator(".btn-primary").click();

    const invalidFeedbackAlert = page.locator(".invalid-feedback");
    await expect.soft(invalidFeedbackAlert).toBeVisible();
    await expect.soft(invalidFeedbackAlert).toHaveText("Účet s tímto emailem již existuje");

    const toast = page.locator(".toast-error");
    await expect.soft(toast).toBeVisible();
    await expect (page.locator(".toast-error").locator(".toast-title")).toHaveText("Špatně zadané pole");
    await expect (page.locator(".toast-error").locator(".toast-message")).toContainText("Některé pole obsahuje špatně zadanou hodnotu");
});

// Test, který provede registraci uživatele s nevalidním heslem (obsahující pouze čísla) - zkontroluj, že registrace neproběhla a ověř chyby
test("Should not register with invalid password - only digits", async ({ page }) => {
    await page.goto("/registrace");
    console.log(await page.title());
    
    await page.locator("#name").fill(userFullName);

    function generateRandomEmail() {
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, ""); // YYYYMMDDHHMMSSmmm
        return `randomuser${timestamp}@gmail.com`;
    }
    const randomEmail = generateRandomEmail();

    await page.locator("#email").fill(randomEmail);
    await page.locator("#password").fill("123456");
    await page.locator("#password-confirm").fill("123456");
    await page.locator(".btn-primary").click();

    const invalidFeedbackAlert = page.locator(".invalid-feedback");
    await expect(invalidFeedbackAlert).toBeVisible();
    await expect(invalidFeedbackAlert).toHaveText("Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici");

    const toast = page.locator(".toast-error");
    await expect(toast).toBeVisible();
    await expect (page.locator(".toast-error").locator(".toast-title")).toHaveText("Špatně zadané pole");
    await expect (page.locator(".toast-error").locator(".toast-message")).toContainText("Některé pole obsahuje špatně zadanou hodnotu");
});