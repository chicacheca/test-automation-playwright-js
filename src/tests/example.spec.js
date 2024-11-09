import { test } from "@playwright/test";

test("should open login page", async ({ page }) => {
    await page.goto("/prihlaseni");
    console.log(await page.title());
    console.log("This is my first test!");

    await page.setViewportSize({ width: 800, height: 600 });
    await page.screenshot({ path: "login_page_800_600.png" });

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ path: "login_page_1920_1080.png" });
});