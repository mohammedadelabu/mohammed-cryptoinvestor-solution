# CryptoInvestor
## Problem
Let us assume you are a crypto investor. You have made transactions over a period of time which is logged in a CSV file. Write a command line program that does the following

Given no parameters, return the latest portfolio value per token in USD
Given a token, return the latest portfolio value for that token in USD
Given a date, return the portfolio value per token in USD on that date
Given a date and a token, return the portfolio value of that token in USD on that date
The CSV file has the following columns

timestamp: Integer number of seconds since the Epoch
transaction_type: Either a DEPOSIT or a WITHDRAWAL
token: The token symbol
amount: The amount transacted

## Implementation
Run `npm install` to generate the node modules.
Run `npm install request` to generate the request package.
Run `npm install yargs` to generate the yargs package.
Run `npm install date-and-time` to generate the date and time package.
Then import the `transactions.csv` file as it is too heavy to be pushed to the github repo.

## Solution
Given no parameters, run `node cryptoInvestor` to return the latest portfolio value per token in USD

Given a date and a token, run `node cryptoInvestor --date=4/3/2019 --token=BTC` to return the portfolio value of that token(BTC) in USD on that date.

Given a date and a token, run `node cryptoInvestor --date=4/3/2019 --token=ETH` to return the portfolio value of that token(ETH) in USD on that date.

Given a date and a token, run `node cryptoInvestor --date=4/3/2019 --token=XRP` to return the portfolio value of that token(XRP) in USD on that date.

Given a date, run `node cryptoInvestor --date=4/3/2019` to return the portfolio value per token in USD on that date.

Given a token, run `node cryptoInvestor --token=BTC` to return the latest portfolio value for that token(BTC) in USD.

Given a token, run `node cryptoInvestor --token=ETH` to return the latest portfolio value for that token(ETH) in USD.

Given a token, run `node cryptoInvestor --token=XRP` to return the latest portfolio value for that token(XRP) in USD.
