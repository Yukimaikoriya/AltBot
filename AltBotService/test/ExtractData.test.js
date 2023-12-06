'use strict';
/**
 * @file Unit test for ExtractData.js
 * @author Eddie
 */

/* global jest, test, expect, beforeEach */

// Mock success value
const SUCCESS = {_: "An object"};

// Mock winston logger
jest.mock('winston', () => require('./winston'));

// Mock dotenv
jest.mock('dotenv');

// Reset modules before each test
beforeEach(() => {
    jest.resetModules();
});

// Case 1 : success
test('ExtractData from DB Success', async () => {
    const mysql = require('mysql2');
    // the mocked query function will return SUCCESS regardless
    const query = jest.fn((_, callback) => {
        callback(undefined, SUCCESS);
    });
    const end = jest.fn();
    jest.spyOn(mysql, 'createConnection').mockImplementation(() => {
        return {query, end};
    });
    // Call the DUT
    const dut = require('../ExtractData');
    const result = await dut();
    // Result should be SUCCESS
    expect(result).toBe(SUCCESS);
    // the connection should end
    expect(end).toHaveBeenCalledTimes(1);
    // 1 query should be executed
    expect(query).toHaveBeenCalledTimes(1);
});

// Case 2 failure
test('ExtractData from DB Failure', async () => {
    const mysql = require('mysql2');
    // the mocked query function will throw an error regardless
    const query = jest.fn((_, callback) => {
        callback(new Error("test-error"), undefined);
    });
    const end = jest.fn();
    jest.spyOn(mysql, 'createConnection').mockImplementation(() => {
        return {query, end};
    });
    // Call the DUT
    const dut = require('../ExtractData');
    // should throw an error
    await expect(dut()).rejects.toThrow();
    // should end the connection
    expect(end).toHaveBeenCalledTimes(1);
    // should execute 1 query
    expect(query).toHaveBeenCalledTimes(1);
});
