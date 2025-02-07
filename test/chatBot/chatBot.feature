Feature: Manage ChatBots in the system

  Background: 
    Given the system is set up for chatbot management

  # Scenario for getting all chatBots
  Scenario: Get all chatBots
    Given the admin is authenticated
    When I request the list of chatBots
    Then the response status should be 200
    And the response should contain a list of chatBots

  # Scenario for getting a chatBot by ID
  Scenario: Get a chatBot by ID
    Given the admin is authenticated
    And a chatBot with ID "605c72ef153207001f2f492" exists
    When I request the chatBot with ID "605c72ef153207001f2f492"
    Then the response status should be 200
    And the response should contain the chatBot with ID "605c72ef153207001f2f492"

  # Scenario for adding a new chatBot
  Scenario: Add a new chatBot
    Given the admin is authenticated
    When I provide valid chatbot data:
      | name           | message | prompt_message     | status | image            |
      | Test ChatBot   | Hello!  | Start conversation | 1      | test_image.png   |
    And I submit the data to create the chatBot
    Then the response status should be 201
    And the response should contain the new chatBot details

  # Scenario for updating an existing chatBot
  Scenario: Update an existing chatBot
    Given the admin is authenticated
    And a chatBot with ID "605c72ef153207001f2f492" exists
    When I provide updated chatbot data for the chatBot with ID "605c72ef153207001f2f492":
      | name         | message  | prompt_message  | status |
      | Updated Bot  | Hi there | New prompt      | 1      |
    And I submit the updated data for chatBot ID "605c72ef153207001f2f492"
    Then the response status should be 200
    And the response should contain the updated chatBot details

  # Scenario for deleting a chatBot
  Scenario: Delete a chatBot by ID
    Given the admin is authenticated
    And a chatBot with ID "605c72ef153207001f2f492" exists
    When I delete the chatBot with ID "605c72ef153207001f2f492"
    Then the response status should be 200
    And the response should confirm the chatBot deletion

