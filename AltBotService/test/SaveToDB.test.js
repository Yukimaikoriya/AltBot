"use strict";
/**
 * @file Unit test for SaveToDB.js
 * @author Eddie
 */

// Mock image list to be returned from ReadDataTimeline
const mock_img_list = [
  {
    imageUrl: "test-url1",
    imageId: "test-id1",
  },
  {
    imageUrl: "test-url2",
    imageId: "test-id2",
  },
];

// Mock MySQL Module that always success
jest.mock("mysql2/promise", () => {
  const release = jest.fn(async () => {});
  const pool = {
    getConnection: jest.fn(async () => {
      return {
        release: release
      };
    }),
    query: jest.fn(async (query) => {
      console.log(`Got query <${query}>`);
      return [[]];
    }),
    end: jest.fn(async () => {}),
  };
  return {
    release,
    pool,
    createPool: jest.fn(() => {
      return pool;
    }),
  };
});

// Mock ReadDataTimeline that returns fixed value `mock_img_list`
jest.mock("../ReadDataTimeline", () => {
  return jest.fn(async () => {
    return mock_img_list;
  });
});

// Mock winston logger
jest.mock('winston', () => require('./winston'));

// mock dotenv
jest.mock('dotenv');

// Main test group
describe("SaveToDB", () => {
  // reset modules before each run
  beforeEach(() => {
    jest.resetModules();
  });

  // Case 1: success
  it("success", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2/promise");
    const logger = require("winston");
    // Call DUT
    const dut = require("../SaveToDB");
    // the script does some async jobs. wait for it
    await jest.runAllTimersAsync();
    // Should read once
    expect(read).toHaveBeenCalledTimes(1);
    // Should create 1 pool
    expect(mysql.createPool).toHaveBeenCalledTimes(1);
    // Should create 1 connection
    expect(mysql.pool.getConnection).toHaveBeenCalledTimes(1);
    // Should execute 1+2 queries
    expect(mysql.pool.query).toHaveBeenCalledTimes(1+2);
    // Should end the connection
    expect(mysql.pool.end).toHaveBeenCalledTimes(1);
    // Should not have any errors
    expect(logger._error).toHaveBeenCalledTimes(0);
  });

  // Case 2: connection failed
  it("connection failure", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2/promise");
    const logger = require("winston");
    // Modify mock connect to fail
    mysql.pool.getConnection.mockImplementation(async () => {throw "connection failure";});
    // Call DUT
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    // Should not read
    expect(read).toHaveBeenCalledTimes(0);
    // Should create 1 pool
    expect(mysql.createPool).toHaveBeenCalledTimes(1);
    // Should create 1 connection
    expect(mysql.pool.getConnection).toHaveBeenCalledTimes(1);
    // Should execute 0 queries
    expect(mysql.pool.query).toHaveBeenCalledTimes(0);
    // Should close the pool
    expect(mysql.pool.end).toHaveBeenCalledTimes(1);
    // Should report errors
    expect(logger._error).toHaveBeenCalled();
  });

  // Case 3: query failed
  test("Query failure", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2/promise");
    const logger = require("winston");
    // Modify mock query to fail
    mysql.pool.query.mockImplementation(async () => {throw "Query failure";});
    // Call DUT
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    // should not read
    expect(read).toHaveBeenCalledTimes(0);
    // Should create 1 pool
    expect(mysql.createPool).toHaveBeenCalledTimes(1);
    // Should create 1 connection
    expect(mysql.pool.getConnection).toHaveBeenCalledTimes(1);
    // Should execute 1 queries
    expect(mysql.pool.query).toHaveBeenCalledTimes(1);
    // Should close the pool
    expect(mysql.pool.end).toHaveBeenCalledTimes(1);
    // Should report errors
    expect(logger._error).toHaveBeenCalled();
  });

});
