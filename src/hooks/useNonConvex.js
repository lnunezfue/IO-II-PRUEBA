import { useState } from "react";

// Hook para Programación No Convexa
const useNonConvex = () => {
  const [result, setResult] = useState([]);

  const calculateNonConvex = (values) => {
    const { objectiveFunction, constraints } = values;
    const calculatedResult = objectiveFunction - constraints.reduce((acc, curr) => acc + curr, 0);

    setResult([{ label: "Resultado de Programación No Convexa", value: calculatedResult }]);
  };

  return {
    result,
    calculateNonConvex
  };
};

export default useNonConvex;
