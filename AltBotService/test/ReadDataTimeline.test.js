"use strict";
/**
 * @file Unit test for ReadDataTimeline.js
 * @author Eddie
 */

/* global jest, test, expect */

// Mock return value from server
const mock_ret_val = {
  data: [
    {
      media_attachments: [
        {
          description: null,
          url: 'test-url1',
          id: 'test-id1'
        },
        {
            description: 'something',
            url: 'test-url2',
            id: 'test-id2'
        }
      ],
    },
    {
        media_attachments: [
            {
                description: null,
                url: 'test-url3',
                id: 'test-id3'
            }
        ]
    },
    {
        media_attachments: []
    }
  ],
};

// Expected result pattern
const matcher = {
    imageUrl: expect.stringMatching(/test-url(1|3)/),
    imageId: expect.stringMatching(/test-id(1|3)/)
}

// Mock mastodon-api that returns `mock_ret_val` for `GET timelines/home`
jest.mock("mastodon-api", () => {
  const con = jest.fn();
  const get = jest.fn((method) => {
    if (method === "timelines/home") {
      return mock_ret_val;
    } else return { data: [] };
  });
  class Mastodon {
    static con = con;
    static get = get;
    constructor() {
      con();
      this.get = get;
    }
  }
  return Mastodon;
});

// Mock winston logger
jest.mock("winston", () => require('./winston'));

// Mock dotenv
jest.mock("dotenv");

// Main test
test('ReadDataTimeline', async () => {
    const m = require('mastodon-api');
    const dut = require('../ReadDataTimeline');
    // Call DUT
    const ret = await dut();
    // should return 1 & 3
    expect(ret).toHaveLength(2);
    expect(ret[0]).toMatchObject(matcher);
    expect(ret[1]).toMatchObject(matcher);
    // should construct a Mastodon object and call `get`
    expect(m.con).toHaveBeenCalled();
    expect(m.get).toHaveBeenCalled();
});
