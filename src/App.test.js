import React from 'react';
import App from './App';

import { render } from 'react-testing-library'

describe("Run App tests", ()=>{
    it("should run App test", () => {
        render(<App />)
    })
    it("should run tests", () => {
        expect(true).toEqual(false)
    })
});