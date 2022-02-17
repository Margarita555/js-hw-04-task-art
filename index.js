const bank = [
  {
    client: {
      name: "Voyskaya Vlada Vladimirovna",
      active: false,
      registrationDate: "",
      accounts: {
        debit: {
          balance: 500000,
          activity: 5000,
          activityDate: "",
          cardExpiryDate: "",
          currency: "UAH",
        },
        credit: {
          balance: {
            personalFunds: 200000,
            creditFunds: 0,
          },
          creditLimit: 100000,
          activity: 5000,
          activityDate: "",
          cardExpiryDate: "",
          currency: "UAH",
        },
      },
    },
  },
  {
    client: {
      name: "Voyskiy Vlad Vladimirovich",
      active: false,
      registrationDate: "",
      accounts: {
        debit: {
          balance: 500000,
          activity: 5000,
          activityDate: "",
          cardExpiryDate: "",
          currency: "UAH",
        },
        credit: {
          balance: {
            personalFunds: 200000,
            creditFunds: 0,
          },
          creditLimit: 100000,
          activity: 5000,
          activityDate: "",
          cardExpiryDate: "",
          currency: "UAH",
        },
      },
    },
  },
];
const API_KEY = "7c8bbc90-8fcc-11ec-afa3-bfe597d9e008";

async function fetchCurrencyRates() {
  return await fetch(
    `https://freecurrencyapi.net/api/v2/latest?apikey=${API_KEY}`
  )
    .then((response) => {
      return response.json();
    })
    .then((rate) => {
      //   console.log(rate.data);
      return rate.data;
    });
}
// console.log(fetchCurrencyRates());
async function exchangeCurrency(balance, currency) {
  //   console.log(currency, balance);
  const rate = await fetchCurrencyRates().then((rates) => {
    // console.log(rates);
    return rates[currency];
  });

  return (balance / 100) * rate;
  //    console.log(rate)
}
// exchangeCurrency(500000, 'UHA')

async function bankCashTotal() {
  try {
    let debitTotal = 0;
    for (let i = 0; i < bank.length; i++) {
      // console.log(bank[i].client.accounts)

      const balance = bank[i].client.accounts.debit.balance;
      const currency = bank[i].client.accounts.debit.currency;
      // console.log(currency, balance)
      const clientDebitBalance = await exchangeCurrency(balance, currency);
      debitTotal += clientDebitBalance;
      //   console.log(debitTotal);
    }

    let creditTotal = 0;
    for (let i = 0; i < bank.length; i++) {
      // console.log(bank[i].client.accounts)

      const personalFunds =
        bank[i].client.accounts.credit.balance.personalFunds;
      let creditFunds = bank[i].client.accounts.credit.balance.creditFunds;
      const currency = bank[i].client.accounts.credit.currency;
      //   console.log(currency, personalFunds, creditFunds);
      const balance = personalFunds + creditFunds;
      const clientCreditBalance = await exchangeCurrency(balance, currency);
      creditTotal += clientCreditBalance;
      //   console.log(debitTotal);
    }
    const total = debitTotal + creditTotal;
    return total;
    //  + client.accounts.creditAccount.creditLimit + activity
  } catch (e) {
    error({ text: "Error.Try again leter." });
  }
}
bankCashTotal();
