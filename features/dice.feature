Feature: Dice word randomizer
  As a Bitcoiner
  I want to create phrase of 23 random words
  So that I can generate a secure private key

  Scenario: Loading the page
    Given I open the Dice randomizer
    Then the input field number 2 and onward is disabled
    And the Add Word button should be disabled
    #And the helper text should be "0 words of 23. 23 to go."
    #And the error text should be blank

  Scenario: Reduce the words in the word list with one die
    Given I open the Dice randomizer
    When I enter 1 in dice number 1
#    Then the focus should shift to dice number 2
    Then the input field number 3 and onward is disabled
    And the word list should contain 1024 words
    And the Add Word button should be disabled

  Scenario: Reduce the words in the word list with four dice
    Given I open the Dice randomizer
    And I enter 6 in dice number 1
    And I enter 6 in dice number 2
    And I enter 3 in dice number 3
    When I enter 2 in dice number 4
#    Then the focus should shift to dice number 5
    Then the input field number 6 and onward is disabled
    And the word list should contain 128 words

  Scenario: Add a word to the phrase
    Given I open the Dice randomizer
    And I enter 6 in dice number 1
    And I enter 6 in dice number 2
    And I enter 3 in dice number 3
    And I enter 3 in dice number 4
    And I enter 3 in dice number 5
    And I enter 3 in dice number 6
    And I enter 3 in dice number 7
    And I enter 3 in dice number 8
    And I enter 3 in dice number 9
    And I enter 3 in dice number 10
    When I enter 3 in dice number 11
    Then the word list should contain 1 word
    And the Add Word button should be enabled
    When I click the Add Word button
    Then the word in the word list should be "scale"
    #And the last word of the phrase should be "scale"
    And the last word of the phrase should be the one word in the word list
