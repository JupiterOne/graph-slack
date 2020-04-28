import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks(); // turn on fetch mocking
fetchMock.dontMock(); // don't do it unless explicitly enabled in tests
