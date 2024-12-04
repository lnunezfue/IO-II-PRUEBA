import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs"; // Usamos mathjs solo para evaluar funciones

export const FractionalPage = () => {
  const { handleSubmit, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");
  const [constraints, setConstraints] = useState([]);
  const [result, setResult] = useState([]);
  const [objectiveType, setObjectiveType] = useState("max"); // max o min

  const onSubmit = () => {
    calculateFraccionaria({ objectiveFunction, constraints });
  };

  const calculateFraccionaria = ({ objectiveFunction, constraints }) => {
    // Resolvemos la optimización para encontrar puntos factibles y optimizar
    const feasiblePoints = findFeasiblePoints(constraints);
    
    if (feasiblePoints.length === 0) {
      setResult([{ label: "Error", value: "No se encontraron soluciones viables" }]);
      return;
    }

    let bestValue = objectiveType === "max" ? -Infinity : Infinity;
    let bestPoint = {};

    feasiblePoints.forEach((point) => {
      const scope = { x1: point.x1, x2: point.x2 };
      const objResult = evaluate(objectiveFunction, scope);

      // Determinamos el mejor valor según el tipo de optimización
      if ((objectiveType === "max" && objResult > bestValue) ||
          (objectiveType === "min" && objResult < bestValue)) {
        bestValue = objResult;
        bestPoint = point;
      }
    });

    setResult([
      { label: "Función Objetivo", value: objectiveFunction },
      { label: `${objectiveType === "max" ? "Máximo" : "Mínimo"} Z`, value: bestValue, x1: bestPoint.x1, x2: bestPoint.x2 },
    ]);
  };

  const findFeasiblePoints = (constraints) => {
    const points = [];

    // Muestreo de puntos para encontrar soluciones viables
    for (let x1 = 0; x1 <= 10; x1 += 0.1) {
      for (let x2 = 0; x2 <= 10; x2 += 0.1) {
        if (isFeasible(x1, x2, constraints)) {
          points.push({ x1, x2 });
        }
      }
    }

    return points;
  };

  const isFeasible = (x1, x2, constraints) => {
    for (const constraint of constraints) {
      const scope = { x1, x2 };
      const expression = evaluate(constraint.expression, scope);
      if (constraint.operator === "<=" && expression > constraint.limit) return false;
      if (constraint.operator === ">=" && expression < constraint.limit) return false;
      if (constraint.operator === "<" && expression >= constraint.limit) return false;
      if (constraint.operator === ">" && expression <= constraint.limit) return false;
      if (constraint.operator === "=" && expression !== constraint.limit) return false;
    }
    return true;
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

  const handleObjectiveTypeChange = (event) => {
    setObjectiveType(event.target.value);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-blue-500 text-center mb-6">Programación Fraccionaria</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo:</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: (4*x1 + 3*x2) / (x1 + x2)"
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
                className="w-1/2 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={constraint.operator}
                onChange={(e) => handleConstraintChange(index, "operator", e.target.value)}
                className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-1/4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddConstraint}
            className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition duration-300"
          >
            Agregar Restricción
          </button>
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Tipo de Optimización:</label>
          <select
            value={objectiveType}
            onChange={handleObjectiveTypeChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="max">Máximo</option>
            <option value="min">Mínimo</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 transition duration-300">
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
                {metric.label}: <strong>{metric.value}</strong> {metric.x1 && `- x1: ${metric.x1}, x2: ${metric.x2}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
