import { test as teardown } from '@playwright/test';

teardown("perform global teardown", async ({ page }) => {
    console.log("Executing global teardown");
});
