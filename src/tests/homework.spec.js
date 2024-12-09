import { test, expect } from "@playwright/test";
import { username, password, userFullName } from "../fixtures/fixtures";
import { nameFieldLocator,
    registrationEmailFieldLocator,
    registrationPasswordFieldLocator,
    confirmPasswordFieldLocator,
    submitButtonLocator,
    loadingIndicatorLocator,
    currentUserLocator,
    fieldErrorLocator,
    toastErrorLocator,
    toastTitleLocator,
    toastMessageLocator,
    generateRandomEmail
 } from "../fixtures/functions.js";

test.describe("Registration Page", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("registrace");
    });

    // 1. Test, který přejde na formulář registrace - zkontroluj, že se formulář správně zobrazil
    test("Should display registration form", async ({ page }) => {
        console.log("Page title: " + await page.title());
        await expect(nameFieldLocator(page), "Name field is visible").toBeVisible();
        await expect(nameFieldLocator(page), "Name field is enabled").toBeEnabled();
        await expect(registrationEmailFieldLocator(page), "E-mail field is visible").toBeVisible();
        await expect(registrationEmailFieldLocator(page), "E-mail field is enabled").toBeEnabled();
        await expect(registrationPasswordFieldLocator(page), "Password field is visible").toBeVisible();
        await expect(registrationPasswordFieldLocator(page), "Password field is enabled").toBeEnabled();
        await expect(confirmPasswordFieldLocator(page), "Confirm password field is visible").toBeVisible();
        await expect(confirmPasswordFieldLocator(page), "Confirm password field is enabled").toBeEnabled();
        await expect(submitButtonLocator(page), "Submit button is visible").toBeVisible();    
        await expect(submitButtonLocator(page), "Submit button has text Zaregistrovat").toHaveText("Zaregistrovat"); 
    });
    
    // 2. Test, který provede validní registraci uživatele - zkontroluj, že registrace proběhla úspěšně
    test("Successful registration", async ({ page }) => {
        await nameFieldLocator(page).fill(userFullName);
        await registrationEmailFieldLocator(page).fill(generateRandomEmail());
        await registrationPasswordFieldLocator(page).fill(password);
        await confirmPasswordFieldLocator(page).fill(password);
        await submitButtonLocator(page).click();
        await page.waitForLoadState();
        await loadingIndicatorLocator(page).waitFor({ state: "hidden" });    
    
        console.log("User: " + await currentUserLocator(page).textContent());
        await expect(currentUserLocator(page)).toHaveText(userFullName);
    });
    
    // 3. Test, který provede registraci uživatele s již existujícím emailem
    test("Should not register with duplicate email", async ({ page }) => {        
        await nameFieldLocator(page).fill(userFullName);
        await registrationEmailFieldLocator(page).fill(username); // already registered email address
        await registrationPasswordFieldLocator(page).fill(password);
        await confirmPasswordFieldLocator(page).fill(password);
        await submitButtonLocator(page).click();
    
        // zkontroluj, že registrace neproběhla a ověř chyby
        await expect(fieldErrorLocator(page)).toBeVisible();
        await expect(fieldErrorLocator(page)).toHaveText("Účet s tímto emailem již existuje");
        await expect(toastErrorLocator(page)).toBeVisible();
        await expect(toastTitleLocator(page)).toHaveText("Špatně zadané pole");
        await expect(toastMessageLocator(page)).toContainText("Některé pole obsahuje špatně zadanou hodnotu");
        await expect(currentUserLocator(page)).not.toBeAttached();

        // zkontroluj stav formuláře
        await expect(nameFieldLocator(page), "Name field is enabled").toBeEnabled();
        await expect(registrationEmailFieldLocator(page), "E-mail field is enabled").toBeEnabled();
        await expect(registrationPasswordFieldLocator(page), "Password field is enabled").toBeEnabled();
        await expect(confirmPasswordFieldLocator(page), "Confirm password field is enabled").toBeEnabled();
        await expect(submitButtonLocator(page), "Submit button is visible").toBeVisible();    
        await expect(submitButtonLocator(page), "Submit button has text Zaregistrovat").toHaveText("Zaregistrovat");
    });
    
    // 4. Test, který provede registraci uživatele s nevalidním heslem (obsahující pouze čísla)
    test("Should not register with invalid password - only digits", async ({ page }) => {
        await nameFieldLocator(page).fill(userFullName);
        await registrationEmailFieldLocator(page).fill(generateRandomEmail());
        await registrationPasswordFieldLocator(page).fill("123456");
        await confirmPasswordFieldLocator(page).fill("123456");
        await submitButtonLocator(page).click();

        // zkontroluj, že registrace neproběhla a ověř chyby
        await expect(fieldErrorLocator(page)).toBeVisible();
        await expect(fieldErrorLocator(page)).toHaveText("Heslo musí obsahovat minimálně 6 znaků, velké i malé písmeno a číslici");
        await expect(toastErrorLocator(page)).toBeVisible();
        await expect (toastTitleLocator(page)).toHaveText("Špatně zadané pole");
        await expect (toastMessageLocator(page)).toContainText("Některé pole obsahuje špatně zadanou hodnotu");

        // zkontroluj stav formuláře
        await expect(nameFieldLocator(page), "Name field is enabled").toBeEnabled();
        await expect(registrationEmailFieldLocator(page), "E-mail field is enabled").toBeEnabled();
        await expect(registrationPasswordFieldLocator(page), "Password field is enabled").toBeEnabled();
        await expect(confirmPasswordFieldLocator(page), "Confirm password field is enabled").toBeEnabled();
        await expect(submitButtonLocator(page), "Submit button is visible").toBeVisible();    
        await expect(submitButtonLocator(page), "Submit button has text Zaregistrovat").toHaveText("Zaregistrovat");         
    });
});
