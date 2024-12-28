import {username, password} from "../../fixtures/fixtures.js"
import {expect, test} from "@playwright/test";
import {
    getEmailField,
    getLoginButton,
    getPasswordField,
    openLoginPage,
    login,
} from "./app";

/**
 * Lesson 7: Browser context
 */

test.describe("Test Context", async () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test("two page test", async ({ browser, page}) => {
       const otherContext = await browser.newContext({
            baseURL: "https://www.otherpage.com"
        });

        const mainPage = page;
        const otherPage = await otherContext.newPage();

        await mainPage.goto("/");
        // some main page actions

        await otherPage.goto("/");
        // some other page actions
    });

    test("test context example", async (
        {
            browser,    // Browser instance is shared between all tests in the same worker.
            context,    // Isolated BrowserContext instance, created for each test.
            page,   // Isolated Page instance, created for each test.
            request // Isolated APIRequestContext instance for each test.
        }
    ) => {
        console.log("Current context page url: " + page.url());

        console.log("Browser contexts: " + browser.contexts().length);
        const newContext = await browser.newContext({
            baseURL: "https://www.czechitas.cz/",
            viewport: { width: 800, height: 600 },
            locale: "cs-CZ",
            timezoneId: "Europe/Prague",
        });
        console.log("Browser contexts: " + browser.contexts().length);


        console.log("Current context pages: " + context.pages().length);
        const newCurrentContextPage = await context.newPage();
        console.log("Current context pages: " + context.pages().length);

        await newCurrentContextPage.goto("/prihlaseni");
        console.log("Current context page urls:")
        for (const page of context.pages()) {
            console.log(" - " + page.url());
        }

        const newNewContextPage = await newContext.newPage()
        await newNewContextPage.goto("/");
        console.log("New context page urls:")
        for (const page of newContext.pages()) {
            console.log(" - " + page.url());
        }

        const response = await request.get("/");
        console.log(response.status());
    });

    test("configuration options example", async (
        {
            locale,
            browserName,
            baseURL,
            viewport,
            timezoneId
        }
    ) => {
        console.log("Base URL: " + baseURL);
        console.log("Browser Name: " + browserName);
        console.log("Viewport: " + viewport);
        console.log("Locale: " + locale);
        console.log("Timezone ID: " + timezoneId);
    });
});

test("Login Browser Context Example", async ({ browser }) => {

    const context1 = await browser.newContext();
    const pageInUserContext1 = await context1.newPage();
    await openLoginPage(pageInUserContext1);
    await login(pageInUserContext1, username, password);

    const context2 = await browser.newContext();
    const pageInUserContext2 = await context2.newPage();
    await openLoginPage(pageInUserContext2);

    await test.step("user 1 should be logged in", async () => {
        await expect(getEmailField(pageInUserContext1)).toBeAttached({ attached: false });
        await expect(getEmailField(pageInUserContext1)).toBeAttached({ attached: false });
        await expect(getLoginButton(pageInUserContext1)).toBeAttached({ attached: false });
    });

    await test.step("user 2 should not be logged in", async () => {
        await expect(getEmailField(pageInUserContext2)).toBeAttached({ attached: true });
        await expect(getPasswordField(pageInUserContext2)).toBeAttached({ attached: true });
        await expect(getLoginButton(pageInUserContext2)).toBeAttached({ attached: true });
    });
});
