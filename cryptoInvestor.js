"use strict";
const request = require("request");
const args = require("yargs").argv;
const date = require("date-and-time");

let cryptoCompareValues;
let usdCompareValues;

// function to get the latest portfolio value per token in USD
const getTheLatestValuePerTokenInUSDollars = () => new Promise(function (resolve) {
    let resultArray = [];

    let arrayOfBTC = { token: "BTC", amount: 0, timestamp: 0 };
    let arrayOfETH = { token: "ETH", amount: 0, timestamp: 0 };
    let arrayOfXRP = { token: "XRP", amount: 0, timestamp: 0 };

    let readLiner = require("readline").createInterface({
        input: require("fs").createReadStream("transactions.csv"),
    });

    readLiner.on("line", function (line) {
        let jsonLineReader = {};
        let splitLiner = line.split(",");

        jsonLineReader.timestamp = splitLiner[0];
        jsonLineReader.transaction_type = splitLiner[1];
        jsonLineReader.token = splitLiner[2];
        jsonLineReader.amount = splitLiner[3];

        if (jsonLineReader.token === "ETH") {
            if (jsonLineReader.timestamp > arrayOfETH.timestamp) {
                arrayOfETH.amount = jsonLineReader.amount;
                arrayOfETH.timestamp = jsonLineReader.timestamp;
            }
        } else if (jsonLineReader.token === "BTC") {
            if (jsonLineReader.timestamp > arrayOfBTC.timestamp) {
                arrayOfBTC.amount = jsonLineReader.amount;
                arrayOfBTC.timestamp = jsonLineReader.timestamp;
            }
        } else if (jsonLineReader.token === "XRP") {
            if (jsonLineReader.timestamp > arrayOfXRP.timestamp) {
                arrayOfXRP.amount = jsonLineReader.amount;
                arrayOfXRP.timestamp = jsonLineReader.timestamp;
            }
        }
    });
    readLiner.on("close", function (line) {
        cryptoCompareValues = getUSDValues();

        cryptoCompareValues.then(
            function (result) {
                usdCompareValues = result;
                arrayOfETH.amount = arrayOfETH.amount * usdCompareValues.ETH.USD;
                arrayOfBTC.amount = arrayOfBTC.amount * usdCompareValues.ETH.USD;
                arrayOfXRP.amount = arrayOfXRP.amount * usdCompareValues.ETH.USD;

                resultArray.push(arrayOfETH);
                resultArray.push(arrayOfBTC);
                resultArray.push(arrayOfXRP);
                resolve(resultArray);
            },
            function (err) {
                console.log(err);
            }
        );
    });
});
//function to get the portfolio value per token in USD
const getThePortfolioValuePerToken = () => {
    console.log("cryptoLatest-->getThePortfolioValuePerToken");
    console.log("Date", args.date);
    return new Promise(function (resolve) {
        let resultArray = [];

        let arrayOfBTC = [];
        let arrayOfETH = [];
        let arrayOfXRP = [];

        let readLiner = require("readline").createInterface({
            input: require("fs").createReadStream("transactions.csv"),
        });

        readLiner.on("line", function (line) {
            let jsonLineReader = {};
            let splitLiner = line.split(",");

            jsonLineReader.timestamp = splitLiner[0];
            jsonLineReader.transaction_type = splitLiner[1];
            jsonLineReader.token = splitLiner[2];
            jsonLineReader.amount = splitLiner[3];

            //converting date from timestamp
            let d = new Date(jsonLineReader.timestamp * 1000);
            let dateFromCSV = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();

            if (jsonLineReader.token === "ETH") {
                if (args.date === dateFromCSV) {
                    arrayOfETH.push({
                        token: jsonLineReader.token,
                        amount: jsonLineReader.amount * usdCompareValues.ETH.USD,
                    });
                }
            } else if (jsonLineReader.token === "BTC") {
                if (args.date === dateFromCSV) {
                    arrayOfBTC.push({
                        token: jsonLineReader.token,
                        amount: jsonLineReader.amount * usdCompareValues.ETH.USD,
                    });
                }
            } else if (jsonLineReader.token === "XRP") {
                if (args.date === dateFromCSV) {
                    arrayOfXRP.push({
                        token: jsonLineReader.token,
                        amount: jsonLineReader.amount * usdCompareValues.ETH.USD,
                    });
                }
            }
        });
        readLiner.on("close", function (line) {
            resultArray.push(arrayOfETH);
            resultArray.push(arrayOfBTC);
            resultArray.push(arrayOfXRP);
            resolve(resultArray);
        });
    });
};

