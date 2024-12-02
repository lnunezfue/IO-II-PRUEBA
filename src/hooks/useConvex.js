import { useState } from "react";

// Hook para Programación Convexa
const useConvex = () => {
  const [result, setResult] = useState([]);

  const calculateConvex = (values) => {
    const { objectiveFunction, constraints } = values;
    const calculatedResult = Math.min(objectiveFunction, ...constraints);  // Ejemplo de cálculo convexo

    setResult([{ label: "Resultado de Programación Convexa", value: calculatedResult }]);
  };

  return {
    result,
    calculateConvex
  };
};

export default useConvex;
