import {expect, test} from "@playwright/test";

test.describe("API Tests Example (Browser)", async () => {
    let apiRequestContext;

    test.beforeAll(async ({ playwright }) => {
        apiRequestContext = await playwright.request.newContext({
            baseURL: 'https://postman-echo.com',
        });
    });

    test("GET - should get something", async () => {
        const response = await apiRequestContext.get("/get");
        console.log(response);
        expect(response.status()).toBe(200);
    });

    test("POST - should create something", async () => {
        const response = await apiRequestContext.post("/post", {
            json: {
                key: "value"
            }
        });
        console.log(response);
        expect(response.status()).toBe(200);
    });

});

