Feature: User Authentication

  # Scenario 1: User Registration
  Scenario: User registers successfully with valid details
    Given a user with the following details:
      | name  | email            | mobile     | password     |
      | test  | test-1@AZR.com    | 1234567892 | Test154-8    |
    When they register
    Then they should receive a 201 status code
    And they should receive a success message

  Scenario: User tries to register with an empty email
    Given a user with the following details:
      | name  | email | mobile     | password     |
      | test  |       | 1234567890 | Test154-8    |
    When they register
    Then they should receive a 400 status code
    And they should receive an error message "Email is required"

  # Scenario 2: User Login
  Scenario: User logs in successfully with valid credentials
    Given a user with the following credentials:
      | email           | password    |
      | test-1@AZR.com   | Test154-8   |
    When they log in
    Then they should receive a 200 status code
    And they should receive a success message "Login successful"
    And they should receive a valid JWT token

  Scenario: User tries to log in without an email
    Given a user with the following credentials:
      | email | password    |
      |       | Test154-8   |
    When they log in
    Then they should receive a 400 status code
    And they should receive an error message "Email and password are required"

  Scenario: User tries to log in with an invalid password
    Given a user with the following credentials:
      | email           | password    |
      | test-1@AZR.com   | Test154-88  |
    When they log in
    Then they should receive a 401 status code
    And they should receive an error message "Invalid email or password"

  # Scenario 3: User Profile
  Scenario: User retrieves profile successfully with a valid token
    Given a user with the following token:
      | token           |
      | some-valid-token |
    When they request their profile
    Then they should receive a 200 status code
    And they should receive their profile details:
      | user_id | user_name | user_email      | user_mobile  |
      | 60f6a9a6e3f1f1d6f4b3b6c6 | Test User | test@example.com | 1234567890 |

  Scenario: User tries to access profile without a token
    Given a user without a token
    When they request their profile
    Then they should receive a 401 status code
    And they should receive an error message "Access Denied"

  Scenario: User tries to access profile with an invalid token
    Given a user with the following invalid token:
      | token            |
      | invalid-token    |
    When they request their profile
    Then they should receive a 400 status code
    And they should receive an error message "Invalid Token"

  # Scenario 4: Authentication Middleware
  Scenario: User accesses a protected route with a valid token
    Given a user with a valid token
    When they access a protected route
    Then they should be allowed access to the resource

  Scenario: User tries to access a protected route without a token
    Given a user without a token
    When they access a protected route
    Then they should receive a 401 status code
    And they should receive an error message "Access Denied"

  Scenario: User tries to access a protected route with an invalid token
    Given a user with an invalid token
    When they access a protected route
    Then they should receive a 400 status code
    And they should receive an error message "Invalid Token"
