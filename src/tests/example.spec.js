import {expect, test} from "@playwright/test";
import {
    username,
    password,
    userFullName,
    applicationsPageSize,
    applicationsSearchText
} from "../fixtures/fixtures.js"
import {RegExp} from "../fixtures/regular-expressions.js";

/*
Lekce 5: Organizace testů

1. Dlouhý test rozděl mezi jednotlivé testy a zorganizuj je pomocí hooks test.beforeAll, test.beforeEach, test.afterAll, test.afterEach.
Měly by vzniknout pravděpodobně alespoň 4 samostatné testy:
    a. test pro nesprávné přihlášení
    b. test pro správné přihlášení
    c. test pro odhlášení
    d. test pro výpis tabulky přihlášek bez filtrování
    e. test pro filtrování tabulky přihlášek
Rozděl testy do dvou describe bloků:
    - jedna sekce bude obsahovat testy pro login
    - druhá sekce bude obsahovat testy pro tabulku přihlášek 
Nezapomeň testy i obě sekce hezky popsat.

2. Zkus do testů doplnit další detaily:
    a. Označ si nějaký test tagem
    b. Přidej si k testu anotace
    c. Použij test.step pro popis jednotlivého kroku testu
*/

test.describe("Login Page", () => {
    test.beforeEach( async({ page }) => { 
        await page.goto("/prihlaseni");
     });

     test("Should display login form", async({ page }) => {
        const emailField = page.getByLabel('Email');
        await expect(emailField, 'email field should be visible').toBeVisible();
        await expect(emailField, 'email field should be enabled').toBeEnabled();

        const passwordField = page.getByLabel('Heslo');
        await expect(passwordField, 'password field should be visible').toBeVisible();
        await expect(passwordField, 'password field should be enabled').toBeEnabled();

        const loginButton = page.getByRole('button', { name: 'Přihlásit'});
        await expect(loginButton, 'login button should be visible').toBeVisible();
        await expect(loginButton, 'login button text should have text').toHaveText('Přihlásit');
     });

     test("Should log in with valid credentials", { tag: "@smoke" }, async ({ page }) => {
        await page.getByLabel("Email").fill(username);
        await page.getByLabel("Heslo").fill(password);
        await page.getByRole("button", { name: "Přihlásit"}).click();

        const currentUser = page
            .locator(".navbar-right")
            .locator("strong");
        await expect(currentUser, "current user should be displayed").toHaveText(userFullName);
    });

    test("Should not log in with invalid password", async ({ page }) => {
        await page.getByLabel("Email").fill(username);
        await page.getByLabel("Heslo").fill("invalid");
        await page.getByRole("button", { name: "Přihlásit"}).click();

        const toastMessage = page.locator(".toast-message");
        await expect(toastMessage).toHaveText("Některé pole obsahuje špatně zadanou hodnotu");
        const fieldError = page.locator(".invalid-feedback");
        await expect(fieldError).toHaveText("Tyto přihlašovací údaje neodpovídají žadnému záznamu.");

        await expect(page.getByLabel("Email"), "email field should be visible").toBeVisible();
        await expect(page.getByLabel("Heslo"), "password field should be visible").toBeVisible();
        await expect(page.getByRole("button", { name: "Přihlásit"}), "login buton should be visible").toBeVisible();
    });

    test("Should not log in with invalid email", async ({ page }) => {
        await page.getByLabel("Email").fill("abcgmail.com");
        await page.getByLabel("Heslo").fill(password);
        await page.getByRole("button", { name: "Přihlásit"}).click();

        await expect(page.getByLabel("Email"), "email field should be visible").toBeVisible();
        await expect(page.getByLabel("Heslo"), "password field should be visible").toBeVisible();
        await expect(page.getByRole("button", { name: "Přihlásit"}), "login button should be visible").toBeVisible();
    });

    test("Should log out", async ({ page }) => {
        await page.getByLabel("Email").fill(username);
        await page.getByLabel("Heslo").fill(password);
        await page.getByRole("button", { name: "Přihlásit"}).click();

        const currentUser = page
            .locator(".navbar-right")
            .locator("strong");
        await expect(currentUser).toHaveText(userFullName);

        await currentUser.click();
        await page.locator("#logout-link").click();
        await expect(currentUser).toBeVisible({ visible: false });
        await expect(page.locator('.navbar-right')).toHaveText('Přihlásit');
    });
});
    
test.describe("Applications Page", () => {
    test.beforeEach( async({ page }) => { 
        await page.goto("/prihlaseni");

        await test.step("fill the valid user's email in the email field", async() => {
            await page.getByLabel("Email").fill(username);
        });

        await test.step("fill the valid password in the password field", async() => {
            await page.getByLabel("Heslo").fill(password);
        });

        await test.step("click on login button", async() => {
            await page.getByRole("button", { name: "Přihlásit"}).click();
        });

        await page.getByRole("link", {name: "Přihlášky"}).click();
        await page.waitForLoadState();

        const loadingIndicator = page.locator("#DataTables_Table_0_processing");
        await loadingIndicator.waitFor({state: "visible"});
        await loadingIndicator.waitFor({state: "hidden"});

        const pageTitle = await page.getByRole("heading", {level: 1});
        await expect(pageTitle, 'page title should be displayed').toHaveText("Přihlášky");
    });

    test("Should list all applications", async({ page }) => {
        const rows = await page
            .locator(".dataTable")
            .locator("tbody")
            .locator("tr")
            .all();

        await expect(rows.length, "table should have >= " + applicationsPageSize + " rows")
        .toBeGreaterThanOrEqual(applicationsPageSize);
    });

    test("Applications should contain data in correct format", async({ page}) => {
        const rows = await page
            .locator(".dataTable")
            .locator("tbody")
            .locator("tr")
            .all();

        for (const row of rows) {
            const cells = row.locator("td");            
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });

    test("Applications should be filtered", {
        annotation: {
            type: "Filtering scope",
            description: "Applications are filtered also based on the information within the application details, not only from applications overview."
        }
    }, async ({ page }) => {
        const rows = await page
        .locator(".dataTable")
        .locator("tbody")
        .locator("tr")
        .all();

        await page.locator("input[type='search']").fill(applicationsSearchText);
        await page.waitForLoadState()

        const loadingIndicator = page.getByText('Provádím...'); // page.locator('#DataTables_Table_0_processing');
        await loadingIndicator.waitFor({state: "visible"});
        await loadingIndicator.waitFor({state: "hidden"});

        const filteredRows = await page
            .locator(".dataTable")
            .locator("tbody")
            .locator("tr")
            .all();

        await expect(filteredRows.length, "table should have < " + rows.length + " rows")
        .toBeLessThan(rows.length);

        for (const row of filteredRows) {
            const cells = row.locator("td");
            await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
            await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
            await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
            await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
        }
    });
});