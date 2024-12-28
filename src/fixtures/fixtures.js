require('dotenv').config();

const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

export const username = ADMIN_USERNAME;
export const password = ADMIN_PASSWORD;
export const userFullName = 'Lišák Admin';
export const applicationsPageSize = 10;
export const applicationsSearchText = 'aba';

export const icoNumber = "22834958";
export const clientName = "Czechitas z.ú.";
export const clientAddress = "Krakovská 583/9, Nové Město, 11000 Praha 1"
export const substitute = "Pan Ředitel";
export const contactName = "Bílá Paní";
export const contactPhone = "+420123123123";
export const contactEmail = "example@outlook.com";
export const startDate1 = "1.7.2025";
export const endDate1 = "8.7.2025";
export const startDate2 = "15.7.2025";
export const endDate2 = "22.7.2025";
export const startDate3 = "1.8.2025";
export const endDate3 = "8.8.2025";
export const campStudentsNumber = "23";
export const campStudentsAge = "6-15 let";
export const campAdultsNumber = "3";
export const natureStudentsNumber = "15";
export const natureStudentsAge = "12-13";
export const natureAdultsNumber = "2";
export const natureStartTime = "10:00";
export const natureEndTime = "10:00";
export const orderConfirmationTitle = "Děkujeme za objednávku";
export const orderConfirmationMessage = "Díky";

export const ApplicationTexts = {
    loginPage: {
        title:'Přihlášení - Czechitas',
        emailFieldLabel: 'Email',
        passwordFieldLabel: 'Heslo',
        loginButtonLabel: 'Přihlásit',
    },
    applicationsPage: {
        title: 'Přihlášky - Czechitas',
        applicationsSectionName: 'Přihlášky'
    }
}