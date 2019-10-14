Feature: Seedpicker Calculator
  As a user of Seedpicker
  I want to calculate the the 24th word
  So that I can be sure that my phrase is valid

  Scenario: Generate last word from a seed phrase
    Given I open the Seedpicker calculator
    And I enter 23 valid words
    When I press ENTER
    Then I can see the last word
    And the last word should be "bridge"
    And the Extended Public Key should start with "Zpub"

  Scenario: Display QR-code for valid phrase
    Given I open the Seedpicker calculator
    And I enter 23 valid words
    When I click the Calculate button
    Then I can see the last word
    When I click the QR-code button
    Then I should see the QR-code
    And I should see the Extended Public Key in the same dialog
    When I click the close-x on the QR-code dialog
    Then the QR-code dialog should go away

  Scenario: Display adanced section
    Given I open the Seedpicker calculator
    And I enter 23 valid words
    When I click the Calculate button
    Then I can see the last word
    And the Advanced button has the text "Show more (for advanced users)"
    And I should not see the Avanced-section
    When I click the Advanced button
    Then I should see the Advanced-section
    And the Advanced button has the text "Show less"
    And I should see the xpub key
