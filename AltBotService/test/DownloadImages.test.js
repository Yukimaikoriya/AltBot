'use strict';
/**
 * @file Unit test for DownloadImages.js
 * @author Eddie
 */

// Fake data for testing
const testData = [
    {image_id: 'test-image1',image_url: 'test-url1', flag: 'test-flag1'},
    {image_id: 'test-image2', image_url: 'test-url2', flag: 'test-flag2'}
];

// Mock Extractdata. Return fixed data from testData
jest.mock('../ExtractData', () => {
    return jest.fn(async () => {return testData;});
});

// Mock https module. 
// Return success 200 for test-url1, failure 404 otherwise
jest.mock('https', () => {
    // Mock pipe that closes immediately
    const pipe = jest.fn(arg => {
        let ret = {};
        ret.on = (event, callback) => {
            if (event === 'close') callback();
            return ret;
        };
        ret.once = ret.on;
        return ret;
    });
    const resume = jest.fn();
    return {
        pipe,
        resume,
        get: jest.fn((url, callback) => {
            if (url === 'test-url1') {
                callback({
                    statusCode: 200,
                    pipe
                });
            } else {
                callback({
                    statusCode: 404,
                    resume
                })
            }
        })
    };
});

// Mock fs module. Does nothing for createWriteStream
jest.mock('fs', () => {
    return {
        createWriteStream: jest.fn((a) => {return a;})
    }
});

// Test for DownloadImages
test('DownloadImages', async () => {
    const ed = require('../ExtractData');
    const https = require('https');
    const fs = require('fs');
    // run the main script
    const dut = require('../DownloadImages');
    // the script does some async job so we must wait
    await jest.runAllTimersAsync();
    // Should call 2 GETs for 2 urls in testData
    expect(https.get).toBeCalledTimes(2);
    // Should call 1 fs write for 1 valid url in testData
    expect(fs.createWriteStream).toBeCalledTimes(1);
    // Ensure the write is called with correct image
    expect(fs.createWriteStream).toBeCalledWith('OutputImages/test-image1.png');
    // Should call 1 resume for 1 invalid url in testData
    expect(https.resume).toBeCalledTimes(1);
});
