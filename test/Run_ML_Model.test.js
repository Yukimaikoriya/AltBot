'use strict';
// import { jest, test, expect } from "@jest/globals";

jest.mock('child_process', () => {
    return {
        exec: jest.fn((cmd, callback) => {
            callback(undefined, undefined, undefined);
        })
    }
});

test('Run ML Model', () => {
    const cp = require('child_process');
    const dut = require('../Run_ML_Model');
    expect(cp.exec).toHaveBeenCalledTimes(1);
    expect(cp.exec).toHaveBeenCalledWith(expect.stringMatching(/^python /), expect.anything());
});
