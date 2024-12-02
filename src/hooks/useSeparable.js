import { useState } from 'react';
import * as math from 'mathjs';

const useSeparable = () => {
  const [result, setResult] = useState([]);

  const calculateSeparable = ({ objectiveFunction, constraints }) => {
    try {
      // Definir el scope con valores predeterminados
      const scope = {
        x1: 1,  // Ejemplo de valor para x1
        x2: 2   // Ejemplo de valor para x2
      };
  
      // Evaluar la función objetivo con la librería math.js
      const objective = math.evaluate(objectiveFunction, scope);
  
      // Procesar las restricciones (si las tienes)
      const constraintResults = constraints.map((constraint, index) => {
        return {
          label: `Restricción ${index + 1}`,
          value: constraint
        };
      });
  
      // Mostrar los resultados
      setResult([
        { label: 'Función Objetivo', value: objective },
        ...constraintResults
      ]);
    } catch (error) {
      // Si hay un error, mostrar un mensaje
      console.error("Error al calcular:", error);
      setResult([{ label: "Error", value: "Hubo un error en la expresión matemática." }]);
    }
  };
  
  

  return { result, calculateSeparable };
};

export default useSeparable;
