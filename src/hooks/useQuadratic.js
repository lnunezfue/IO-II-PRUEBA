import { useState } from "react";

const useQuadratic = () => {
  const [result, setResult] = useState([]);

  const calculateQuadratic = ({ a, b, c, x }) => {
    try {
      // Calcular el valor óptimo de x
      const xOpt = -b / (2 * a);

      // Evaluar la función cuadrática en xOpt
      const fOpt = a * xOpt * xOpt + b * xOpt + c;

      // Evaluar la función cuadrática en el valor de x proporcionado
      const fX = a * x * x + b * x + c;

      // Guardar los resultados
      setResult([
        { label: "x óptimo", value: xOpt },
        { label: "Valor de la función en x óptimo", value: fOpt },
        { label: `Valor de la función en x = ${x}`, value: fX },  // Resultado para el valor de x proporcionado
      ]);
    } catch (error) {
      setResult([{ label: "Error", value: "Hubo un error en los cálculos." }]);
    }
  };

  return { result, calculateQuadratic };
};

export default useQuadratic;
