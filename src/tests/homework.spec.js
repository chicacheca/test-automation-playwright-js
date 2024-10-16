import { test } from "@playwright/test";

test("should open registration page", async ({ page }) => {
    await page.goto("/registrace");
    console.log(await page.title());
    await page.screenshot({path: 'registration_page.png'});
});
 
test("should screenshot elements", async ({ page }) => {
    await page.goto("/registrace");
    console.log(await page.title());
    
    await page.screenshot({path: 'registration_page.png'});
    await page.locator("#name").screenshot({path: "reg_jmeno.png"});
    await page.locator("#email").screenshot({path: "reg_email.png"});
    await page.locator("#password").screenshot({path: "reg_password.png"});
    await page.locator("#password-confirm").screenshot({path: "reg_password-confirm.png"});
    await page.locator(".btn-primary").screenshot({path: "reg_Zaregistrovat_btn.png"});
});