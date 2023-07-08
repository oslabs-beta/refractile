import React, { useState, useEffect } from "react";
import { FibJSProps } from "../../types";


const FibJS = (props: FibJSProps) => {

  const [fibFetched, setFibFetched] = useState(false)
  const [fibResult, setFibResult] = useState(null)
  const [fibTime, setFibTIme] = useState(null)



  return (
    <div>
      <h3>Click the button to calculate a big fibonacci sequence in JavaScript</h3>
      <button></button>
      {fibFetched &&
        <p>{`${fibResult}`}</p>

      }
    </div>
  )
}

export default FibJS