#noinspection NonAsciiCharacters

Feature: Login Page


  Background:
    Given user is on the Czechitas login page

  Scenario: User should see login form

    Then user sees Přihlásit link in the navbar
    And user sees login form with button Přihlásit


  Scenario: User can login with valid credentials

    Given user provides username "@ADMIN_USERNAME@" and password "@ADMIN_PASSWORD@"
    When user clicks on login button
    Then user is logged in as "@ADMIN_FULL_NAME@"


  Scenario Outline: User cannot login with invalid credentials

    Given user provides username "<username>" and password "<password>"
    When user clicks on login button
    Then toast message pops up: "Některé pole obsahuje špatně zadanou hodnotu"
    And login form error is shown: "Tyto přihlašovací údaje neodpovídají žadnému záznamu."
    And user sees Přihlásit link in the navbar
    And user sees login form with button Přihlásit

    Examples:
      | username           | password         |
      | @ADMIN_USERNAME@   | invalid          |
      | nikdo@czechitas.cz | @ADMIN_PASSWORD@ |


  Scenario: User can logout

    Given user provides username "@ADMIN_USERNAME@" and password "@ADMIN_PASSWORD@"
    And user clicks on login button
    And user is logged in as "@ADMIN_FULL_NAME@"
    When user clicks on logout in the navbar
    And user sees Přihlásit link in the navbar
