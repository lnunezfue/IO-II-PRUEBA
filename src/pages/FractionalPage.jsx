import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs"; // Para poder hacer la evaluación de expresiones matemáticas

export const FractionalPage = () => {
  const { handleSubmit, register, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");
  const [constraints, setConstraints] = useState([]);
  const [result, setResult] = useState([]);
  const [variables, setVariables] = useState({ x1: 0, x2: 0 });

  const onSubmit = () => {
    calculateFractional({ objectiveFunction, constraints });
  };

  const calculateFractional = ({ objectiveFunction, constraints }) => {
    const { x1, x2 } = variables;

    try {
      // Evaluar la función objetivo fraccional: f(x) / g(x)
      const [fExpression, gExpression] = objectiveFunction.split('/');
      const fResult = evaluate(fExpression, { x1, x2 });
      const gResult = evaluate(gExpression, { x1, x2 });

      // Evitar la división por cero
      if (gResult === 0) {
        throw new Error("El denominador no puede ser cero.");
      }

      const objectiveValue = fResult / gResult;

      // Evaluar restricciones
      const constraintsResults = constraints.map((constraint) => {
        const constraintResult = evaluate(constraint.expression, { x1, x2 });
        let isValid;

        // Validación de restricciones
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

      // Resultados
      setResult([
        { label: "Función Objetivo", value: objectiveValue },
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
    setVariables({ x1: 0, x2: 0 });
    setResult([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Programación Fraccional</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        {/* Función Objetivo */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo:</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Ej: 4*x1 + 3*x2 / 2*x1 + x2"
          />
        </div>

        {/* Restricciones */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Restricciones (expresiones con operadores lógicos):</label>
          <input
            type="text"
            placeholder="Ej: x1 + x2 <= 6, x1 >= 1, x2 >= 2"
            value={constraints.map((constraint) => constraint.expression).join(", ")}
            onChange={(e) => {
              const newConstraints = e.target.value
                .split(",")
                .map((c) => {
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
                .filter((constraint) => constraint !== null);
              setConstraints(newConstraints);
            }}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Variables */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Valores de las variables:</label>
          <div className="flex space-x-4">
            <input
              type="number"
              value={variables.x1}
              onChange={(e) => setVariables({ ...variables, x1: parseFloat(e.target.value) })}
              placeholder="x1"
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              value={variables.x2}
              onChange={(e) => setVariables({ ...variables, x2: parseFloat(e.target.value) })}
              placeholder="x2"
              className="w-1/2 p-2 border border-gray-300 rounded"
            />
          </div>
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
