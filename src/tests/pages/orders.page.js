import { ApplicationPages } from "./application.pages.js";
import { icoNumber, clientName, clientAddress,
    substitute, contactName, contactPhone, contactEmail,
    startDate1, endDate1, startDate2, endDate2, startDate3, endDate3,
    campStudentsNumber, campStudentsAge, campAdultsNumber,
    natureStudentsNumber, natureStudentsAge, natureAdultsNumber, natureStartTime, natureEndTime
 } from "../../fixtures/fixtures.js";

export class OrdersPage extends ApplicationPages {
    constructor(page) {
        super(page);
        this.page = page;
        this.icoFieldLocator = this.page.locator("#ico");
        this.clientFieldLocator = this.page.locator("#client");
        this.addressFieldLocator = this.page.locator("#address");
        this.substituteFieldLocator = this.page.locator("#substitute");
        this.contactNameFieldLocator = this.page.locator("#contact_name");
        this.contactPhoneFieldLocator = this.page.locator("#contact_tel");
        this.contactEmailFieldLocator = this.page.locator("#contact_mail");
        this.startDate1FieldLocator = this.page.locator("#start_date_1");
        this.endDate1FieldLocator = this.page.locator("#end_date_1");
        this.startDate2FieldLocator = this.page.locator("#start_date_2");
        this.endDate2FieldLocator = this.page.locator("#end_date_2");
        this.startDate3FieldLocator = this.page.locator("#start_date_3");
        this.endDate3FieldLocator = this.page.locator("#end_date_3");
        this.campLinkLocator = this.page.locator("#nav-home-tab");
        this.schoolNatureLinkLocator = this.page.locator("#nav-profile-tab");  

        this.campSubmitButtonLocator = this.page.locator('[name="camp"]');
        this.schoolNatureSubmitButtonLocator = this.page.locator('[name="school_nature"]');

        this.campDatePartLocator = this.page.locator("#camp-date_part");
        this.campStudentsNumberLocator = this.page.locator("#camp-students");
        this.campStudentsAgeLocator = this.page.locator("#camp-age");
        this.campAdultsNumberLocator = this.page.locator("#camp-adults");

        this.natureStudentsNumberLocator = this.page.locator("#nature-students");
        this.natureStudentsAgeLocator = this.page.locator("#nature-age");
        this.natureAdultsNumberLocator = this.page.locator("#nature-adults");
        this.natureStartTimeLocator = this.page.locator("#nature-start_time");
        this.natureStartFoodLocator = this.page.locator("#nature-start_food");
        this.natureEndTimeLocator = this.page.locator("#nature-end_time");
        this.natureEndFoodLocator = this.page.locator("#nature-end_food");

        this.toastErrorLocator = this.page.locator(".toast-error");
        this.toastMessage = this.page.locator(".toast-message");
        this.fieldErrorLocator = this.page.locator(".invalid-feedback");
        this.orderConfirmationTitle = this.page.getByRole('heading', { name: 'Děkujeme za objednávku' });

        // Group form fields:
        this.orderFormFields = {
            icoField: this.icoFieldLocator,
            clientField: this.clientFieldLocator,
            addressField: this.addressFieldLocator,
            substituteField: this.substituteFieldLocator,
            contactNameField: this.contactNameFieldLocator,
            contactPhoneField: this.contactPhoneFieldLocator,
            contactEmailField: this.contactEmailFieldLocator,
            startDate1Field: this.startDate1FieldLocator,
            endDate1Field: this.endDate1FieldLocator,
            startDate2Field: this.startDate2FieldLocator,
            endDate2Field: this.endDate2FieldLocator,
            startDate3Field: this.startDate3FieldLocator,
            endDate3Field: this.endDate3FieldLocator
        };

        // Group camp information form fields:
        this.campOrderFields = {
            campDatePartField: this.campDatePartLocator,
            campStudentsNumberField: this.campStudentsNumberLocator,
            campStudentsAgeField: this.campStudentsAgeLocator,
            campAdultsNumberField: this.campAdultsNumberLocator
        };

        // Group school in nature information form fields:
        this.natureOrderFields = {
            natureStudentsNumberField: this.natureStudentsNumberLocator,
            natureStudentsAgeField: this.natureStudentsAgeLocator,
            natureAdultsNumberField: this.natureAdultsNumberLocator,
            natureStartTimeField: this.natureStartTimeLocator,
            natureStartFoodField: this.natureStartFoodLocator,
            natureEndTimeField: this.natureEndTimeLocator,
            natureEndFoodField: this.natureEndFoodLocator
        };
    }

