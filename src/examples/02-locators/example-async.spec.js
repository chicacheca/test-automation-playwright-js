import {test} from "@playwright/test";

test("should demonstrate async / await", async ({ page }) => {

    await page.goto("/prihlaseni");

    const h1Locator = page.locator("h1");

    /*
    Prints locator("h1"), which is an object representing a page element selector.
    */
    console.log("Example 1:");
    console.log(h1Locator);

    /*
    Prints "Promise { <pending> }" because we called the innerText() function which returns a promise,
     but we didn"t await the promise resolution.
    */
    console.log("Example 2:");
    console.log(h1Locator.innerText());

    /*
    Prints "Přihlášení" because we called the innerText() function and awaited the resolution of the promise.
     */
    console.log("Example 3:");
    console.log(await h1Locator.innerText());

});
