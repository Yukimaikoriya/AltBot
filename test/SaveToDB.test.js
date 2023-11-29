"use strict";
// import { jest, test, expect } from "@jest/globals";

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

jest.mock("../ReadDataTimeline", () => {
  return jest.fn(async () => {
    return mock_img_list;
  });
});

describe("SaveToDB", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("success", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2");
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    expect(read).toHaveBeenCalledTimes(1);
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    expect(mysql.conn.query).toHaveBeenCalledTimes(2);
    expect(mysql.conn.end).toHaveBeenCalledTimes(1);
  });

  it("connection failure", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2");
    mysql.conn.connect.mockImplementation((callback) => {callback("connection failure");});
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    expect(read).toHaveBeenCalledTimes(1);
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    expect(mysql.conn.query).toHaveBeenCalledTimes(0);
    expect(mysql.conn.end).toHaveBeenCalledTimes(0);
  });

  test("Query failure", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2");
    mysql.conn.query.mockImplementation((query, callback) => {callback("Query failure", undefined);});
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    expect(read).toHaveBeenCalledTimes(1);
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    expect(mysql.conn.query).toHaveBeenCalledTimes(1);
    expect(mysql.conn.end).toHaveBeenCalledTimes(1);
  });

  test("End failure", async () => {
    const read = require("../ReadDataTimeline");
    const mysql = require("mysql2");
    mysql.conn.end.mockImplementation((callback) => {callback("End failure");});
    const dut = require("../SaveToDB");
    await jest.runAllTimersAsync();
    expect(read).toHaveBeenCalledTimes(1);
    expect(mysql.createConnection).toHaveBeenCalledTimes(1);
    expect(mysql.conn.connect).toHaveBeenCalledTimes(1);
    expect(mysql.conn.query).toHaveBeenCalledTimes(2);
    expect(mysql.conn.end).toHaveBeenCalledTimes(1);
  });
});
