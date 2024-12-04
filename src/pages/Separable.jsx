import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs";

export const Separable = () => {
  const { handleSubmit, register, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");
  const [constraints, setConstraints] = useState([]);
  const [result, setResult] = useState([]);
  const [optimizationType, setOptimizationType] = useState("maximizar"); // Estado para el tipo de optimización

  const onSubmit = () => {
    calculateSeparable({ objectiveFunction, constraints, optimizationType });
  };

  const calculateSeparable = ({ objectiveFunction, constraints, optimizationType }) => {
    // Rango de valores para x1 y x2 (esto puede ser más dinámico según el problema)
    const x1Values = [0, 1, 2, 3, 4]; // Ejemplo de valores posibles para x1
    const x2Values = [0, 1, 2, 3, 4]; // Ejemplo de valores posibles para x2

    let bestValue = optimizationType === "maximizar" ? -Infinity : Infinity;
    let bestX1 = 0;
    let bestX2 = 0;

    // Evaluar la función objetivo para diferentes combinaciones de x1 y x2
    x1Values.forEach((x1) => {
      x2Values.forEach((x2) => {
        const scope = { x1, x2 };

        try {
          // Evaluar la función objetivo
          const objResult = evaluate(objectiveFunction, scope);

          // Evaluar las restricciones
          const constraintsResults = constraints.map((constraint) => {
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
              isValid: isValid,
            };
          });

          // Si todas las restricciones son válidas, evaluamos la función objetivo
          const isValid = constraintsResults.every((constraint) => constraint.isValid);

          if (isValid) {
            if (
              (optimizationType === "maximizar" && objResult > bestValue) ||
              (optimizationType === "minimizar" && objResult < bestValue)
            ) {
              bestValue = objResult;
              bestX1 = x1;
              bestX2 = x2;
            }
          }

          // Actualizamos los resultados de las restricciones
          setResult([
            { label: "Función Objetivo", value: objResult },
            { label: "Valor de x1", value: x1 },
            { label: "Valor de x2", value: x2 },
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
      });
    });

    // Mostrar el resultado final: el máximo o mínimo valor de la función objetivo
    setResult([
      { label: "Función Objetivo (Resultado Final)", value: bestValue },
      { label: "Valor de x1", value: bestX1 },
      { label: "Valor de x2", value: bestX2 },
    ]);
  };

  const handleReset = () => {
    reset();
    setObjectiveFunction("");
    setConstraints([]);
    setResult([]);
  };

  const handleAddConstraint = () => {
    setConstraints([...constraints, { expression: "", operator: "", limit: "" }]);
  };

  const handleConstraintChange = (index, field, value) => {
    const updatedConstraints = [...constraints];
    updatedConstraints[index][field] = value;
    setConstraints(updatedConstraints);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-yellow-500 text-center mb-6">Programación Separable</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo:</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Restricciones:</label>
          {constraints.map((constraint, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={constraint.expression}
                onChange={(e) => handleConstraintChange(index, "expression", e.target.value)}
                placeholder="Expresión"
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <select
                value={constraint.operator}
                onChange={(e) => handleConstraintChange(index, "operator", e.target.value)}
                className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Operador</option>
                <option value="<=">≤</option>
                <option value="<">&lt;</option>
                <option value=">=">≥</option>
                <option value=">">&gt;</option>
                <option value="=">=</option>
              </select>
              <input
                type="number"
                value={constraint.limit}
                onChange={(e) => handleConstraintChange(index, "limit", e.target.value)}
                placeholder="Límite"
                className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddConstraint}
            className="w-full bg-yellow-500 text-white rounded-lg py-2 hover:bg-yellow-600 transition duration-300"
          >
            Agregar Restricción
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Tipo de Optimización:</label>
          <select
            value={optimizationType}
            onChange={(e) => setOptimizationType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="maximizar">Maximizar</option>
            <option value="minimizar">Minimizar</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-yellow-500 text-white rounded-lg py-2 hover:bg-yellow-600 transition duration-300">
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
              <li key={index} className="text-gray-700 p-2">
                {metric.label}: <strong>{metric.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
