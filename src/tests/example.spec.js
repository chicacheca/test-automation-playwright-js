import { test } from "@playwright/test";
import { username, password, applicationsSearchText } from "../fixtures/fixtures"


// Finding email field, checking if it is enabled and visible
test("Email field is visible and enabled", async ({ page }) => {
    await page.goto("/prihlaseni");
    const emailField = page.getByLabel("Email");
    console.log("Email field is visible: " + await emailField.isVisible());
    console.log("Email field is enabled: " + await emailField.isEnabled());
});

// Finding password field, checking if it is enabled and visible
test("Password field is visible and enabled", async ({ page }) => {
    await page.goto("/prihlaseni");
    const passwordField = page.getByLabel("Heslo");
    console.log("Password field is visible: " + await passwordField.isVisible());
    console.log("Password field is enabled: " + await passwordField.isEnabled());
});

// Finding login button, checking its text content
test("Login button text content", async ({ page }) => {
    await page.goto("/prihlaseni");
    const loginButton = page.getByRole("button", { name: "Přihlásit" });
    console.log("Login button text: " + await loginButton.textContent());
});

// Finding forgot password link
test("Value of 'Forgot password?' link", async ({ page }) => {
    await page.goto("/prihlaseni");
    const forgotPassword = page.locator(".btn-link"); // OR: page.getByText("Zapomněli jste své heslo?")
    console.log("'Forgot password?' link: " + await forgotPassword.getAttribute("href"));
});

// Login with "fill" and "click" + finding full number of current user
test("Login and get user's full name", async ({ page }) => {
    await page.goto("/prihlaseni");
    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.locator(".btn-primary");

    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();

    const currentUser = page
        .locator(".navbar-right")
        .locator("strong")
        .textContent(); // OR page.getByRole('button', { name: 'Lišák Admin' }).textContent();
    console.log("Full name of current user: " + await currentUser);
});

// Checking multiple elements: applications page
// Go to applications page
test("Count number of applications", async ({ page }) => {
    await page.goto("/prihlaseni");
    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.locator(".btn-primary");

    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();

    await page.getByRole("link", { name: " Přihlášky" }).click(); // got this locator using Playwright UI.
    await page.waitForLoadState();

// Check page title (h1)
    const pageTitle = page.getByRole("heading", { level: 1 });
    console.log("Page title is " + await pageTitle.textContent());

// Finding all rows in the table of applications (without the table header and footer)
    await page.getByText("Provádím...").waitFor({ state: "hidden" });

    const rows = await page
        .locator("#DataTables_Table_0")
        .locator("tbody") // using "tbody" to exclude the table header and footer
        .locator("tr")
        .all();

    for (const row of rows) {
        const rowText = await row.textContent();
        console.log(rowText);
    };

// Count number of applications
    console.log("There are " + rows.length + " rows/applications in the table.");

// Check number of applications as per the table footer
    const tableSizeInfo = page.locator("#DataTables_Table_0_info");
    console.log("Table size as per table footer: " + await tableSizeInfo.textContent());
});

// Filter applications and log the content of the filtered rows.
test("Filtering data in the applications table", async ({ page }) => {
    await page.goto("/prihlaseni");
    const emailField = page.getByLabel("Email");
    const passwordField = page.getByLabel("Heslo");
    const loginButton = page.getByRole("button", { name: "Přihlásit" });

    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();

    await page.getByRole("link", { name: " Přihlášky" }).click();

    await page.locator("input[type='search']").fill(applicationsSearchText);
    await page.getByText("Provádím...").waitFor({ state: "hidden" });

    const filteredRows = await page
        .locator("#DataTables_Table_0")
        .locator("tbody")
        .locator("tr")
        .all();
    console.log("There are " + filteredRows.length + " rows in the table after filtering '" + applicationsSearchText + "'.");

    for (const row of filteredRows) {
        console.log(await row.textContent());
    }
});