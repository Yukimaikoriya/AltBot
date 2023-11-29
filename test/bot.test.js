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

beforeEach(() => {
    jest.resetModules();
});

test('bot success', () => {
    const m = require('mastodon-api');
    const dut = require('../bot');
    expect(m.post).toBeCalledTimes(1);
    expect(m.post).toBeCalledWith('statuses', expect.anything(), expect.anything());
});


test('bot failure', () => {
    const m = require('mastodon-api');
    m.post.mockImplementation((method, args, callback) => {callback("error", undefined);});
    const dut = require('../bot');
    expect(m.post).toBeCalledTimes(1);
    expect(m.post).toBeCalledWith('statuses', expect.anything(), expect.anything());
});
