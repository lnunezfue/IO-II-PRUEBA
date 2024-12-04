import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useQueue from "../hooks/useQueue";

export const Queue = () => {
  const { handleSubmit, register, reset } = useForm();
  const { result, compute } = useQueue();
  const [variation, setVariation] = useState("mm1");

  // Maneja el envío del formulario
  const onSubmit = handleSubmit((values) => {
    const formattedValues = formatValues(values);
    if (validateForm(formattedValues)) {
      compute(formattedValues, variation);
    } else {
      console.error("Formulario inválido. Verifica los valores ingresados.");
    }
  });

  // Valida que todos los valores sean numéricos
  const validateForm = (values) => {
    for (let key in values) {
      if (isNaN(values[key]) || values[key] === "") {
        return false;
      }
    }
    return true;
  };

  // Formatea los valores de entrada a números flotantes
  const formatValues = (values) => {
    const formatted = {};
    for (let key in values) {
      formatted[key] = parseFloat(values[key]) || 0;
    }
    return formatted;
  };

  // Resetea el formulario
  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 mt-6 text-gray-700">Teoria de Colas Calculadora</h1>
      <form onSubmit={onSubmit} className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {/* Tasa de llegada (λ) */}
        <div className="mb-6">
          <label htmlFor="lambda" className="block text-gray-700 font-semibold">Tasa de llegada (λ):</label>
          <input
            type="number"
            step="0.01"
            id="lambda"
            className="w-full border rounded-lg p-3 mt-2 text-gray-700"
            {...register("lambda", { required: true })}
          />
        </div>

        {/* Tasa de servicio (μ) */}
        <div className="mb-6">
          <label htmlFor="mu" className="block text-gray-700 font-semibold">Tasa de servicio (μ):</label>
          <input
            type="number"
            step="0.01"
            id="mu"
            className="w-full border rounded-lg p-3 mt-2 text-gray-700"
            {...register("mu", { required: true })}
          />
        </div>

        {/* Número de servidores (c) */}
        <div className="mb-6">
          <label htmlFor="servers" className="block text-gray-700 font-semibold">Número de servidores (c):</label>
          <input
            type="number"
            id="servers"
            className="w-full border rounded-lg p-3 mt-2 text-gray-700"
            {...register("servers", { required: true })}
          />
        </div>

        {/* Distribución de llegada y servicio (opcional, para algunos modelos) */}
        <div className="mb-6">
          <label htmlFor="arrivalDistribution" className="block text-gray-700 font-semibold">Distribución de llegada:</label>
          <input
            type="text"
            id="arrivalDistribution"
            placeholder="Por ejemplo, Poisson"
            className="w-full border rounded-lg p-3 mt-2 text-gray-700"
            {...register("arrivalDistribution")}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="serviceDistribution" className="block text-gray-700 font-semibold">Distribución de servicio:</label>
          <input
            type="text"
            id="serviceDistribution"
            placeholder="Por ejemplo, Exponencial"
            className="w-full border rounded-lg p-3 mt-2 text-gray-700"
            {...register("serviceDistribution")}
          />
        </div>

        {/* Selector de modelo de cola */}
        <div className="mb-6">
          <label htmlFor="variation" className="block text-gray-700 font-semibold">Modelo de cola:</label>
          <select
            id="variation"
            className="w-full border rounded-lg p-3 mt-2 text-gray-700"
            value={variation}
            onChange={(e) => setVariation(e.target.value)}
          >
            <option value="mm1">M/M/1</option>
            <option value="mmc">M/M/c</option>
            <option value="mm_infinity">M/M/∞</option>
            <option value="md1">M/D/1</option>
            <option value="mg1">M/G/1</option>
            <option value="mgc0">M/G/c/0</option>
          </select>
        </div>

        <div className="flex flex-col space-y-4">
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-3 font-semibold hover:bg-blue-700 transition duration-300 ease-in-out">Calcular</button>
          <button type="button" className="w-full bg-gray-600 text-white rounded-lg py-3 font-semibold hover:bg-gray-700 transition duration-300 ease-in-out" onClick={handleReset}>
            Resetear
          </button>
        </div>
      </form>

      {/* Mostrar resultados */}
      <div className="mt-8 w-full max-w-md">
        {result.length > 0 && (
          <table className="border-collapse w-full text-gray-700">
            <thead>
              <tr>
                <th className="border border-gray-300 p-4 text-left font-semibold">Métrica</th>
                <th className="border border-gray-300 p-4 text-left font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody>
              {result.map((metric, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-4">{metric.label}</td>
                  <td className="border border-gray-300 p-4">{metric.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
