import 'core-js/es7/reflect';
import 'mocha';
//import * as Chai from 'chai';
//let expect = Chai.expect;
import { expect } from 'chai';
import { Utils } from '../utils/utils';


describe('percentToString()', () => {
  it('should take a decimal percent and convert it to a human readable string w/ percent symbol appended to end', () => {
    const test = Utils.percentToString(0.085, 2);
    expect(test).to.equal("8.50%");
  });
});


describe('round()', () => {
  it('should round number to 2 places', () => {
    
    let test = Utils.round(2.86343);
    expect(test).to.equal(2.86);

    test = Utils.round(2.82222);
    expect(test).to.equal(2.82);
  });
});
