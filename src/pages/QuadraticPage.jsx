import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs"; // Asegúrate de tener mathjs instalado

export const QuadraticPage = () => {
  const { handleSubmit, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState("");  // Función Objetivo
  const [constraints, setConstraints] = useState([""]);  // Restricciones
  const [result, setResult] = useState([]);

  // Función para evaluar la función objetivo y las restricciones
  const calculateQuadratic = () => {
    try {
      // Valores de ejemplo para x1 y x2 (puedes cambiarlos)
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
          valid: isValid ? "Sí" : "No"
        });
      });

      // Agregar los resultados a la salida
      setResult([
        { label: "Resultado Función Objetivo", value: objResult },
        { label: "Restricciones Cumplidas", value: constraintsValid ? "Sí" : "No" },
        ...evaluatedConstraints,
      ]);
    } catch (error) {
      setResult([{ label: "Error", value: "Hubo un error en la evaluación de la expresión." }]);
    }
  };

  const onSubmit = () => {
    calculateQuadratic();
  };

  const handleReset = () => {
    reset();
    setObjectiveFunction("");
    setConstraints([""]);
    setResult([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Programación Cuadrática</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        {/* Entrada de la Función Objetivo */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Función Objetivo (Ejemplo: c1*x1^2 + c2*x2^2 + c3*x1*x2 + d1*x1 + d2*x2 + c):</label>
          <input
            type="text"
            value={objectiveFunction}
            onChange={(e) => setObjectiveFunction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Ej: x1^2 + x2^2 - 3*x1 + 2*x2"
          />
        </div>

        {/* Entrada de las Restricciones */}
        <div className="mb-4">
          <label className="block font-semibold text-gray-700">Restricciones (separadas por comas):</label>
          <input
            type="text"
            value={constraints.join(",")}
            onChange={(e) => setConstraints(e.target.value.split(",").map((str) => str.trim()))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Ej: x1^2 + x2^2 <= 9, x1 + x2 >= 3"
          />
        </div>

        {/* Botones de acción */}
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

export default QuadraticPage;


