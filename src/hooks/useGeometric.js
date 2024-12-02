import { useState } from "react";

// Hook para Programación Geométrica
const useGeometric = () => {
  const [result, setResult] = useState([]);

  const calculateGeometric = (values) => {
    const { a, b } = values;
    const result = Math.pow(a, b);  // Ejemplo de cálculo geométrico

    setResult([{ label: "Resultado de Programación Geométrica", value: result }]);
  };

  return {
    result,
    calculateGeometric
  };
};

export default useGeometric;
