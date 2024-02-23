const units = [
  "L",
  "l",
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
];
function ConvertHandler() {
  this.getNum = function (input) {
    let validFraction = /^([1-9]\d*(\.\d+)?)[/](\d+(\.\d+)?)$/; //fraction
    let validDecimal = /^\d+(\.\d+)?$/; //decimal
    let result;

    if (input.search("[a-zA-Z]") != -1) {
      num = input.slice(0, input.search("[a-zA-Z]")).trim();
    } else {
      num = input.slice(0).trim();
    }

    if (validDecimal.test(num)) {
      result = Number(num);
    } else if (validFraction.test(num)) {
      const nominator = num.slice(0, num.indexOf("/"));
      const denominator = num.slice(num.indexOf("/") + 1);
      result = Number(nominator / denominator);
    } else if (num === "") {
      result = 1;
    } else {
      result = "invalid number";
    }

    return result;
  };

  this.getUnit = function (input) {
    let result;
    if (input.search("[a-zA-Z]") != -1) {
      str = input.slice(input.search("[a-zA-Z]"));
      str.toLowerCase();
    }

    for (let i = 0; i < units.length; i++) {
      if (units.includes(str)) {
        if (str === "L" || str === "l") {
          result = str.toUpperCase();
        } else {
          result = str.toLowerCase();
        }
      } else {
        result = "invalid unit";
      }
    }

    return result;
  };

  this.getReturnUnit = function (initUnit) {
    let result;
    let unit = this.getUnit(initUnit);
    let units = {
      gal: "L",
      L: "gal",
      mi: "km",
      km: "mi",
      lbs: "kg",
      kg: "lbs",
    };

    result = units[unit];
    if (!result) {
      result = "invalid unit";
    }
    return result;
  };

  this.spellOutUnit = function (unit) {
    let result;
    let unitR = this.getUnit(unit);
    let unitsName = {
      gal: "gallons",
      L: "liters",
      mi: "miles",
      km: "kilometers",
      lbs: "pounds",
      kg: "kilograms",
    };

    result = unitsName[unitR];
    if (!result) {
      result = "invalid unit";
    }
    return result;
  };

  this.convert = function (initNum, initUnit) {
    const conversions = {
      gal: { value: 3.78541, operation: "*" },
      L: { value: 3.78541, operation: "/" },
      lbs: { value: 0.453592, operation: "*" },
      kg: { value: 0.453592, operation: "/" },
      mi: { value: 1.60934, operation: "*" },
      km: { value: 1.60934, operation: "/" },
    };

    let unit = this.getUnit(initUnit);
    let num = initNum;
    let result;

    if (num !== "invalid number" && unit !== "invalid unit") {
      let conversion = conversions[unit];
      result =
        conversion.operation === "*"
          ? num * conversion.value
          : num / conversion.value;
    }

    return result ? result : "Conversion error";
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    numRound = parseFloat(returnNum.toFixed(5));
    string = `${initNum} ${this.spellOutUnit(
      initUnit
    )} converts to ${numRound} ${this.spellOutUnit(returnUnit)}`;
    return {
      initNum: initNum,
      initUnit: initUnit,
      returnNum: numRound,
      returnUnit: returnUnit,
      string: string,
    };
  };
}

module.exports = ConvertHandler;