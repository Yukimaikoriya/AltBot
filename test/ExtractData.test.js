'use strict';
// import { jest, test, expect } from "@jest/globals";

const SUCCESS = {_: "An object"};

test('ExtractData from DB', async () => {
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
