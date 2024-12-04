import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs";

export const NonConvexPage = () => {
  const { handleSubmit, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");
  const [optimizationType, setOptimizationType] = useState("maximize");
  const [constraints, setConstraints] = useState([{ expression: "", operator: "<=", limit: "" }]);
  const [result, setResult] = useState([]);

  const calculateNonConvex = () => {
    try {
      let optimalValue = optimizationType === "maximize" ? -Infinity : Infinity;
      let optimalX = { x1: 0, x2: 0 };
      const step = 0.1; // Incremento para explorar los valores
      const range = 10; // Rango de valores para x1 y x2 (-10 a 10)
  
      for (let x1 = -range; x1 <= range; x1 += step) {
        for (let x2 = -range; x2 <= range; x2 += step) {
          const constraintsValid = constraints.every((constraint) => {
            const value = evaluate(constraint.expression, { x1, x2 });
            return constraint.operator === "<=" 
              ? value <= parseFloat(constraint.limit) 
              : value >= parseFloat(constraint.limit);
          });
  
          if (constraintsValid) {
            const objValue = evaluate(objectiveFunction, { x1, x2 });
  
            if (
              (optimizationType === "maximize" && objValue > optimalValue) ||
              (optimizationType === "minimize" && objValue < optimalValue)
            ) {
              optimalValue = objValue;
              optimalX = { x1, x2 };
            }
          }
        }
      }
  
      // Redondear valores antes de pasarlos al estado
      const roundedOptimalValue = Math.round(optimalValue * 100) / 100; // Redondeo a 2 decimales
      const roundedX1 = Math.round(optimalX.x1 * 100) / 100;
      const roundedX2 = Math.round(optimalX.x2 * 100) / 100;
  
      setResult([
        { label: "Valor Óptimo de Z", value: roundedOptimalValue },
        { label: "Valores de X1 y X2", value: `X1 = ${roundedX1}, X2 = ${roundedX2}` },
        {
          label: "Restricciones Evaluadas",
          value: constraints.map((constraint, index) => (
            `Restricción ${index + 1}: ${constraint.expression} ${constraint.operator} ${constraint.limit}`
          )).join(", "), // Unir las restricciones como texto
        },
      ]);
      
    } catch (error) {
      setResult([{ label: "Error", value: "Ocurrió un error al evaluar las expresiones." }]);
    }
  };
  

  const onSubmit = () => {
    calculateNonConvex();
  };

  const handleReset = () => {
    reset();
    setObjectiveFunction("");
    setOptimizationType("maximize");
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
      <h1 className="text-3xl font-bold text-center text-red-700 mb-6">Programación No Convexa</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo:</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Ej: x1^2 + x2^2 - 3*x1 + 2*x2"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Tipo de Optimización:</label>
          <select
            value={optimizationType}
            onChange={(e) => setOptimizationType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="maximize">Maximizar</option>
            <option value="minimize">Minimizar</option>
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
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Ej: x1^2 + x2^2"
              />
              <select
                value={constraint.operator}
                onChange={(e) => updateConstraint(index, "operator", e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="<=">≤</option>
                <option value=">=">≥</option>
              </select>
              <input
                type="text"
                value={constraint.limit}
                onChange={(e) => updateConstraint(index, "limit", e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Ej: 10"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addConstraint}
            className="text-red-600 font-semibold mt-2 hover:underline"
          >
            + Agregar Restricción
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition duration-300"
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
          <strong>{metric.label}:</strong> 
          {metric.value}
          {Array.isArray(metric.value) && metric.value.map((res, i) => (
            <div key={i} className="ml-4">
              <strong>{res.label}:</strong> 
              {res.expression} {res.operator} {res.limit}
            </div>
          ))}
        </li>
      ))}
    </ul>
  </div>
)}


    </div>
  );
};

export default NonConvexPage;
