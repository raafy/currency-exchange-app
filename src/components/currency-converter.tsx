"use client";

import { getCurrencies, getExchangeRate } from "@/services/api";
import { ArrowUpDownIcon } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

import CurrencyChart from "./currency-chart";

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("MYR");
  const [exchangeRate, setExchangeRate] = useState<number>(0.0);
  const [baseValue, setBaseValue] = useState<string>("1");

  const targetValue = useMemo(
    () => (exchangeRate * Number(baseValue)).toFixed(2),
    [exchangeRate, baseValue]
  );

  useEffect(() => {
    getCurrencies().then(setCurrencies);
  }, []);

  useEffect(() => {
    if (baseCurrency && targetCurrency) {
      getExchangeRate(baseCurrency, targetCurrency).then(setExchangeRate);
    }
  }, [baseCurrency, targetCurrency]);

  const handleSwap = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  const handleBaseValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setBaseValue(value);
  };

  const handleBaseCurrency = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedBase = e.target.value;
    if (selectedBase === targetCurrency) {
      setTargetCurrency(baseCurrency);
    }
    setBaseCurrency(selectedBase);
  };

  const handleTargetCurrency = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTarget = e.target.value;
    if (selectedTarget === baseCurrency) {
      setBaseCurrency(targetCurrency);
    }
    setTargetCurrency(selectedTarget);
  };

  return (
    <div className="flex flex-col bg-black bg-opacity-50 justify-center items-center backdrop-blur p-4 rounded-md">
      <div className="flex flex-col items-center gap-y-4">
        <div className="flex">
          <select
            className="py-2 px-4 rounded-l"
            value={baseCurrency}
            onChange={handleBaseCurrency}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            className="py-2 px-4 rounded-r"
            value={baseValue}
            onChange={handleBaseValue}
            type="text"
            inputMode="decimal"
          />
        </div>
        <button onClick={handleSwap}>
          <ArrowUpDownIcon color="white" />
        </button>
        <div className="flex">
          <select
            className="py-2 px-4 rounded-l"
            value={targetCurrency}
            onChange={handleTargetCurrency}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            className="py-2 px-4 rounded-r disabled:bg-white"
            value={targetValue}
            readOnly
            disabled
          />
        </div>
      </div>
      <div className="mt-6">
        <CurrencyChart base={baseCurrency} target={targetCurrency} />
      </div>
    </div>
  );
}
