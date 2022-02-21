const bank = [
  { 
    id: 123456789,
    name: "Voyskaya Vlada Vladimirovna",
    isActive: true,
    registrationDate: "",
    accounts: {
      debit: [
        {
        balance: 5,
        activity: 2,
        activityDate: "",
        cardExpiryDate: "",
        currency: "UAH",
      },
      {
        balance: 3,
        activity: 1,
        activityDate: "",
        cardExpiryDate: "",
        currency: "UAH",
      }
    ],
      credit: [
        {
          balance: {
          personalFunds: 6,
          creditFunds: 5,
        },
        creditLimit: 10,
        activity: 3,
        activityDate: "",
        cardExpiryDate: "",
        currency: "UAH", 
      },
    ],
    },
  },
  {
    id: 123456790,
    name: "Voyskiy Vlad Vladimirovich",
    isActive: false,
    registrationDate: "",
    accounts: {
      debit: [
        {
        balance: 7,
        activity: 3,
        activityDate: "",
        cardExpiryDate: "",
        currency: "UAH",
      },
    ],
      credit: [
        {
        balance: {
          personalFunds: 2,
          creditFunds: 3,
        },
        creditLimit: 10,
        activity: 2,
        activityDate: "",
        cardExpiryDate: "",
        currency: "UAH",
      },
      {
        balance: {
          personalFunds: 2,
          creditFunds: 3,
        },
        creditLimit: 10,
        activity: 2,
        activityDate: "",
        cardExpiryDate: "",
        currency: "UAH",
      }
    ]
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
      if(rate.data.length === 0){
        return error
      } else {
      //   console.log(rate.data);
      return rate.data;
    }
    });
}
// console.log(fetchCurrencyRates());
async function exchangeCurrency(balance, currency) {
  //   console.log(currency, balance);
  const rate = await fetchCurrencyRates().then((rates) => {
    // console.log(rates.UAH);
    return rates[currency];
  });

  return (balance / 100) * rate;
  //    console.log(rate)
}
// exchangeCurrency(50, 'UAH')

async function countBankCashTotal() {
  try {
    let debitTotal = 0;
    for (let i = 0; i < bank.length; i++) {
       for(let j = 0; j < bank[i].accounts.debit.length; j++){   
        let account = bank[i].accounts.debit[j];

         const funds = account.balance + account.activity;
         let currency = account.currency;
        //  console.log(currency)
         if(currency === "USD"){
          debitTotal += funds;
         } else {
         const exchangedFunds = await exchangeCurrency(funds, currency);
        //  console.log(exchangedFunds)
         debitTotal += exchangedFunds;
        }
        // console.log(currency, balance)
       }  
    }
   console.log(debitTotal);
    let creditTotal = 0;
    for (let i = 0; i < bank.length; i++) {
      for(let j = 0; j < bank[i].accounts.credit.length; j++){   
       let account = bank[i].accounts.credit[j];
      //  console.log(account.balance)
        const funds = account.balance.personalFunds + account.balance.creditFunds + account.creditLimit + account.activity;
        let currency = account.currency;
        // console.log(funds)
        if(currency === "USD"){
         creditTotal += funds;
        } else {
        const exchangedFunds = await exchangeCurrency(funds, currency);
        // console.log(exchangedFunds)
        creditTotal += exchangedFunds;
       }
       // console.log(currency, balance)
      }
       
   }
   console.log(creditTotal);
   console.log(debitTotal + creditTotal);
   return (debitTotal + creditTotal)
  } catch (e) {
    error({ text: "Error.Try again leter." });
  }
}
countBankCashTotal();

