const chatBotcontroller = require('../../Controller/adminController');
const chatBot = require('../../models/chatBot'); // Assuming chatBot is your model
const jest = require('jest');

// Mock the chatBot model
jest.mock('../../models/chatBot', () => ({
    find: jest.fn(),
}));

// getChatBot test
describe('getChatBot', () => {
    it('should return 200 status code when fetching chatBots is successful', async () => {
        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        // Mock the find method to return a fake chatBot list
        const fakeChatBots = [{ id: 1, name: 'Bot1' }, { id: 2, name: 'Bot2' }];
        chatBot.find.mockResolvedValue(fakeChatBots);

        // Call the getChatBot function
        await chatBotcontroller.getChatBot(req, res);

        // Expecting 200 status code
        expect(res.status).toHaveBeenCalledWith(200);
        // Expecting the correct chatBots to be returned
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            chatBots: fakeChatBots,
        });
    });

    it('should return 404 status code when no chatBots are found', async () => {
        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        // Mock the find method to return an empty array
        chatBot.find.mockResolvedValue([]);

        // Call the getChatBot function
        await chatBotcontroller.getChatBot(req, res);

        // Expecting 404 status code for no chatBots found
        expect(res.status).toHaveBeenCalledWith(404);
        // Expecting the correct error message
        expect(res.json).toHaveBeenCalledWith({
            error: 'Error fetching chatBots',
        });
    });

    it('should return 500 status code when there is an error fetching chatBots', async () => {
        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        // Mock the find method to simulate an error
        chatBot.find.mockRejectedValue(new Error('Database error'));

        // Call the getChatBot function
        await chatBotcontroller.getChatBot(req, res);

        // Expecting 500 status code for an internal server error
        expect(res.status).toHaveBeenCalledWith(500);
        // Expecting the correct error message
        expect(res.json).toHaveBeenCalledWith({
            error: 'Error fetching chatBots',
        });
    });
});



// getChatBotById test
describe('getChatBotById', () => {
    it('should return 200 status code when fetching chatBot by id is successful', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        // Mock the findById method to return a fake chatBot
        const fakeChatBot = { id: 1, name: 'Bot1' };
        chatBot.findById.mockResolvedValue(fakeChatBot);

        // Call the getChatBotById function
        await chatBotcontroller.getChatBotById(req, res);

        // Expecting 200 status code
        expect(res.status).toHaveBeenCalledWith(200);
        // Expecting the correct chatBot to be returned
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            chatBot: fakeChatBot,
        });
    });

    it('should return 404 status code when chatBot is not found', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        // Mock the findById method to return null
        chatBot.findById.mockResolvedValue(null);

        // Call the getChatBotById function
        await chatBotcontroller.getChatBotById(req, res);

        // Expecting 404 status code for chatBot not found
        expect(res.status).toHaveBeenCalledWith(404);
        // Expecting the correct error message
        expect(res.json).toHaveBeenCalledWith({
            error: 'ChatBot not found',
        });
    });

    it('should return 500 status code when there is an error fetching chatBot by id', async () => {
        const req = { params: { id: 1 } };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn(),
        };

        // Mock the findById method to simulate an error
        chatBot.findById.mockRejectedValue(new Error('Database error'));

        // Call the getChatBotById function
        await chatBotcontroller.getChatBotById(req, res);

        // Expecting 500 status code for an internal server error
        expect(res.status).toHaveBeenCalledWith(500);
        // Expecting the correct error message
        expect(res.json).toHaveBeenCalledWith({
            error: 'Error fetching chatBot',
        });
    });
});

//-----------------------------------------------------------------------------------------//
