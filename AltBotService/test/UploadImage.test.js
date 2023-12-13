"use strict";
/**
 * @file Unit test for UploadImage.js
 * @author Eddie
 */

/* global jest, test, expect */

// Mock files in directory
const mock_files = ["test-file1.jpg", "test-file2.jpg", "test-file3"];

// Mock module mastodon-api with mock method `POST media` and `POST statuses`
jest.mock("mastodon-api", () => {
  const con = jest.fn();
  class Mastodon {
    static nstatus = 0;
    static con = con;
    static post = jest.fn(async (method, arg) => {
      if (method === "media") {
        return { data: { id: arg.file } };
      } else if (method === "statuses") {
        Mastodon.nstatus += 1;
      } else return { data: [] };
    });
    constructor() {
      con();
      this.post = Mastodon.post;
    }
  }
  return Mastodon;
});

// Mock module fs that returns `mock_files` for `readdir`
jest.mock("fs", () => {
  return {
    readdir: jest.fn((path, callback) => {
      callback(undefined, mock_files);
    }),
    statSync: jest.fn(() => {
      return {
        isFile: () => true,
      };
    }),
    createReadStream: jest.fn((a) => a),
    readFileSync: jest.fn(),
  };
});

// Mock module axios that returns a dummy response for `post`
jest.mock("axios", () => {
  return {
    post: jest.fn(async () => ({
      data: {},
    })),
  };
});

// Mock logger without any function
jest.mock("winston", () => {
  return require("./winston");
});

// Mock path
jest.mock("path");

// Mock dotenv
jest.mock("dotenv");

// Mock dbutil
jest.mock("../UploadImage/dbutil", () => {
  return {
    updateAltTextFlag: jest.fn(async () => {}),
    retrievePostId: jest.fn(async () => {
      return "MockId#0";
    }),
    closeConnection: jest.fn(),
  };
});

// Main test starts here
test("UploadImage", async () => {
  const fs = require("fs");
  const m = require("mastodon-api");
  const axios = require("axios");
  // Call DUT
  require("../UploadImage/UploadImage");
  // the script does some async jobs. wait for it
  await jest.runAllTimersAsync();
  // should call readdir once
  expect(fs.readdir).toHaveBeenCalledTimes(1);
  // should call stat 3 times
  expect(fs.statSync).toHaveBeenCalledTimes(3);
  // should call read 2 times, since there are only 2 images in `mock_files`
  expect(fs.createReadStream).toHaveBeenCalledTimes(2);
  // should call axios.post 2 times
  expect(axios.post).toHaveBeenCalledTimes(2);
  // should create 1 Mastodon object
  expect(m.con).toHaveBeenCalledTimes(1);
  // should post 2 statuses
  expect(m.nstatus).toBe(2);
  // should post 4 times. 2 for status and 2 for media.
  expect(m.post).toHaveBeenCalledTimes(4);
});
