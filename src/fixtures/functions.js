// Page Locators:
export function pageTitleLocator(page) {
    return page.getByRole("heading", {level: 1});
}

export function navbarRightLocator(page) {
    return page.locator('.navbar-right');
}

export function currentUserLocator(page) {
    return navbarRightLocator(page).locator("strong");
}

export function logoutLinkLocator(page) {
    return page.locator("#logout-link");
}

export function applicationsPageLocator(page) {
    return page.getByRole("link", {name: "Přihlášky"})
}

// Login Form Locators:
export function emailFieldLocator(page) {
    return page.getByLabel('Email');
}

export function passwordFieldLocator(page) {
    return page.getByLabel('Heslo');
}

export function loginButtonLocator(page) {
    return page.getByRole('button', { name: 'Přihlásit'});
}

// Feedback Locators:
export function toastErrorLocator(page) {
    return page.locator(".toast-error");
}

export function toastTitleLocator(page) {
    return toastErrorLocator(page).locator(".toast-title");
}

export function toastMessageLocator(page) {
    return page.locator(".toast-message");
}

export function fieldErrorLocator(page) {
    return page.locator(".invalid-feedback");
}

// Applications Page Locators:

export function applicationsLoadingIndicatorLocator(page) {
    return page.locator("#DataTables_Table_0_processing"); // page.getByText('Provádím...');
}

export function applicationsSearchFieldLocator(page) {
    return page.locator("input[type='search']");
}

// Actions:

export async function openLoginPage(page) {
    await page.goto("/prihlaseni");
}

export async function login(page, username, password) {
    await emailFieldLocator(page).fill(username);
    await passwordFieldLocator(page).fill(password);
    await loginButtonLocator(page).click();    
}

export async function goToApplications(page) {
    await applicationsPageLocator(page).click();
}

export async function getTableRows(page) {
    return await page.locator(".dataTable").locator("tbody").locator("tr").all();
}

export async function searchInTable(page, applicationsSearchText) {
    await applicationsSearchFieldLocator(page).fill(applicationsSearchText);
}

export async function waitForTableLoad(page) {
    await applicationsLoadingIndicatorLocator(page).waitFor({state: "visible"});
    await applicationsLoadingIndicatorLocator(page).waitFor({state: "hidden"});
}