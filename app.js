const API_KEY = "your_api_key_here"; // Replace with your environment variable or secure method
const BASE_URL = "https://api.freecurrencyapi.com/v1/latest";

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown select");
  const btn = document.querySelector("form button");
  const fromCurr = document.querySelector(".from select");
  const toCurr = document.querySelector(".to select");
  const msg = document.querySelector(".msg");

  // Populate the dropdowns with currency codes
  for (let select of dropdowns) {
    for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
        newOption.selected = "selected";
      } else if (select.name === "to" && currCode === "INR") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
    });
  }

  // Update exchange rates
  const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value || 1;

    if (amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }

    const URL = `${BASE_URL}?base=${fromCurr.value}&symbols=${toCurr.value}&apikey=${API_KEY}`;

    try {
      msg.innerText = "Fetching exchange rate...";
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }
      const data = await response.json();
      const rate = data.data[toCurr.value];
      const finalAmount = amtVal * rate;
      msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
    } catch (error) {
      msg.innerText = "Error fetching exchange rate. Please try again later.";
      console.error(error);
    }
  };

  // Update flag
  const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");
    img.src = newSrc;
  };

  // Button click listener
  btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
  });

  // Initial load
  updateExchangeRate();
});
