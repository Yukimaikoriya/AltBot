'use strict';
// import { beforeEach, jest, test, expect } from "@jest/globals";

jest.mock('child_process', () => {
    return {
        exec: jest.fn((cmd, callback) => {
            callback(undefined, undefined, undefined);
        })
    }
});

beforeEach(() => {
    jest.resetModules();
});

test('Run ML Model success', () => {
    const cp = require('child_process');
    const dut = require('../Run_ML_Model');
    expect(cp.exec).toHaveBeenCalledTimes(1);
    expect(cp.exec).toHaveBeenCalledWith(expect.stringMatching(/^python /), expect.anything());
});

test('Run ML Model failure', () => {
    const cp = require('child_process');
    cp.exec.mockImplementation((cmd, callback) => {
        callback(true, undefined, undefined);
    });
    const dut = require('../Run_ML_Model');
    expect(cp.exec).toHaveBeenCalledTimes(1);
    expect(cp.exec).toHaveBeenCalledWith(expect.stringMatching(/^python /), expect.anything());
})
