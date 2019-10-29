Feature: Dice word randomizer
  As a Bitcoiner
  I want to create phrase of 23 random words
  So that I can generate a secure private key

  Scenario: Add 23 words to the phrase
    Given I open the Dice randomizer
    When I randomly enter 23 words
    Then the phrase should have 23 words
    And the input field number 1 and onward is disabled
    And the Add Word button should be disabled
