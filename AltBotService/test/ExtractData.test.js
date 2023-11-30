'use strict';
// import { jest, test, expect } from "@jest/globals";

const SUCCESS = {_: "An object"};

beforeEach(() => {
    jest.resetModules();
});

test('ExtractData from DB Success', async () => {
    const mysql = require('mysql2');
    const query = jest.fn((_, callback) => {
        callback(undefined, SUCCESS);
    });
    const end = jest.fn();
    jest.spyOn(mysql, 'createConnection').mockImplementation(() => {
        return {query, end};
    });
    const dut = require('../ExtractData');
    const result = await dut();
    expect(result).toBe(SUCCESS);
    expect(end).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledTimes(1);
});

test('ExtractData from DB Failure', async () => {
    const mysql = require('mysql2');
    const query = jest.fn((_, callback) => {
        callback(new Error("test-error"), undefined);
    });
    const end = jest.fn();
    jest.spyOn(mysql, 'createConnection').mockImplementation(() => {
        return {query, end};
    });
    const dut = require('../ExtractData');
    await expect(dut()).rejects.toThrow();
    expect(end).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledTimes(1);
});
