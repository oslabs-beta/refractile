import React, { useState, useEffect } from "react";
import { FibJSProps, FibResult } from "../../types";


const FibJS = (props: FibJSProps): JSX.Element => {

  const [fibFetched, setFibFetched] = useState<boolean>(false)
  const [fibResult, setFibResult] = useState<number>(0)
  const [fibTime, setFibTime] = useState<number>(0)

  const handleClick = async () => {
    const start: number = Date.now()
    const response = await fetch('/api/fib-js', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    console.log(data)

    setFibResult(data.result)
    const timeTaken: number = Date.now() - start
    setFibTime(timeTaken)
    setFibFetched(true)
  }


  return (
    <div>
      <h3>Click the button to calculate a big Fibonacci sequence in JavaScript</h3>
      <button onClick={handleClick}>Run Fibonacci(50)</button>
      {fibFetched &&
        <div>
          <p>{`The result of JS Fibonacci is: ${fibResult}`}</p>
          <p>{`The time it took is: ${fibTime / 1000} seconds`}</p>
        </div>
      }
    </div>
  )
}

export default FibJS