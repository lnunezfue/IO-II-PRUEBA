import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs";

export const QuadraticPage = () => {
  const { handleSubmit, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");
  const [constraints, setConstraints] = useState([]);
  const [optimizationType, setOptimizationType] = useState("maximizar");
  const [result, setResult] = useState([]);

  const calculateQuadratic = () => {
    const x1Values = [0, 1, 2, 3, 4, 5];
    const x2Values = [0, 1, 2, 3, 4, 5];
    let bestValue = optimizationType === "maximizar" ? -Infinity : Infinity;
    let bestX1 = 0;
    let bestX2 = 0;

    try {
      x1Values.forEach((x1) => {
        x2Values.forEach((x2) => {
          const scope = { x1, x2 };
          const objResult = evaluate(objectiveFunction, scope);

          const isValid = constraints.every(({ expression, operator, limit }) => {
            const constraintResult = evaluate(expression, scope);
            switch (operator) {
              case "<=":
                return constraintResult <= limit;
              case ">=":
                return constraintResult >= limit;
              case "<":
                return constraintResult < limit;
              case ">":
                return constraintResult > limit;
              case "=":
                return constraintResult === limit;
              default:
                return false;
            }
          });

          if (
            isValid &&
            ((optimizationType === "maximizar" && objResult > bestValue) ||
              (optimizationType === "minimizar" && objResult < bestValue))
          ) {
            bestValue = objResult;
            bestX1 = x1;
            bestX2 = x2;
          }
        });
      });

      setResult([
        { label: "Valor Óptimo de Z", value: bestValue },
        { label: "Valor de x1", value: bestX1 },
        { label: "Valor de x2", value: bestX2 },
      ]);
    } catch (error) {
      setResult([{ label: "Error", value: "Ocurrió un problema durante la evaluación." }]);
    }
  };

  const handleAddConstraint = () => {
    setConstraints([...constraints, { expression: "", operator: "<=", limit: "" }]);
  };

  const handleConstraintChange = (index, field, value) => {
    const updatedConstraints = [...constraints];
    updatedConstraints[index][field] = value;
    setConstraints(updatedConstraints);
  };

  const onSubmit = () => {
    calculateQuadratic();
  };

  const handleReset = () => {
    reset();
    setObjectiveFunction("");
    setConstraints([]);
    setResult([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Programación Cuadrática</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo (Z):</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Ej: x1^2 + x2^2 - 3*x1 + 2*x2"
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
                placeholder="Expresión (Ej: x1 + x2)"
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <select
                value={constraint.operator}
                onChange={(e) => handleConstraintChange(index, "operator", e.target.value)}
                className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="<=">≤</option>
                <option value=">=">≥</option>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
                <option value="=">=</option>
              </select>
              <input
                type="number"
                value={constraint.limit}
                onChange={(e) => handleConstraintChange(index, "limit", e.target.value)}
                placeholder="Límite"
                className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddConstraint}
            className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition duration-300"
          >
            Agregar Restricción
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Tipo de Optimización:</label>
          <select
            value={optimizationType}
            onChange={(e) => setOptimizationType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="maximizar">Maximizar</option>
            <option value="minimizar">Minimizar</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-700 transition duration-300"
        >
          Calcular
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full bg-gray-600 text-white rounded-lg py-2 mt-2 hover:bg-gray-700 transition duration-300"
        >
          Resetear
        </button>
      </form>

      {result.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Resultados:</h2>
          <ul className="list-disc list-inside">
            {result.map((metric, index) => (
              <li key={index} className="text-gray-600">
                <strong>{metric.label}:</strong> {metric.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuadraticPage;
