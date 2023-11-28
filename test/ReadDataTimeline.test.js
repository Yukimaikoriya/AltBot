"use strict";
// import { jest, test, expect } from "@jest/globals";

const mock_ret_val = {
  data: [
    {
      media_attachments: [
        {
          description: '1',
          url: 'test-url1',
          id: 'test-id1'
        },
        {
            description: null,
            url: 'test-url2',
            id: 'test-id2'
        }
      ],
    },
    {
        media_attachments: [
            {
                description: '1',
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

const matcher = {
    imageUrl: expect.stringMatching(/test-url(1|3)/),
    imageId: expect.stringMatching(/test-id(1|3)/)
}

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
    constructor(arg) {
      con();
      this.get = get;
    }
  }
  return Mastodon;
});

test('ReadDataTimeline', async () => {
    const m = require('mastodon-api');
    const dut = require('../ReadDataTimeline');
    const ret = await dut();
    expect(ret).toHaveLength(2);
    expect(ret[0]).toMatchObject(matcher);
    expect(ret[1]).toMatchObject(matcher);
    expect(m.con).toHaveBeenCalledTimes(1);
    expect(m.get).toHaveBeenCalledTimes(1);
});