// function to fetch the USD Values from CryptoCompare
function getUSDValues() {
  let cryptoURL =
    "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR&api_key=3789ea397be622354552b3ab2a826e4379b5da952de997d3cff964ed4f0786ee";

  let options = {
    url: cryptoURL,
    headers: {
      "User-Agent": "request",
    },
  };
  // Return new promise
  return new Promise(function (resolve, reject) {
    // Do async implementation
    request.get(options, function (err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(body));
      }
    });
  });
}

const propertyFiltering = (array, prop, value) => {
  let propertyFiltered = [];
  for (let i = 0; i < array.length; i++) {
    let obj = array[i];

    for (let key in obj) {
      if (typeof (obj[key] == "object")) {
        let item = obj[key];
        if (item[prop] == value) {
          propertyFiltered.push(item);
        }
      }
    }
  }

  return propertyFiltered;
}

// based on the type of the parameters we pass as cmd, corresponding function will be called
if (args.token === undefined && args.date === undefined) {
  console.log(
    "Given no parameters, return the latest portfolio value per token in USD"
  );
  getTheLatestValuePerTokenInUSDollars().then(function (result) {
    console.log(result);
  });
} else if (args.token != undefined && args.date === undefined) {
  console.log(
    "Given a token, return the latest portfolio value for that token in USD"
  );
  getTheLatestValuePerTokenInUSDollars().then(function (result) {
    let resultPerToken = result.filter(function (record) {
      return record.token === args.token;
    });
    console.log(resultPerToken);
  });
} else if (args.date != undefined && args.token === undefined) {
  console.log(
    "Given a date, return the portfolio value per token in USD on that date"
  );
  cryptoCompareValues = getUSDValues();
  cryptoCompareValues.then(
    function (result) {
      usdCompareValues = result;
      getThePortfolioValuePerToken().then(function (result) {
        console.log(result);
      });
    },
    function (err) {
      console.log(err);
    }
  );
} else if (args.token != undefined && args.date != undefined) {
  console.log(
    "Given a date and a token, return the portfolio value of that token in USD on that date"
  );
  cryptoCompareValues = getUSDValues();
  cryptoCompareValues.then(
    function (usdVal) {
      usdCompareValues = usdVal;
      getThePortfolioValuePerToken().then(function (result) {
        let resultPerToken = propertyFiltering(result, "token", args.token);
        console.log(resultPerToken);
      });
    },
    function (err) {
      console.log(err);
    }
  );
}

//Given no parameters, return the latest portfolio value per token in USD
//node cryptoInvestor.js

//Given a date and a token, return the portfolio value of that token in USD on that date
//node cryptoInvestor.js --date=4/3/2019 --token=BTC

//Given a date and a token, return the portfolio value of that token in USD on that date
//node cryptoInvestor.js --date=4/3/2019 --token=ETH

//Given a date and a token, return the portfolio value of that token in USD on that date
//node cryptoInvestor.js --date=4/3/2019 --token=XRP

//Given a date, return the portfolio value per token in USD on that date
//node cryptoInvestor.js --date=4/3/2019

//Given a token, return the latest portfolio value for that token in USD
//node cryptoInvestor.js --token=BTC

//Given a token, return the latest portfolio value for that token in USD
//node cryptoInvestor.js --token=ETH

//Given a token, return the latest portfolio value for that token in USD
//node cryptoInvestor.js --token=XRP

