export class ApplicationPages {
    constructor(page) {
        this.url = "/";
        this.page = page;
        this.forTeachersMenuItemLocator = page.getByRole("button", { name:" Pro učitelé" });
        this.newOrderLocator = page.getByRole("link", { name: "Objednávka pro MŠ/ZŠ"});
    //    this.newOrderPage = new OrdersPage(this.page);
    }

    async open() {
        await this.page.goto(this.url);
    }

    async gotoNewOrder() {
        await this.forTeachersMenuItemLocator.click();
        await this.newOrderLocator.click();
    }
}