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

test("should find and screenshot elements", async ({ page }) => {
    await page.goto("/prihlaseni");

    // 1. CSS Locators

    // 1.1 CSS - tag
    // 1.1a Finding form element - using tag
    await page.locator("form").screenshot({ path: "1.1a_tag_form.png" });
    // 1.1b Finding second input element - using tag
    await page.locator("input").nth(1).screenshot({ path: "1.1b_tag_2ndInput.png"});

    // 1.2 CSS - ID
    // 1.2a Finding email field - using ID
    await page.locator("#email").screenshot({ path: "1.2a_ID_emailfield.png"});
    // 1.2b Finding password field - using ID
    await page.locator("#password").screenshot({ path: "1.2b_ID_passwordfield.png"});

    // 1.3 CSS - class
    // 1.3a Finding Submit Form button - using class
    await page.locator(".btn-primary").screenshot({ path: "1.3a_class_submitButton.png"});

    // 1.4 CSS - attribute
    // 1.4a Finding password field - using type attribute
    await page.locator("[type='password']").screenshot({ path: "1.4a_attributeType_passwordfield.png"});
    // 1.4b Finding field with value containing "ass" - using attribute
    await page.locator("[type*='ass']").screenshot({ path: "1.4b_attribute_fieldContainingAss.png"});
    // 1.4c Finding field with value finishing "word" - using attribute
    await page.locator("[type$='word']").screenshot({ path: "1.4c_attribute_fieldFinishingWord.png"});
    // 1.4d Finding field with value starting "pass" - using attribute
    await page.locator("[type^='pass']").screenshot({ path: "1.4d_attribute_fieldStartingPass.png"});

    // 1.5 CSS - combined locators
    // 1.5a Using combined selector for tag input and id email
    await page.locator("input#email").screenshot({ path: "1.5a_tagInput_idEmail.png"});
    // 1.5b Using combined selector for tag input and attribute type with value password
    await page.locator("input[type='password']").screenshot({ path: "1.5b_tagInput_attributeTypePassword.png"});
    // 1.5c Using combined selector for tag button and class btn-primary
    await page.locator("button.btn-primary").screenshot({ path: "1.5c_tagButton_class.png" });

    // 1.6 CSS - chaining locators
    // 1.6a Create chain $ for tag div > form > input[type$="word"]
    await page
        .locator("div")
        .locator("form")
        .locator("input[type$='word']")
        .screenshot({ path: "1.6a_chain.png"});

    // 2. Playwright locators
    // 2.1 Finding element by role heading, you can add options { level: 1 }
    await page.getByRole("heading", { level: 1 }).screenshot({ path: "2.1_role_HeadingLvl1.png"});
    // 2.2 Finding input for email by label Email
    await page.getByLabel("Email").screenshot({ path: "2.2_label_Email.png"});
    // 2.3 Finding element by text "Zapomněli jste své heslo?"
    await page.getByText("Zapomněli jste své heslo?").screenshot({ path: "2.3_Text_zapomenuteHeslo.png"});
});