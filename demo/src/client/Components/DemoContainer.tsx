import React from 'react';
import FibJS from './FibJS';
import { useState, useEffect } from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import BarChart from "./BarChart";
import { BenchmarkType } from '../../types';


Chart.register(CategoryScale);

const DemoContainer = (props: any): JSX.Element => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "JavaScript",
      data: [],
      backgroundColor: [
        "red"
      ],
      borderColor: "black",
      borderWidth: 1
    },
    {
      label: "C++",
      data: [],
      backgroundColor: [
        "blue"
      ],
      borderColor: "black",
      borderWidth: 1
    }]
  })
  const [JSData, setJSData] = useState([])
  const [CData, setCData] = useState([])
  const [bothFetched, setBothFetched] = useState(false)

  useEffect(() => {
    const fetchChartData = async (language: string) => {
      const response = await fetch(`/api/fib/benchmark/${language}`)
      const data = await response.json()
      console.log(data)
      const formattedData = []
      let tempData = []

      for (let i = 0; i < data.length; i++) {
        if (tempData.length === 0) {
          tempData.push(data[i])
        } else if (tempData[0].input === data[i].input) {
          tempData.push(data[i])
        } else {
          const mid: number = Math.floor(tempData.length / 2)
          if (tempData[mid]) {
            formattedData.push(tempData[mid])
          }
          tempData = []
        }
        if (i === data.length - 1) {
          const mid: number = Math.floor(tempData.length / 2)
          if (tempData[mid]) {
            formattedData.push(tempData[mid])
          }
        }
      }

      // console.log(formattedData)

      if (language === 'JS') {
        setJSData(formattedData)
      } else if (language === 'C') {
        setCData(formattedData)
      }
    }
    fetchChartData('JS')
    fetchChartData('C')
  }, [])

  useEffect(() => {
    console.log('checking bothFetched')
    if (JSData.length > 0 && CData.length > 0) {
      setBothFetched(true)
    }
  }, [JSData, CData])

  useEffect(() => {
    const newChartData = JSON.parse(JSON.stringify(chartData))
    console.log('Formatted JS Data in state hook', JSData)
    console.log('Formatted C data in state hook', CData)
    if (JSData.length > 0) {
      if (newChartData.labels.length === 0) {
        newChartData.labels = JSData.map((data) => data.input)
      }
      if (newChartData.datasets[0].data.length === 0) {
        newChartData.datasets[0].data = JSData.map((data) => data.time)
      }
    }
    if (CData.length > 0) {
      if (newChartData.labels.length === 0) {
        newChartData.labels = CData.map((data) => data.input)
      }
      if (newChartData.datasets[1].data.length === 0) {
        newChartData.datasets[1].data = CData.map((data) => data.time)
      }
    }
    setChartData(newChartData)
  }, [bothFetched])


  return (
    <div className="container mx-auto py-20 overflow-auto">
      <FibJS></FibJS>
      <BarChart chartData={chartData}></BarChart>
    </div>
  );
};

export default DemoContainer;
