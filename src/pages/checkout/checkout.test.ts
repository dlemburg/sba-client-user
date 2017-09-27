import 'core-js/es7/reflect';  // allows ts? I think
import 'mocha';
//import * as Chai from 'chai';
//let expect = Chai.expect;
import { expect } from 'chai';
import { CheckoutPage } from './checkout';
import { DateUtils } from '../../utils/date-utils';


describe('getMinutesUntilClose()', () => {
  it(' calculate difference between now and closing time arg ', () => {
    function getMinutesUntilClose(closeTime: Date): number {
        let nowMinutes = DateUtils.millisecondsToMinutes(new Date().getTime());
        let closeMinutes = DateUtils.millisecondsToMinutes(closeTime.getTime());

        return closeMinutes - nowMinutes;
    }
    let someDate = new Date();
    someDate = new Date(someDate.setMinutes(someDate.getMinutes() + 10));

    let test = getMinutesUntilClose(someDate);
    expect(test).to.be.below(11);
    expect(test).to.be.above(9);
  });
});


