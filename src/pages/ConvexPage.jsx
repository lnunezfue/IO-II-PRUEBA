import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { evaluate } from "mathjs"; // Asegúrate de tener mathjs instalado

export const ConvexPage = () => {
  const { handleSubmit, register, reset } = useForm();
  const [objectiveFunction, setObjectiveFunction] = useState(""); // Cambié a string para ingresar la función como texto
  const [constraints, setConstraints] = useState([""]); // Cambié a array de strings para ingresar restricciones como texto
  const [result, setResult] = useState([]);

  // Función para evaluar la función objetivo y las restricciones
  const calculateConvex = () => {
    try {
      // Evaluar la función objetivo con valores de ejemplo
      const objResult = evaluate(objectiveFunction, { x1: 2, x2: 1 }); // Puedes cambiar los valores de x1 y x2 para probar
      let constraintsValid = true;

      // Evaluar las restricciones
      constraints.forEach((constraint) => {
        const constraintResult = evaluate(constraint, { x1: 2, x2: 1 });
        if (constraintResult < 0) {
          constraintsValid = false;
        }
      });

      // Mostrar resultados
      setResult([
        { label: "Resultado Función Objetivo", value: objResult },
        { label: "Restricciones Cumplidas", value: constraintsValid ? "Sí" : "No" },
      ]);
    } catch (error) {
      setResult([{ label: "Error", value: "Hubo un error en la evaluación de la expresión." }]);
    }
  };

  const onSubmit = () => {
    calculateConvex();
  };

  const handleReset = () => {
    reset();
    setObjectiveFunction("");
    setConstraints([""]);
    setResult([]);
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
          <label className="block font-semibold text-gray-700">Restricciones (separadas por comas):</label>
          <input
            type="text"
            value={constraints.join(",")}
            onChange={(e) => setConstraints(e.target.value.split(",").map((str) => str.trim()))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Ej: x1 + x2 >= 2, x1 - x2 <= 1"
          />
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
