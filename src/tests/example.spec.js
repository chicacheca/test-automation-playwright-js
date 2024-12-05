import { expect, test } from "@playwright/test";
import { username, password, userFullName, applicationsSearchText } from "../fixtures/fixtures"
import { RegExp } from "../fixtures/regular-expressions";

/* Cvičení 1:
    1. Ověř stav přihlašovacího formuláře
        a) Políčka a tlačítko pro příhlášení jsou viditelná
        b) Tlačítko pro příhlášení obsahuje správný text
    2. Přihlaš se do aplikace a ověř, že
        a) formulář přihlášení není vidět.
        b) je v pravém horním rohu správné jméno uživatele
    3. Optional: Zkus si nějaké další asertace
        a) Zkus si negaci .not
        b) Vyzkoušej porovnání screenshotů
*/
test("Input fields and Submit button for Login are visible", async ({ page }) => {
    await page.goto("/prihlaseni");

    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.getByRole("button", { name: "Přihlásit" });

    await expect(emailField, "email field should be visible").toBeVisible();
    await expect(passwordField, "password field should be visible").toBeVisible();
    await expect(loginButton, "login button should be visible").toBeVisible("Přihlásit");
});

test("Login button has correct text 'Přihlásit'", async ({ page }) => {
    await page.goto("/prihlaseni");

    const loginButton = page.getByRole("button", { name: "Přihlásit" });
    await expect(loginButton, "login button should have correct text").toHaveText("Přihlásit");
});

test("Login form is not visible once logged in", async ({ page }) => {
    await page.goto("/prihlaseni");

    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.getByRole("button", { name: "Přihlásit" });

    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();

    await expect(emailField).not.toBeAttached();
    await expect(passwordField).not.toBeAttached();
    await expect(loginButton).not.toBeAttached("Přihlásit");
});

test("Correct user name should be displayed once logged in", async ({ page }) => {
    await page.goto("/prihlaseni");

    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.getByRole("button", { name: "Přihlásit" });

    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();

    const userNameLocator = page.locator(".navbar-right").locator("strong");
    await expect(userNameLocator).toHaveText(userFullName);
});

test("Screenshots of the login page should match", async ({ page }) => {
    await page.goto("/prihlaseni");
    await expect(page).toHaveScreenshot("login_page.png");
});
    
/* Cvičení 2:
    Uprav test pro tabulku přihlášek tak, abys ověřila, že
    1. Po přihlášení tabulka obsahuje správný počet přihlášek.
    2. Každá přihláška obsahuje:
        a) jméno účastníka
        b) datum konání
        c) typ platby
        d) zbývající částku k doplacení
    Tip: K asertaci textového obsahu podle nějakého vzoru můžete použít regulární výrazy.
*/

test("Applications table contains correct amount of applications", async ({ page }) => {
    await page.goto("/prihlaseni");

    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.getByRole("button", { name: "Přihlásit" });
    
    //Log in and get to applications page
    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();
    await page.getByRole("link", {name: "Přihlášky"}).click();
    await page.waitForLoadState();
    await page.getByText('Provádím...').waitFor( { state: "hidden" });

    // Verify the number of application is correct
    const tableSizeInfo = page.locator("#DataTables_Table_0_info");
    await expect(tableSizeInfo).toHaveText(/Zobrazeno \d+ až \d+ záznamů z \d+/);
    console.log(await tableSizeInfo.textContent());

    // Print all applications
    const rows = await page
        .locator("#DataTables_Table_0")
        .locator("tbody")
        .locator("tr")
        .all();

    await expect(rows).toHaveLength(30);
});

test("Each application in the table contains all the data", async ({ page }) => {
    await page.goto("/prihlaseni");

    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.getByRole("button", { name: "Přihlásit" });
    
    //Log in and get to applications page
    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();
    await page.getByRole("link", {name: "Přihlášky"}).click();
    await page.waitForLoadState();
    await page.getByText('Provádím...').waitFor( { state: "hidden" });

    const rows = await page
    .locator("#DataTables_Table_0")
    .locator("tbody")
    .locator("tr")
    .all();

    for (const row of rows) {
        const rowText = await row.textContent();
        console.log(rowText);
        const cells = row.locator("td");

        await expect(cells.nth(0)).toHaveText(RegExp.NAME); // Each application contains name of participant
        await expect(cells.nth(1)).toHaveText(RegExp.DATE); // Each application contains course term
        await expect(cells.nth(2)).toHaveText(RegExp.PAYMENT_TYPE); // Each application contains payment type
        await expect(cells.nth(3)).toHaveText(RegExp.TO_PAY); // Each application contains remaining price to pay
    }
});

/* Cvičení 3 - Optional:
    Vyplň něco do políčka "Hledat" a ověř, že se tabulka správně profiltrovala.
*/
test("Applications search is filtered correctly", async ({ page }) => {
    await page.goto("/prihlaseni");

    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.getByRole("button", { name: "Přihlásit" });
    
    //Log in and get to applications page
    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();
    await page.getByRole("link", {name: "Přihlášky"}).click();
    await page.waitForLoadState();
    await page.getByText('Provádím...').waitFor( { state: "hidden" });

    const rows = await page
        .locator("#DataTables_Table_0")
        .locator("tbody")
        .locator("tr")
        .all();

    // Fill something in the search field and verify the tab has been filtered correctly
    await page.getByLabel('Hledat:').fill(applicationsSearchText);
    await page.waitForLoadState();
    await page.getByText('Provádím...').waitFor( { state: "hidden" });

    const filteredRows = await page
        .locator("#DataTables_Table_0")
        .locator("tbody")
        .locator("tr")
        .all();

    // Verifying the amount of filtered applications is less than the amount of all the applications.
    console.log("After filtering there are " + filteredRows.length + " rows.");
    console.log(filteredRows.length + " filtered rows should be less than " + rows.length + " rows.");
    await expect(filteredRows.length).toBeLessThan(rows.length);

    // Verifying the filtered applications include all the data (but would be better to have a separate test for this)
    for (const row of filteredRows) {
        await expect(row).toContainText(applicationsSearchText);
        
        const cells = row.locator("td");
        await expect(await cells.nth(0).textContent()).toMatch(RegExp.NAME);
        await expect(await cells.nth(1).textContent()).toMatch(RegExp.DATE);
        await expect(await cells.nth(2).textContent()).toMatch(RegExp.PAYMENT_TYPE);
        await expect(await cells.nth(3).textContent()).toMatch(RegExp.TO_PAY);
    }
});