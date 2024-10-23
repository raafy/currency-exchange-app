const API_URL = "https://api.frankfurter.app";

export async function getCurrencies(): Promise<string[]> {
  const response = await fetch(`${API_URL}/currencies`, { method: "GET" });
  const data = await response.json();
  return Object.keys(data);
}

export async function getExchangeRate(
  baseCurrency: string,
  targetCurrency: string
) {
  const response = await fetch(
    `${API_URL}/latest?base=${baseCurrency}&symbols=${targetCurrency}`,
    { method: "GET" }
  );
  const data = await response.json();
  return data.rates[targetCurrency];
}
