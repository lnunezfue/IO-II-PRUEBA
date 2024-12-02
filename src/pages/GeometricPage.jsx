import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs"; // Asegúrate de tener mathjs instalado

export const GeometricPage = () => {
  const { handleSubmit, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");
  const [constraints, setConstraints] = useState([""]);
  const [result, setResult] = useState([]);

  // Función para evaluar la función objetivo y las restricciones
  const calculateGeometric = () => {
    try {
      // Definir valores de ejemplo para x1 y x2
      const x1 = 2;
      const x2 = 1;

      // Evaluar la función objetivo
      const objResult = evaluate(objectiveFunction, { x1, x2 });

      let constraintsValid = true;
      const evaluatedConstraints = [];

      // Evaluar las restricciones
      constraints.forEach((constraint, index) => {
        const constraintResult = evaluate(constraint, { x1, x2 });

        // Evaluar si la restricción es válida
        const isValid = constraintResult >= 0;
        if (!isValid) {
          constraintsValid = false;
        }

        // Almacenar el detalle de la evaluación de la restricción
        evaluatedConstraints.push({
          label: `Restricción ${index + 1}`,
          result: constraintResult,
          x1,
          x2,
          valid: isValid ? "Cumplida" : "No Cumplida"
        });
      });

      // Agregar los resultados a la salida
      setResult([
        { label: "Resultado Función Objetivo", value: objResult },
        ...evaluatedConstraints,
      ]);
    } catch (error) {
      setResult([{ label: "Error", value: "Hubo un error en la evaluación de la expresión." }]);
    }
  };

  const onSubmit = () => {
    calculateGeometric();
  };

  const handleReset = () => {
    reset();
    setObjectiveFunction("");
    setConstraints([""]);
    setResult([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Programación Geométrica</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo:</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Ej: (x1^2 + 1) / (x2 + 1)"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Restricciones (separadas por comas):</label>
          <input
            type="text"
            value={constraints.join(",")}
            onChange={(e) => setConstraints(e.target.value.split(",").map((str) => str.trim()))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Ej: (x1 + 1) / (x2 + 1) <= 5, x1 + x2 >= 3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 transition duration-300"
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
                <strong>{metric.label}:</strong> {metric.value}
                {metric.x1 !== undefined && metric.x2 !== undefined && (
                  <p className="text-gray-500 mt-2">
                    <strong>Evaluación:</strong> Para la restricción, con x1 = {metric.x1}, x2 = {metric.x2}.
                    Resultado de la restricción: <strong>{metric.result}</strong> - {metric.valid}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeometricPage;
