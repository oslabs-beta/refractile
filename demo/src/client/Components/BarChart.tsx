import React from "react";
import { Bar } from "react-chartjs-2";

const BarChart = (props: any) => {
  const { chartData } = props
  return (
    <div className="chart-container">
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Recursive Fib JS vs C"
            },
            legend: {
              display: true
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Input of fib(x)',
                color: 'gray'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Time in milliseconds',
                color: 'gray'
              }
            },
          }
        }}
      />
    </div>
  );
};

export default BarChart