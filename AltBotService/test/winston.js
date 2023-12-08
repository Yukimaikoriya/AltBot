'use strict';

/* global jest */

class Console {

}

class File {

}

const info = jest.fn();
const error = jest.fn();

module.exports = {
    _info: info,
    _error: error,
    createLogger: jest.fn(() => ({
        info: info,
        error: error
    })),
    format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        json: jest.fn()
    },
    transports: {
        Console,
        File
    }
}
