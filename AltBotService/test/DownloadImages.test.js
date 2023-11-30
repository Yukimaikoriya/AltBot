'use strict';
//  import { test, jest, describe, expect } from "@jest/globals";


const testData = [
    {imageId: 'test-image1',imageUrl: 'test-url1', flag: 'test-flag1'},
    {imageId: 'test-image2', imageUrl: 'test-url2', flag: 'test-flag2'}
];

jest.mock('../ExtractData', () => {
    return jest.fn(async () => {return testData;});
});

jest.mock('https', () => {
    const pipe = jest.fn(arg => {
        let ret = {};
        ret.on = () => ret;
        ret.once = () => ret;
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

jest.mock('fs', () => {
    return {
        createWriteStream: jest.fn((a) => {return a;})
    }
});

test('DownloadImages', async () => {
    const ed = require('../ExtractData');
    const https = require('https');
    const fs = require('fs');
    const dut = require('../DownloadImages');
    await jest.runAllTimersAsync();
    expect(https.get).toBeCalledTimes(2);
    expect(fs.createWriteStream).toBeCalledTimes(1);
    expect(fs.createWriteStream).toBeCalledWith('OutputImages/test-image1.png');
    expect(https.resume).toBeCalledTimes(1);
});
