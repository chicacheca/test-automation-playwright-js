export const stateFile = "state/state.json";

export function getPageTitle(page) {
    return page.getByRole("heading", {level: 1});
}

export async function openLoginPage(page) {
    await page.goto("/prihlaseni");
}

export function getEmailField(page) {
    return page.getByLabel("Email");
}

export function getPasswordField(page) {
    return page.getByLabel("Heslo");
}

export function getLoginButton(page) {
    return page.getByRole("button", { name: "Přihlásit"});
}

export function getToast(page) {
    return page.locator(".toast-message");
}

export function getFieldError(page) {
    return page.locator(".invalid-feedback");
}

export function getRightNavbar(page) {
    return page.locator(".navbar-right")
}

export function getUserNameDropdown(page) {
    return getRightNavbar(page).locator('[data-toggle="dropdown"]');
}

export function getLogoutLink(page) {
    return page.locator("#logout-link");
}

export async function login(page, username, password) {
    await page.goto("/prihlaseni");
    await page.getByLabel("Email").fill(username);
    await page.getByLabel("Heslo").fill(password);
    await page.getByRole("button", { name: "Přihlásit"}).click();
}

export async function goToApplicationsPage(page) {
    await page.getByRole("link", {name: "Přihlášky"}).click();
}

export async function waitForTableToLoad(page) {
    await page.waitForLoadState();
    await page.locator("#DataTables_Table_0_processing").waitFor({state: "hidden"});
}

export async function getApplicationsTableRows(page) {
    return await page
        .locator(".dataTable")
        .locator("tbody")
        .locator("tr")
        .all();
}

export async function searchInApplicationsTable(page, text) {
    await page.locator("input[type='search']").fill(text);
    await page.locator("#DataTables_Table_0_processing"); // waits for loader to appear
}
