const jwt = require('jsonwebtoken');
const jest = require('jest');
const authcontroller = require('../../Controller/authController');
const auth = require('../../middlewares/auth');

// Mocking the jwt module
jest.mock('jsonwebtoken');



// Register test
describe('register', () => {
    it('should return 201 status code when registration is successful', async () => {
        const req = {
            body: {
                name: 'test',
                email: 'test-1@AZR.com',  // Valid email
                mobile: '1234567892',
                password: 'Test154-8' // valid password between 8 to 30 characters must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        // Call the register function
        await authcontroller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return an error when the email is invalid or empty', async () => {
        const req = {
            body: {
                name: 'test',
                email: '',  // Invalid email (empty)
                mobile: '1234567890',
                password: 'Test154-8'
            }
        };
        // Mock response object
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await authcontroller.register(req, res);

        //  Expecting a 400 status code for bad request ( email is missing : empty)
        expect(res.status).toHaveBeenCalledWith(400);  
        expect(res.json).toHaveBeenCalledWith({
            error: 'Email is required'
        });
    });
});

//---------------------------------------------------------------------------------------------------//
// login test
describe('login', () => {
    it('should return 200 status code for successful login', async () => {
        const req = {
            body: {
                email: 'test-1@AZR.com', // Valid email
                password: 'Test154-8'    // Valid password
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        // Call the login function
        await authcontroller.login(req, res);

        // Expecting a 200 status code for successful login
        expect(res.status).toHaveBeenCalledWith(200);
        //  You may also expect a message and token 
        expect(res.json).toHaveBeenCalledWith({
            message: 'Login successful',
            
            token: expect.any(String)
        });
    });

    it('should return 400 for missing email or password', async () => {
        const req = {
            body: {
                email: '',  // Invalid email (empty)
                password: 'Test154-8'
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        // Call the login function
        await authcontroller.login(req, res);

        // Expecting a 400 status code for bad request (since email is missing : empty)
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Email and password are required'
        });
    });

    it('should return 401 for invalid credentials', async () => {
        const req = {
            body: {
                email: 'test-1@AZR.com',// Valid email
                password: 'Test154-88' // Invalid password
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        // Call the login function
        await authcontroller.login(req, res);

        // Expecting a 401 status code for unauthorized login attempt
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid email or password'
        });
    });
});



//---------------------------------------------------------------------------------------------------//
// profile test
describe('profile', () => {
    it('should return 200 status code for successful profile retrieval', async () => {
        // Mocking the token verification to simulate a valid token
        const mockToken = 'some-valid-token';
        jwt.verify.mockImplementation((token, secret) => {
            if (token === mockToken) {
                return { user: { _id: '60f6a9a6e3f1f1d6f4b3b6c6', name: 'Test User', email: 'test@example.com', mobile: '1234567890' } };
            } else {
                throw new Error('Invalid Token');
            }
        });

        // Simulate a request with the user attached after the middleware
        const req = {
            header: jest.fn().mockReturnValue(mockToken), // Simulate Authorization header
            user: {
                _id: '60f6a9a6e3f1f1d6f4b3b6c6',
                name: 'Test User',
                email: 'test@example.com',
                mobile: '1234567890'
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        // Call the profile function
        await authcontroller.profile(req, res);

        // Expecting a 200 status code for successful profile retrieval
        expect(res.status).toHaveBeenCalledWith(201); 

        // Expecting the user profile data to be returned
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'User profile data',
            user_id: req.user._id,
            user_name: req.user.name,
            user_email: req.user.email,
            user_mobile: req.user.mobile,
        });
    });


    // Test for no token provided
    it('should return 401 for no token provided', async () => {
        const req = {
            header: jest.fn().mockReturnValue(null) // Simulating no token
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await auth(req, res, () => {}); // Call the middleware directly

        // Expecting a 401 for missing token
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Access Denied'
        });
    });

    // Test for invalid token
    it('should return 400 for invalid token', async () => {
        // Simulate a request with an invalid token
        const req = {
            header: jest.fn().mockReturnValue('invalid-token') // Invalid token
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        // Mock jwt.verify to throw an error for invalid token
        jwt.verify.mockImplementation(() => {
            throw new Error('Invalid Token');
        });

        await auth(req, res, () => {}); // Call the middleware directly

        // Expecting a 400 for invalid token
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid Token'
        });
    });
});


