'use strict';
// import { jest, test, expect } from "@jest/globals";

jest.mock('mastodon-api', () => {
    class Mastodon {
        static post = jest.fn((method, args, callback) => {
            callback(undefined, undefined);
        });
        constructor(any) {
            this.post = Mastodon.post;
        }
    }
    return Mastodon;
});

test('bot', () => {
    const m = require('mastodon-api');
    const dut = require('../bot');
    expect(m.post).toBeCalledTimes(1);
    expect(m.post).toBeCalledWith('statuses', expect.anything(), expect.anything());
});
