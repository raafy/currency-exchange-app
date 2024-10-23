import CurrencyConverter from "@/components/currency-converter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh justify-center items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Simple Currency Converter</h1>
      <CurrencyConverter />
    </div>
  );
}
