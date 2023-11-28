'use strict';
// import { jest, test, expect } from "@jest/globals";

const mock_img_list = [
    {
        imageUrl: 'test-url1',
        imageId: 'test-id1'
    },
    {
        imageUrl: 'test-url2',
        imageId: 'test-id2'
    }
];

jest.mock('mysql2', () => {
    const conn = {
        connect: jest.fn(callback => {
            callback(undefined);
        }),
        query: jest.fn((query, callback) => {
            console.log(`Got query <${query}>`);
            callback(undefined, undefined);
        }),
        end: jest.fn((callback) => {callback(undefined);})
    };
    return {
        conn,
        createConnection: jest.fn(() => {return conn;})
    };
});

jest.mock('../ReadDataTimeline', () => {
    return jest.fn(async () => {
        return mock_img_list;
    });
});

test('SaveToDB', async () => {
    const read = require('../ReadDataTimeline');
    const mysql = require('mysql2');
    const dut = require('../SaveToDB');
    await jest.runAllTimersAsync();
    expect(read).toHaveBeenCalledTimes(1);
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    expect(mysql.conn.query).toHaveBeenCalledTimes(2);
    expect(mysql.conn.end).toHaveBeenCalledTimes(1);
});
