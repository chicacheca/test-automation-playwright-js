import { test as setup } from '@playwright/test';
import {login, openLoginPage, stateFile} from "./app";
import {password, username} from "../../fixtures/fixtures";

setup("perform global setup", async ({ page }) => {
    console.log("Executing global setup");

    await openLoginPage(page);
    await login(page, username, password);

    // store the authenticated state (in the shared page context)
    await page.context().storageState({ path: stateFile });
});
