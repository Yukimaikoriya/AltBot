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
jest.mock("mysql2", () => {
  const conn = {
    connect: jest.fn((callback) => {
      callback(undefined);
    }),
    query: jest.fn((query, callback) => {
      console.log(`Got query <${query}>`);
      callback(undefined, undefined);
    }),
    end: jest.fn((callback) => {
      callback(undefined);
    }),
  };
  return {
    conn,
    createConnection: jest.fn(() => {
      return conn;
    }),
  };
});

// Mock ReadDataTimeline that returns fixed value `mock_img_list`
jest.mock("../ReadDataTimeline", () => {
  return jest.fn(async () => {
    return mock_img_list;
  });
});

// Main test group
describe("SaveToDB", () => {
  // reset modules before each run
  beforeEach(() => {
    jest.resetModules();
  });

  // Case 1: success
  it("success", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2");
    // Call DUT
    const dut = require("../SaveToDB");
    // the script does some async jobs. wait for it
    await jest.runAllTimersAsync();
    // Should read once
    expect(read).toHaveBeenCalledTimes(1);
    // Should create 1 connection
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    // Should connect once
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    // Should execute 2 queries
    expect(mysql.conn.query).toHaveBeenCalledTimes(2);
    // Should end the connection
    expect(mysql.conn.end).toHaveBeenCalledTimes(1);
  });

  // Case 2: connection failed
  it("connection failure", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2");
    // Modify mock connect to fail
    mysql.conn.connect.mockImplementation((callback) => {callback("connection failure");});
    // Call DUT
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    // Should read once
    expect(read).toHaveBeenCalledTimes(1);
    // Should create 1 connection
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    // Should connect once
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    // should not execute any queries
    expect(mysql.conn.query).toHaveBeenCalledTimes(0);
    // should not end the connection
    expect(mysql.conn.end).toHaveBeenCalledTimes(0);
  });

  // Case 3: query failed
  test("Query failure", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2");
    // Modify mock query to fail
    mysql.conn.query.mockImplementation((query, callback) => {callback("Query failure", undefined);});
    // Call DUT
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    // should read once
    expect(read).toHaveBeenCalledTimes(1);
    // should create 1 connection
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    // should connect once
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    // should execute 1 query
    expect(mysql.conn.query).toHaveBeenCalledTimes(1);
    // should end the connection
    expect(mysql.conn.end).toHaveBeenCalledTimes(1);
  });

  // Case 4: End failed
  test("End failure", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2");
    // Modify mock end to fail
    mysql.conn.end.mockImplementation((callback) => {callback("End failure");});
    // Call DUT
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    // All the same as Case 1
    expect(read).toHaveBeenCalledTimes(1);
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    expect(mysql.conn.query).toHaveBeenCalledTimes(2);
    expect(mysql.conn.end).toHaveBeenCalledTimes(1);
  });
});
