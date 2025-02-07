const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const app = require('../../server');

let response;
let user;
let token;

// Scenario 1: User Registration
Given('a user with the following details:', async function (table) {
  user = table.rowsHash(); // Convert the table into a hash for easy access
});

When('they register', async function () {
  response = await request(app)
    .post('/api/register')
    .send(user);
});

Then('they should receive a {int} status code', function (statusCode) {
  expect(response.status).toBe(statusCode);
});

Then('they should receive a success message', function () {
  expect(response.body.message).toBe('User registered successfully');
});

Then('they should receive an error message {string}', function (errorMessage) {
  expect(response.body.error).toBe(errorMessage); 
});

// Scenario 2: User Login
Given('a user with the following credentials:', async function (credentialsTable) {
  user = credentialsTable.rowsHash(); 
});

When('they log in', async function () {
  response = await request(app)
    .post('/api/login') 
    .send(user);
});

Then('they should receive a {int} status code', function (statusCode) {
  expect(response.status).toBe(statusCode);
});

Then('they should receive a success message {string}', function (message) {
  expect(response.body.message).toBe(message); // Ensure the message is correct
});

Then('they should receive a valid JWT token', function () {
  expect(response.body.token).toBeDefined(); // Ensure the token is present
});

// Scenario 3: User Profile
Given('the user with the following token:', async function (dataTable) {
  token = dataTable.hashes()[0].token; 
});

When('they request their profile', async function () {
  response = await request(app)
    .get('/api/profile') 
    .set('Authorization', `Bearer ${token}`);
});

Given('the user with the following token:', async function (table) {
  token = table.hashes()[0].token; 
});

Then('they should receive their profile details:', function (dataTable) {
  const profile = dataTable.rowsHash();
  expect(response.body.user_id).toBe(profile.user_id);
  expect(response.body.user_name).toBe(profile.user_name);
  expect(response.body.user_email).toBe(profile.user_email);
  expect(response.body.user_mobile).toBe(profile.user_mobile);
});

// Scenario 4: Authentication Middleware
Given('a user with a valid token', async function () {
  // Obtain a valid token, perhaps from the login process
  response = await request(app)
    .post('/api/login')
    .send({ email: 'test-1@AZR.com', password: 'Test154-8' }); // Login to get a token with valid credentials
  token = response.body.token;
});

When('they access a protected route', async function () {
  response = await request(app)
    .get('/api/profile') 
    .set('Authorization', `${token}`);
});

Then('they should be allowed access to the resource', function () {
  expect(response.status).toBe(200); 
});

Given('a user without a token', function () {
  token = ''; // Simulate no token
});


// Scenario 4: Admin Authentication Middleware : 
When('they access a protected route', async function () {
  response = await request(app)
    .get('/api/profile') 
    .set('Authorization', `${token}`);
});

Then('they should receive a {int} status code', function (statusCode) {
  expect(response.status).toBe(statusCode);
});

Then('they should receive an error message {string}', function (errorMessage) {
  expect(response.body.error).toBe(errorMessage); 
});

Given('a user with an invalid token', function () {
  token = 'invalid-token'; 
});

Then('they should receive a {int} status code', function (statusCode) {
  expect(response.status).toBe(statusCode);
});

Then('they should receive an error message {string}', function (errorMessage) {
  expect(response.body.error).toBe(errorMessage); 
});
