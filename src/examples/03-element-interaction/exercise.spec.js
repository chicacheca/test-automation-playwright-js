const {test, expect} = require("@playwright/test");
const {username, password} = require("../../fixtures/fixtures");

/**
 * Lesson 3: Locators and element interactions
 */
test("should login and list applications", async ({ page }) => {

    await page.goto("/prihlaseni");

    // Finding email field, checking if it is enabled and visible
    const emailField = page.getByLabel("Email");
    console.log("Email field is visible" + await emailField.isVisible());
    console.log("Email field is enabled" + await emailField.isEnabled());

    // Finding password field, checking if it is enabled and visible
    const passwordField = page.getByLabel("Heslo");
    console.log("Password field is visible" + await passwordField.isVisible());
    console.log("Password field is enabled" + await passwordField.isEnabled());

    // Finding login button, checking text content
    const loginButton = page.getByRole("button", { name: "Přihlásit"});
    console.log("Login button text: " + await loginButton.textContent());

    // Finding forgot password link
    const link = page.getByText("Zapomněli jste své heslo?").getAttribute("href");
    console.log("Forgot password? link: " + await link);

    // Login
    await emailField.fill(username);
    await passwordField.fill(password);
    await loginButton.click();

    // Print users full name
    // const currentUser = $(".navbar-right").$("strong").getText();
    const currentUser = page
        .locator(".navbar-right")
        .locator("strong")
        .textContent();
    console.log("Current user name:" + await currentUser);

    // Got to applications page
    await page.getByRole("link", {name: "Přihlášky"}).click();
    await page.waitForLoadState();

    // Check page title
    console.log("Page title is: " + await page.getByRole("heading", {level: 1}).textContent())

    // Check recourds count
    const tableSizeInfo = page.locator("#DataTables_Table_0_info");
    console.log(await tableSizeInfo.textContent());

    // Print all applications
    const rows = await page
        .locator(".dataTable")
        .locator("tbody")
        .locator("tr")
        .all();

    console.log("There are " + rows.length + " rows in the table");
    for (const row of rows) {
        const rowText = await row.textContent()
        console.log(rowText);
    }

    // Optional: filter the applications table
    await page.locator("input[type='search']").fill("mar");
    await page.waitForLoadState();

    const filteredRows = await page
        .locator(".dataTable")
        .locator("tbody")
        .locator("tr")
        .all();

    console.log("There are " + filteredRows.length + " filtered rows in the table");
    for (const row of filteredRows) {
        console.log(await row.textContent());
    }
});
