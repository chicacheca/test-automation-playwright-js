# Test Automation with Playwright/JavaScript

## Initial setup
First make user you have Node.js 20.8 installed. 

If you sue NVM (recommended), tun the following command to set correct version of Node.js:
```
nvm use
```

Then install the dependencies:
```
npm install
```

## Setup environment variables
Create a `.env` file in the root of the project and add the following variables:
```
BASE_URL=https://example.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```
Change the values to match your environment.

## Running tests

**Run tests in interactive mode (recommended):**
```
npx playwright test --ui
```

**Run tests in headless mode:**
```
npx playwright test
```

**Generate a report:**
```
npx playwright show-report
```

## Running examples

**Examples (lesson 1 - 11):**
```
npx playwright test --config=playwright.examples.config.js --ui 
```

**Cucumber examples (lesson 12):**
```
npx playwright test --config=playwright.cucumber.config.js --ui
```

**Cucumber BDD generator:**
```
npx bddgen --config=playwright.cucumber.config.js
```

## Update playwright
```
npx playwright install 
```

# Docker
You can run tests in Docker. There is a dedicated cofing file for Docker: `playwright.docker.config.js`.
```
docker-compose up --build
```