    async open() {
        await this.page.goto("/objednavka/pridat");
    }

    async fillClientInfo(
        ico = icoNumber,
        client = clientName,
        address = clientAddress,
        substituteText = substitute,
        contactNameText = contactName,
        contactPhoneText = contactPhone,
        contactEmailText = contactEmail
    ) {
        await this.icoFieldLocator.fill(ico);
        await this.substituteFieldLocator.fill(substituteText);
        await this.contactNameFieldLocator.fill(contactNameText);
        await this.contactPhoneFieldLocator.fill(contactPhoneText);
        await this.contactEmailFieldLocator.fill(contactEmailText);

        if (this.clientFieldLocator.inputValue() !== client) {
            await this.clientFieldLocator.fill(client);
        };
        if (this.addressFieldLocator.inputValue() !== address) {
            await this.addressFieldLocator.fill(address);
        };
    }

    async fillTermInfo(
        sDate1 = startDate1,
        eDate1 = endDate1,
        sDate2 = startDate2,
        eDate2 = endDate2,
        sDate3 = startDate3,
        eDate3 = endDate3
    ) {
        await this.startDate1FieldLocator.fill(sDate1);
        await this.endDate1FieldLocator.fill(eDate1);
        await this.startDate2FieldLocator.fill(sDate2);
        await this.endDate2FieldLocator.fill(eDate2);
        await this.startDate3FieldLocator.fill(sDate3);
        await this.endDate3FieldLocator.fill(eDate3);
    }

    async fillCampOrderInfo(
        campStudentsNumberText = campStudentsNumber,
        campStudentsAgeText = campStudentsAge,
        campAdultsNumberText = campAdultsNumber
    ) {
        await this.campDatePartLocator.click();
        await this.campDatePartLocator.selectOption("forenoon");
        //await this.campDatePartLocator.selectOption("afternoon");
        await this.campStudentsNumberLocator.fill(campStudentsNumberText);
        await this.campStudentsAgeLocator.fill(campStudentsAgeText);
        await this.campAdultsNumberLocator.fill(campAdultsNumberText);
    }   

    async fillNatureOrderInfo(
        natureStudentsNumberText = natureStudentsNumber,
        natureStudentsAgeText = natureStudentsAge,
        natureAdultsNumberText = natureAdultsNumber,
        natureStartTimeText = natureStartTime,
        natureEndTimeText = natureEndTime
    ) {
        await this.natureStudentsNumberLocator.fill(natureStudentsNumberText);
        await this.natureStudentsAgeLocator.fill(natureStudentsAgeText);
        await this.natureAdultsNumberLocator.fill(natureAdultsNumberText);
        await this.natureStartTimeLocator.fill(natureStartTimeText);
        await this.natureStartFoodLocator.click();

        //await this.natureStartFoodLocator.selectOption("breakfast"); 
        await this.natureStartFoodLocator.selectOption("lunch");
        //await this.natureStartFoodLocator.selectOption("dinner"); 

        await this.natureEndTimeLocator.fill(natureEndTimeText);
        await this.natureEndFoodLocator.click();

        await this.natureEndFoodLocator.selectOption("breakfast");
        //await this.natureEndFoodLocator.selectOption("lunch");
        //await this.natureEndFoodLocator.selectOption("dinner");
    } 

    async isOrderFormVisibleAndEnabled() {
        for (const [fieldName, locator] of Object.entries(this.orderFormFields)) {
            const isVisible = await locator.isVisible();
            const isEnabled = await locator.isEnabled();

            if (!isVisible || !isEnabled) {
                return false;
            }
        }
        return true;
    }

    async isCampOrderFormVisibleAndEnabled() {
        for (const [fieldName, locator] of Object.entries(this.campOrderFields)) {
            const isVisible = await locator.isVisible();
            const isEnabled = await locator.isEnabled();

            if (!isVisible || !isEnabled) {
                return false;
            }
        }
        return true;
    }

    async isNatureOrderFormVisibleAndEnabled() {
        for (const [fieldName, locator] of Object.entries(this.natureOrderFields)) {
            const isVisible = await locator.isVisible();
            const isEnabled = await locator.isEnabled();

            if (!isVisible || !isEnabled) {
                return false;
            }
        }
        return true;
    }

};