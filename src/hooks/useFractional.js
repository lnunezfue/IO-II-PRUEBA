import { useState } from "react";

// Hook para Programación Fraccional
const useFractional = () => {
  const [result, setResult] = useState([]);

  const calculateFractional = (values) => {
    const { numerator, denominator } = values;
    const calculatedResult = numerator / denominator;

    setResult([{ label: "Resultado de Programación Fraccional", value: calculatedResult }]);
  };

  return {
    result,
    calculateFractional
  };
};

export default useFractional;
