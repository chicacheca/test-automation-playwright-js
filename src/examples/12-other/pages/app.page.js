/**
 * Base page object, which should provide fundamental methods for all pages
 */
export class AppPage {

    constructor(page, url) {
        this.url = url;
        this.page = page;
    }

    async open() {
        await this.page.goto("/" + this.url);
    }

}
