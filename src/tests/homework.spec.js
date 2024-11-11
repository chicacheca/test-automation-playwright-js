import { test } from "@playwright/test";
import { password } from "../fixtures/fixtures";

test("Should open registration page", async ({ page }) => {
    await page.goto("/registrace");
    console.log(await page.title());
    await page.screenshot({path: 'registration_page.png'});
});
 
test("Should screenshot elements", async ({ page }) => {
    await page.goto("/registrace");
    console.log(await page.title());
    
    await page.screenshot({path: 'registration_page.png'});
    await page.locator("#name").screenshot({path: "reg_jmeno.png"});
    await page.locator("#email").screenshot({path: "reg_email.png"});
    await page.locator("#password").screenshot({path: "reg_password.png"});
    await page.locator("#password-confirm").screenshot({path: "reg_password-confirm.png"});
    await page.locator(".btn-primary").screenshot({path: "reg_Zaregistrovat_btn.png"});
});

test("Registration workflow", async ({ page }) => {
    await page.goto("/registrace");
    await page.locator("#name").fill("Test Name");
    await page.locator("#email").fill("randomemail@gmail.com"); // Running the test repeatedly will fail.
    await page.locator("#password").fill(password);
    await page.locator("#password-confirm").fill(password);
    await page.locator(".btn-primary").click();
});