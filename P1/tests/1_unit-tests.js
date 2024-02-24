const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  suite("Function getNum(input)", function () {
    test("Whole number input", function () {
      assert.equal(convertHandler.getNum("12 L"), 12);
    });

    test("Decimal Input", function () {
      assert.approximately(convertHandler.getNum("12.2L"), 12.2, 0.1);
    });

    test("Fractional Input", function () {
      assert.equal(convertHandler.getNum("12/2L"), 6);
    });

    test("Fractional Input with Decimal", function () {
      assert.approximately(convertHandler.getNum("12.2/2L"), 6.1, 0.1);
    });

    test("Invalid Input (double fraction)", function () {
      assert.equal(convertHandler.getNum("12/2/1L"), "invalid number");
    });

    test("No Numerical Input", function () {
      assert.equal(convertHandler.getNum(""), 1);
    });
  });

  suite("Function getUnit(input)", function () {
    test("For each valid input unit", () => {
      let units = [
        "gal",
        "GAL",
        "mi",
        "MI",
        "km",
        "KM",
        "lbs",
        "LBS",
        "kg",
        "KG",
        "L",
        "l",
      ];
      units.forEach((elem) => {
        assert.equal(
          convertHandler.getUnit(elem),
          elem === "L" ? elem : elem === "l" ? "L" : elem.toLowerCase()
        );
      });
    });

    test("Invalid input unit", function () {
      assert.strictEqual(convertHandler.getUnit("invalid"), "invalid unit");
    });
  });

  suite("Function getReturnUnit(input)", function () {
    test("Return unit for each valid input unit", () => {
      let inputUnits = ["L", "mi", "lbs", "gal", "km", "kg"];
      let checkUnits = ["gal", "km", "kg", "L", "mi", "lbs"];

      inputUnits.forEach((elem, i) => {
        assert.strictEqual(convertHandler.getReturnUnit(elem), checkUnits[i]);
      });
    });
  });

  suite("Function spellOutUnit(input)", function () {
    test("Return the spelled-out string unit for each valid input unit", function () {
      let inputUnits = ["L", "mi", "lbs", "gal", "km", "kg"];
      let checkUnits = [
        "liters",
        "miles",
        "pounds",
        "gallons",
        "kilometers",
        "kilograms",
      ];

      inputUnits.forEach((elem, i) => {
        assert.strictEqual(convertHandler.spellOutUnit(elem), checkUnits[i]);
      });
    });
  });

  suite("Function convert(initNum, initUnit)", function () {
    test("Convert 1 gal to 3.78541 L", () => {
      assert.approximately(convertHandler.convert(1, "gal"), 3.78541, 0.01);
    });

    test("Convert 3.78541 L to 1 gal", () => {
      assert.approximately(convertHandler.convert(3.78541, "L"), 1, 0.01);
    });

    test("Convert 1 lbs to 0.453592 kg", () => {
      assert.approximately(convertHandler.convert(1, "lbs"), 0.453592, 0.01);
    });

    test("Convert 0.453592 kg to 1 lbs", () => {
      assert.approximately(convertHandler.convert(0.453592, "kg"), 1, 0.01);
    });

    test("Convert 1 mi to 1.60934 km", () => {
      assert.approximately(convertHandler.convert(1, "mi"), 1.60934, 0.1);
    });

    test("Convert 1.60934 km to 1 mi", () => {
      assert.approximately(convertHandler.convert(1.60934, "km"), 1, 0.1);
    });

    test("Convert gal to L", () => {
      assert.approximately(convertHandler.convert(5, "gal"), 18.92705, 0.1);
    });

    test("Convert L to gal", () => {
      assert.approximately(convertHandler.convert(5, "L"), 1.32086, 0.1);
    });

    test("Convert mi to km", () => {
      assert.approximately(convertHandler.convert(5, "mi"), 8.0467, 0.1);
    });

    test("Convert km to mi", () => {
      assert.approximately(convertHandler.convert(5, "km"), 3.10686, 0.1);
    });

    test("Convert lbs to kg", () => {
      assert.approximately(convertHandler.convert(5, "lbs"), 2.26796, 0.1);
    });

    test("Convert kg to lbs", () => {
      assert.approximately(convertHandler.convert(5, "kg"), 11.02312, 0.1);
    });
  });
});