// jest.setup.ts
import '@testing-library/jest-dom/extend-expect';
import { server } from './src/tests/mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());