import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs"; // Asegúrate de importar evaluate de mathjs

export const Separable = () => {
  const { handleSubmit, register, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");
  const [constraints, setConstraints] = useState([]);
  const [result, setResult] = useState([]);

  const onSubmit = () => {
    calculateSeparable({ objectiveFunction, constraints });
  };

  const calculateSeparable = ({ objectiveFunction, constraints }) => {
    const scope = {
      x1: 1, // Valor de ejemplo para x1
      x2: 2, // Valor de ejemplo para x2
    };

    try {
      // Evaluar la función objetivo
      const objResult = evaluate(objectiveFunction, scope);

      // Evaluar las restricciones
      const constraintsResults = constraints.map((constraint) => {
        // Evaluar la expresión de la restricción
        const constraintResult = evaluate(constraint.expression, scope);
        let isValid;

        // Evaluar según el operador de la restricción
        switch (constraint.operator) {
          case "<=":
            isValid = constraintResult <= constraint.limit;
            break;
          case ">=":
            isValid = constraintResult >= constraint.limit;
            break;
          case "<":
            isValid = constraintResult < constraint.limit;
            break;
          case ">":
            isValid = constraintResult > constraint.limit;
            break;
          case "=":
            isValid = constraintResult === constraint.limit;
            break;
          default:
            isValid = false;
            break;
        }

        return { 
          expression: constraint.expression, 
          result: constraintResult, 
          isValid: isValid 
        };
      });

      // Definir el resultado final
      setResult([
        { label: "Función Objetivo", value: objResult },
        ...constraintsResults.map((constraint, index) => ({
          label: `Restricción ${index + 1}`,
          value: constraint.result,
          isValid: constraint.isValid ? "Cumple" : "No Cumple",
        })),
      ]);
    } catch (error) {
      console.error("Error al calcular: ", error);
      setResult([{ label: "Error", value: "Hubo un problema con los cálculos." }]);
    }
  };

  const handleReset = () => {
    reset();
    setObjectiveFunction("");
    setConstraints([]);
    setResult([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Programación Separable</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo:</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Restricciones (expresiones con operadores lógicos):</label>
          <input
            type="text"
            placeholder="Ej: 4*x1^2 + 3*x2^2 <= 100, x1 + x2 >= 3"
            value={constraints.map((constraint) => constraint.expression).join(", ")}
            onChange={(e) => {
              const newConstraints = e.target.value
                .split(",")
                .map((c) => {
                  // Detectar el operador y separar la expresión y el límite
                  const operatorMatch = c.match(/<=|>=|<|>|=/);
                  if (operatorMatch) {
                    const [expr, limit] = c.split(operatorMatch[0]).map((item) => item.trim());
                    return { 
                      expression: expr, 
                      operator: operatorMatch[0], 
                      limit: parseFloat(limit) 
                    };
                  }
                  return null;
                })
                .filter((constraint) => constraint !== null); // Filtrar entradas vacías o inválidas
              setConstraints(newConstraints);
            }}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition duration-300">
          Calcular
        </button>
        <button type="button" onClick={handleReset} className="w-full bg-gray-600 text-white rounded-lg py-2 mt-2 hover:bg-gray-700 transition duration-300">
          Resetear
        </button>
      </form>

      {/* Mostrar resultados */}
      {result.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Resultados:</h2>
          <ul className="list-disc list-inside">
            {result.map((metric, index) => (
              <li key={index} className="text-gray-600">
                {metric.label}: <strong>{metric.value}</strong> {metric.isValid && `- ${metric.isValid}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
