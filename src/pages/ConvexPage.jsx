import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs";

export const ConvexPage = () => {
  const { handleSubmit, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");
  const [constraints, setConstraints] = useState([{ expression: "", operator: "<=", limit: "" }]);
  const [optimizationType, setOptimizationType] = useState("minimize");
  const [result, setResult] = useState([]);

  const calculateConvex = () => {
    try {
      let bestResult = optimizationType === "maximize" ? -Infinity : Infinity;
      let bestValues = null;

      // Explorar valores de x1 y x2
      for (let x1 = -10; x1 <= 10; x1 += 0.5) {
        for (let x2 = -10; x2 <= 10; x2 += 0.5) {
          let constraintsValid = true;

          // Verificar restricciones
          for (let constraint of constraints) {
            const { expression, operator, limit } = constraint;
            const evaluatedConstraint = evaluate(expression, { x1, x2 });
            const parsedLimit = parseFloat(limit);

            // Validar restricciones según el operador
            if (
              (operator === "<=" && evaluatedConstraint > parsedLimit) ||
              (operator === ">=" && evaluatedConstraint < parsedLimit) ||
              (operator === "=" && evaluatedConstraint !== parsedLimit)
            ) {
              constraintsValid = false;
              break;
            }
          }

          if (constraintsValid) {
            // Evaluar función objetivo
            const objValue = evaluate(objectiveFunction, { x1, x2 });

            if (
              (optimizationType === "maximize" && objValue > bestResult) ||
              (optimizationType === "minimize" && objValue < bestResult)
            ) {
              bestResult = objValue;
              bestValues = { x1, x2 };
            }
          }
        }
      }

      setResult([
        { label: "Función Objetivo", value: objectiveFunction },
        { label: "Optimización", value: optimizationType === "maximize" ? "Maximizar" : "Minimizar" },
        { label: "Mejor Resultado", value: bestResult !== null ? bestResult.toFixed(4) : "No encontrado" },
        ...(bestValues
          ? [
              { label: "Mejor x1", value: bestValues.x1.toFixed(4) },
              { label: "Mejor x2", value: bestValues.x2.toFixed(4) },
            ]
          : [{ label: "Valores de x1 y x2", value: "No cumplen restricciones" }]),
      ]);
    } catch (error) {
      setResult([{ label: "Error", value: "Hubo un error en la evaluación de la expresión o restricciones." }]);
    }
  };

  const onSubmit = () => {
    calculateConvex();
  };

  const handleReset = () => {
    reset();
    setObjectiveFunction("");
    setConstraints([{ expression: "", operator: "<=", limit: "" }]);
    setResult([]);
  };

  const addConstraint = () => {
    setConstraints([...constraints, { expression: "", operator: "<=", limit: "" }]);
  };

  const updateConstraint = (index, field, value) => {
    const updatedConstraints = [...constraints];
    updatedConstraints[index][field] = value;
    setConstraints(updatedConstraints);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-teal-600 mb-6">Programación Convexa</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo:</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Ej: x1^2 + x2^2 - 4*x1 - 6*x2 + 9"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Tipo de Optimización:</label>
          <select
            value={optimizationType}
            onChange={(e) => setOptimizationType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="minimize">Minimizar</option>
            <option value="maximize">Maximizar</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Restricciones:</label>
          {constraints.map((constraint, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={constraint.expression}
                onChange={(e) => updateConstraint(index, "expression", e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Ej: x1 + x2"
              />
              <select
                value={constraint.operator}
                onChange={(e) => updateConstraint(index, "operator", e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="<=">{"<="}</option>
                <option value=">=">{">="}</option>
                <option value="=">{"="}</option>
              </select>
              <input
                type="text"
                value={constraint.limit}
                onChange={(e) => updateConstraint(index, "limit", e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Límite"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addConstraint}
            className="text-teal-600 hover:underline mt-2"
          >
            + Agregar Restricción
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 text-white rounded-lg py-2 hover:bg-teal-700 transition duration-300"
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

      {/* Mostrar resultados */}
      {result.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Resultados:</h2>
          <ul className="list-disc list-inside">
            {result.map((metric, index) => (
              <li key={index} className="text-gray-600">
                {metric.label}: <strong>{metric.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConvexPage;
