import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Props {
  base: string;
  target: string;
}

interface ExchangeRateData {
  date: Date;
  rate: number;
}

interface FrankfurterApiResponse {
  rates: Record<string, Record<string, number>>;
  base: string;
  target: string;
}

export default function CurrencyChart({ base, target }: Props) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth > 786 ? 600 : window.innerWidth - 150;
      const height = window.innerWidth > 786 ? 300 : 200;
      setDimensions({ width, height });
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.setMonth(today.getMonth() - 1))
      .toISOString()
      .split("T")[0];
    const todayISO = new Date().toISOString().split("T")[0];

    const API_URL = `https://api.frankfurter.app/${lastMonth}..${todayISO}?base=${base}&symbols=${target}`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((data: FrankfurterApiResponse) => {
        const rates = Object.entries(data.rates).map(([date, rate]) => ({
          date: new Date(date),
          rate: rate[target] as number,
        }));

        drawChart(rates);
      });

    const drawChart = (data: ExchangeRateData[]) => {
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
      const width = dimensions.width - margin.left - margin.right;
      const height = dimensions.height - margin.top - margin.bottom;

      d3.select(chartRef.current).selectAll("*").remove();

      const svg = d3
        .select(chartRef.current)
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date) as [Date, Date])
        .range([0, width]);

      const y = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.rate) as number,
          d3.max(data, (d) => d.rate) as number,
        ])
        .nice()
        .range([height, 0]);

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5));

      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line<{ date: Date; rate: number }>()
            .x((d) => x(d.date))
            .y((d) => y(d.rate))
        );

      svg
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.rate))
        .attr("r", 2)
        .attr("fill", "black");
    };
  }, [base, target, dimensions]);

  return (
    <div className="bg-white p-4 rounded-md">
      <h2 className="font-bold text-sm">
        Monthly Exchange Rate: {base} to {target}
      </h2>
      <svg ref={chartRef}></svg>
    </div>
  );
}
