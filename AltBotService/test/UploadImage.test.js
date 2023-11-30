'use strict';
// import { jest, test, expect } from "@jest/globals";


const mock_files = [
    'test-file1.jpg',
    'test-file2.jpg',
    'test-file3'
];

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

test('UploadImage', async () => {
    const fs = require('fs');
    const m = require('mastodon-api');
    const dut = require('../UploadImage');
    await jest.runAllTimersAsync();
    expect(fs.readdir).toHaveBeenCalledTimes(1);
    expect(fs.statSync).toHaveBeenCalledTimes(3);
    expect(fs.createReadStream).toHaveBeenCalledTimes(2);
    expect(m.con).toHaveBeenCalledTimes(1);
    expect(m.nstatus).toBe(2);
    expect(m.post).toHaveBeenCalledTimes(4);
})
