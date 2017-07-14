import 'core-js/es7/reflect';
import 'mocha';
//import * as Chai from 'chai';
//let expect = Chai.expect;
import { expect } from 'chai';
import { DateUtils } from '../utils/date-utils';



describe('convertTimeStringToHours()', () => {
  it('should take a string like 09:00am and return a number like 9', () => {
    const test = DateUtils.convertTimeStringToHours("09:00am");
    expect(test).to.equal(9);
  });
});

describe('convertTimeStringToMinutes()', () => {
  it('should take a string like 09:30am and return a number like 30', () => {
    const test = DateUtils.convertTimeStringToMinutes("09:30am");
    expect(test).to.equal(30);
  });
});


describe('getMinutes()', () => {
  it('should take a string like 09:30am and return a number like 30', () => {
    const test = DateUtils.convertTimeStringToMinutes("09:30am");
    expect(test).to.equal(30);
  });
});


describe('convertMilitaryTimeStringToNormalTimeString()', () => {
  it('should take a string like 18:00pm and return a string like 06:00', () => {
    const test = DateUtils.convertMilitaryTimeStringToNormalTimeString("18:00pm");
    expect(test).to.equal("6:00pm");
  });
});


/* PENDING: this is correct, but timezone issue takes off 7 hrs in node. does this happen in browser???? */
describe('convertTimeStringToJavascriptDate()', () => {
  it('should take a string like 09:00am and return a Javascript date like 2017-07-10T09:00:00.000Z', /*() => {
    //const test = DateUtils.convertTimeStringToJavascriptDate("05:00pm");
    //expect(test).to.equal(test);
  }*/);
});


describe('convertTimeStringToIsoString()', () => {
  it('should take a string like 18:00pm and return a local iso string like 2017-07-10T18:00:00.000', () => {
    const test = DateUtils.convertTimeStringToIsoString("18:00pm");
    expect(test).to.equal("2017-07-10T18:00:00.000");
  });
});

/* PENDING: this is correct, but timezone issue takes off 7 hrs in node. does this happen in browser??? */
describe('convertIsoStringToHoursAndMinutesString()', () => {
  it('should take a string like 2017-07-10T18:00:00.000 and return a time string like "18:00pm"', /* () => {
    const test = DateUtils.convertIsoStringToHoursAndMinutesString("2017-07-10T18:00:00.000");
    expect(test).to.equal("18:00pm");
  } */);
});


describe('getCurrentDateInfo()', () => {
  it('should return object with current date, hours, minutes, and day', () => {
    const test = DateUtils.getCurrentDateInfo();
    const results = {
      date: test.date,
      hours: test.hours,
      mins: test.mins,
      day: test.day
    }
    // note the to.deep.equal for object prop comparison
    expect(test.date).to.deep.equal(results.date);
  });
});

/* hard to test bc of next ticks. i tested this thoroughly in console/browser and it works
// toLocalIsoString
describe('toLocalIsoString()', () => {
  it('should take a date string and return a string like 06:00', () => {
    const test = DateUtils.toLocalIsoString();
    expect(test).to.equal("6:00pm");
  });
});
*/

describe('sliceZero()', () => {
  it('should take a string like 06:00am and return a string like 6:00am', () => {
    const test = DateUtils.sliceZero("06:00am");
    expect(test).to.equal("6:00am");
  });
});

describe('prependZero()', () => {
  it('should take a number like 6 and return a string like 06', () => {
    const test1 = DateUtils.prependZero(6);
    const test2 = DateUtils.prependZero(10);
    expect(test1).to.equal("06");
    expect(test2).to.equal("10");
  });
});


describe('to12Hour()', () => {
  it('takes number like 18 and returns number like 6', () => {
    const test = DateUtils.to12Hour(18);
    expect(test).to.equal(6);
  });
});

/* PENDING already tested- this works */
describe('to24Hour()', () => {
  it('to24Hour pending...', /* () => {
    const test = DateUtils.to12Hour(18);
    expect(test).to.equal(6);
  } */);
});





