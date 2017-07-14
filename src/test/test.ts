import 'core-js/es7/reflect';
import 'mocha';
//import * as Chai from 'chai';
//let expect = Chai.expect;
import { expect } from 'chai';
import { DateUtils } from '../utils/date-utils';


describe('DateUtils', () => {
  describe('convertTimeStringToHours()', () => {
    it('should take a string like 09:00am and return a number like 9', () => {
      const test = DateUtils.convertTimeStringToHours("09:00am");
      expect(test).to.equal(9);
    });
  });
});


describe('DateUtils', () => {
  describe('convertTimeStringToMinutes()', () => {
    it('should take a string like 09:30am and return a number like 30', () => {
      const test = DateUtils.convertTimeStringToMinutes("09:30am");
      expect(test).to.equal(30);
    });
  });
});


describe('DateUtils', () => {
  describe('getMinutes()', () => {
    it('should take a string like 09:30am and return a number like 30', () => {
      const test = DateUtils.convertTimeStringToMinutes("09:30am");
      expect(test).to.equal(30);
    });
  });
});

