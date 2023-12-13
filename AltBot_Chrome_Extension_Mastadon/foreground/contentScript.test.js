'use strict';

// import { jest, test, expect, describe, it } from "@jest/globals";


// capture functions from dut
let listener, handler;
// capture chrome storage hit&miss
let hit = jest.fn(), miss = jest.fn();

// mock chrome runtime
global.chrome = {
    runtime: {
        onMessage: {
            addListener: fn => {listener = fn;}
        }
    },
    storage: {
        local: {
            // put test-img1 & 3 in mock storage
            get: (ids, callback) => {
                if(ids.includes('test-img1') || ids.includes('test-img3')) {
                    console.log('test1'); // del
                    hit();
                    callback({['test-img1']: `"saved-alt-tag1"`, ['test-img3']: `"saved-alt-tag3"`});
                }else {
                    miss();
                    callback({});
                }
            },
            // mock set does nothing
            set: (_, callback) => callback()
        }
    }
};

// mock MutationObserver
class MutationObserver {
    static observe = jest.fn();
    constructor(h) {
        handler = h;
        this.observe = MutationObserver.observe;
    }
}
global.MutationObserver = MutationObserver;

// test html body
const test_html = `
<div>
<a class="media-gallery__item-thumbnail" href="test-img1"><img id="test-img1" src="test-img-src-1"></a>
<a class="media-gallery__item-thumbnail" href="test-img2"><img id="test-img2" src="test-img-src-2"></a>
<a class="media-gallery__item-thumbnail" href="test-img3"><img id="test-img3" src="test-img-src-3" alt="test3-alt-exists"></a>
<div class='media-gallery__item__badges' id="test-btn-container"></div>
</div>
`;


describe('Content Script', () => {
    beforeAll(() => {
        require('./contentScript');
    });
    beforeEach(() => {
        // init test html
        document.body.innerHTML = test_html;
        // mock fetch
        const mfetch = jest.fn(async (_, obj) => {
            const url = JSON.parse(obj.body).input;
            const index = url.indexOf('test-img');
            const response = {ok: 1, json: async () => ({
                text: `generated-alt-${url.substring(index+8)}`
            })};
            if(!index) {
                response.ok = false;
                response.status = 400;
            }
            return response;
        });
        global.fetch = mfetch;
    });
    it('startDomServer', () => {
        listener({type: "NEW"});
        expect(MutationObserver.observe).toBeCalledWith(document.body, expect.anything());
    });
    it('handleMutations', async () => {
        // call DUT
        handler([{type: "childList"}]);
        await jest.runAllTimersAsync();
        // put 1 + 3 in chromeStorage
        // chromestorage expect 2 hit 1 miss
        expect(hit).toBeCalledTimes(2);
        expect(miss).toBeCalledTimes(1);
        // expect fetch called once
        expect(global.fetch).toBeCalledTimes(1);
        // expect image alt tags
        expect(document.querySelector('#test-img1').getAttribute('alt')).toBe('saved-alt-tag1');
        expect(document.querySelector('#test-img2').getAttribute('alt')).toBe('generated-alt-2');
        expect(document.querySelector('#test-img3').getAttribute('alt')).toBe('test3-alt-exists');
        // expect a button
        expect(document.querySelector('#test-btn-container').children.length).toBe(1);
    });
    it('uses local storage', async () => {
        // call DUT
        handler([{type: "childList"}]);
        await jest.runAllTimersAsync();
        // chromestorage expect 0 calls
        expect(hit).toBeCalledTimes(0);
        expect(miss).toBeCalledTimes(0);
        // fetch expect 0 calls
        expect(global.fetch).toBeCalledTimes(0);
        // expect image alt tags
        expect(document.querySelector('#test-img1').getAttribute('alt')).toBe('saved-alt-tag1');
        expect(document.querySelector('#test-img2').getAttribute('alt')).toBe('generated-alt-2');
        expect(document.querySelector('#test-img3').getAttribute('alt')).toBe('test3-alt-exists');
        // expect a button
        expect(document.querySelector('#test-btn-container').children.length).toBe(1);
    });
});
