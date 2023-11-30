'use strict';
/**
 * @file Unit test for UploadImage.js
 * @author Eddie
 */


// Mock files in directory
const mock_files = [
    'test-file1.jpg',
    'test-file2.jpg',
    'test-file3'
];

// Mock module mastodon-api with mock method `POST media` and `POST statuses`
jest.mock("mastodon-api", () => {
    const con = jest.fn();
    class Mastodon {
        static nstatus = 0;
      static con = con;
      static post = jest.fn(async (method, arg) => {
        if (method === "media") {
          return {data: {id: arg.file}}
        } else if (method === 'statuses') {
          Mastodon.nstatus += 1;
        } else return { data: [] };
      });
      constructor(arg) {
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
        statSync: jest.fn((path) => {
            return {
                isFile: () => true
            }
        }),
        createReadStream: jest.fn(a => a)
    }
});

// Main test starts here
test('UploadImage', async () => {
    const fs = require('fs');
    const m = require('mastodon-api');
    // Call DUT
    const dut = require('../UploadImage');
    // the script does some async jobs. wait for it
    await jest.runAllTimersAsync();
    // should call readdir once
    expect(fs.readdir).toHaveBeenCalledTimes(1);
    // should call stat 3 times
    expect(fs.statSync).toHaveBeenCalledTimes(3);
    // should call read 2 times, since there are only 2 images in `mock_files`
    expect(fs.createReadStream).toHaveBeenCalledTimes(2);
    // should create 1 Mastodon object
    expect(m.con).toHaveBeenCalledTimes(1);
    // should post 2 statuses
    expect(m.nstatus).toBe(2);
    // should post 4 times. 2 for status and 2 for media.
    expect(m.post).toHaveBeenCalledTimes(4);
})
