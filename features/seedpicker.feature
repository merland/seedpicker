Feature: Seedpicker Calculator
  As a user of Seedpicker
  I want to calculate the the 24th word
  So that I can be sure that my phrase is valid

  Scenario: Generate last word from a seed phrase
    Given I open the Seedpicker calculator
    And I enter the words "     empower  soul    reunion  entire  help raise      truth reflect    argue transfer chicken narrow oak friend junior figure auto small push spike next pledge december  "
    When I press ENTER
    Then I can see the last word
    And the last word should be "bridge"