async function countClientsDebt() {
  try {
    let debtTotal = 0;
    for (let i = 0; i < bank.length; i++) {
      for(let j = 0; j < bank[i].accounts.credit.length; j++){   
       let account = bank[i].accounts.credit[j];
      //  console.log(account.balance)
          let debt = 0;
        // console.log(account)
        if(account.balance.creditFunds > account.balance.personalFunds){
            debt = account.balance.creditFunds - account.balance.personalFunds;
        }
        // const funds = account.balance.personalFunds + account.balance.creditFunds + account.creditLimit + account.activity;
        let currency = account.currency;
        console.log(debt)
        if(currency === "USD"){
          debtTotal += debt;
        } else {
        const exchangedDebt = await exchangeCurrency(debt, currency);
        console.log(exchangedDebt)
        debtTotal += exchangedDebt;
       }
       // console.log(currency, balance)
      }
   }
   console.log(debtTotal);
   return debtTotal;
  } catch (e) {
    error({ text: "Error.Try again leter." });
  }
}
countClientsDebt();

async function countInactiveClientsDebtFunds() {
  try {
    const total = 0;
    for (let i = 0; i < bank.length; i++) {
      for(let j = 0; j < bank[i].accounts.credit.length; j++){   
       let account = bank[i].accounts.credit[j];
       let debt = 0;
      //  console.log(account.balance)
       if(account.balance.creditFunds > account.balance.personalFunds){
        debt += account.balance.creditFunds - account.balance.personalFunds;
                  let currency = account.currency;
              console.log(debt)
              if(currency === "USD"){
                total += debt;
              } else {
                const exchangedDebt = await exchangeCurrency(debt, currency);
                console.log(exchangedDebt)
                // total += exchangedDebt
              }
       }
      }
    }
  //   for (let i = 0; i < bank.length; i++) {
  //     if(bank[i].isActive){
  //       console.log('active')
  //     //  break;
  //     }
  //     for(let j = 0; j < bank[i].accounts.credit.length; j++){   
  //      let account = bank[i].accounts.credit[j];
  //       let debt = 0;
  //       if(account.balance.creditFunds > account.balance.personalFunds){
  //           debt += account.balance.creditFunds - account.balance.personalFunds;
  //           let currency = account.currency;
  //       console.log(debt)
  //       if(currency === "USD"){
  //         total += debt;
  //       } else {
  //       const exchangedDebt = await exchangeCurrency(debt, currency);
  //       console.log(exchangedDebt)
  //       total += exchangedDebt;
 
  //       }
  //     }
  //  }
  // }
    // const creditFundsTotal = bank
    //   .reduce(async (total, client) => {
    //     let creditFunds = client.accounts.credit.balance.creditFunds;
    //     const currency = client.accounts.credit.currency;
    //     const exchangedCreditFunds = await exchangeCurrency(
    //       creditFunds,
    //       currency
    //     );
    //     total += exchangedCreditFunds;
    //     return total;
    //   }, 0)
    //   .then((total) => console.log(total));
  
    console.log(total);
    return total;
  } catch (e) {
    error({ text: "Error.Try again leter." });
  }
}
countInactiveClientsDebtFunds()

function countInactiveDebtHolders() {
  // const inactiveClients = bank.filter((client) => {
  //   return client.isActive && client.accounts.credit.balance.creditFunds !== 0;
  // }).length;
  let counter = 0;
  for (let i = 0; i < bank.length; i++) {
    let debt = false;
    for(let j = 0; j < bank[i].accounts.credit.length; j++){   
     let account = bank[i].accounts.credit[j];
      if(account.balance.creditFunds > account.balance.personalFunds){
          debt = true;
          break;
      }
    }
    if(debt && !bank[i].isActive){
      counter+=1;
      debt = false;
    }
 }
  console.log(counter);
  return counter;
}
// countInactiveDebtHolders();

function countActiveDebtHolders(){
  let counter = 0;
  for (let i = 0; i < bank.length; i++) {
    let debt = false;
    for(let j = 0; j < bank[i].accounts.credit.length; j++){   
     let account = bank[i].accounts.credit[j];
      if(account.balance.creditFunds > account.balance.personalFunds){
          debt = true;
          break;
      }
    }
    if(debt && bank[i].isActive){
      counter+=1;
      debt = false;
    }
 }
  console.log(counter);
  return counter;
}
// countActiveDebtHolders()