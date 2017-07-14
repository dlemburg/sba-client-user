var assert = require('assert');
var expect = require('expect.js');

describe('example', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});

describe('LocationsPage', function() {
  describe('isLocationOpen()', function() {
    it('should return true when open && correct message if closed', function() {

      function isLocationOpen(openHours, openMinutes, closeHours, closeMinutes) {
        let now = new Date(); 
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let closeMidnight = false;
        let closedMessage = "";


        // this algorithm can be improved and refactored. i just kept adding to it. works well for now.
        if (openHours === 24) openHours = 0;  // midnight open to zero
        if (closeHours === 0) closeMidnight = true;

        if (hours > openHours && hours < closeHours) return { isOpen: true, closedMessage: null };
        else if (hours > openHours && closeMidnight) return { isOpen: true, closedMessage: null };

        else if (hours === openHours) {
          if (minutes > openMinutes) return { isOpen: true, closedMessage: null };
          else return {isOpen: false, closedMessage: `This location opens in minutes`};
        } 
        else if ((openHours - hours) === 1 && openMinutes === 0) return { isOpen: false, closedMessage: `This location opens in ${60 - minutes} minutes`};    
        else if (hours === closeHours) {
          if (minutes < closeMinutes) return {isOpen: true, closedMessage: null };
          else return { isOpen: false, closedMessage: `Sorry, this location just closed for the night.`};
        } 
        else if (hours < openHours) {
          let isSoon = (openHours - hours) < 2 ? true : false;
          closedMessage = isSoon ? `This location opens soon.` : `Closed right now.`;

          return { isOpen: false, closedMessage};
        } 
        else {
          if (hours > closeHours) return { isOpen: false, closedMessage: `Closed for the day`};
          else return { isOpen: false, closedMessage: `Closed right now`};
        }
      }

      /****** TEST conclusion ******/
      
      const test = isLocationOpen(17, 35, 24, 20);
      //assert.equal(true, isOpen(1, 30, 14, 20));
      expect(false).to.equal(test.isOpen);
      expect("This location opens in minutes").to.equal(test.closedMessage);
    });
  });
});


