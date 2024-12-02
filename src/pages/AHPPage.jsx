import { useState } from "react";
import { useForm } from "react-hook-form";
import useAHP from "../hooks/useAHP";

export const AHPPage = () => {
  const { handleSubmit, register, reset } = useForm();
  const { weights, criteriaWeights, calculateAHP } = useAHP();
  const [matrixSize, setMatrixSize] = useState(0); // Tamaño de la matriz de criterios
  const [alternativeSize, setAlternativeSize] = useState(0); // Número de alternativas
  const [matrix, setMatrix] = useState([]); // Matriz de criterios
  const [alternativesMatrices, setAlternativesMatrices] = useState([]); // Matrices de alternativas

  // Crear la matriz de criterios
  const createMatrix = (size) => {
    const newMatrix = Array(size).fill(null).map(() => Array(size).fill(1));
    setMatrix(newMatrix);
  };

  // Crear las matrices de alternativas
  const createAlternativeMatrices = (size, numAlternatives) => {
    const newMatrices = Array(size).fill(null).map(() =>
      Array(numAlternatives).fill(null).map(() => Array(numAlternatives).fill(1))
    );
    setAlternativesMatrices(newMatrices);
  };

  // Cambiar valores de la matriz de criterios
  const handleMatrixChange = (rowIndex, colIndex, value) => {
    const updatedMatrix = [...matrix];
    updatedMatrix[rowIndex][colIndex] = parseFloat(value);
    updatedMatrix[colIndex][rowIndex] = 1 / parseFloat(value); // AHP asegura matrices recíprocas
    setMatrix(updatedMatrix);
  };

  // Cambiar valores de las matrices de alternativas
  const handleAlternativeMatrixChange = (matrixIndex, rowIndex, colIndex, value) => {
    const updatedMatrices = [...alternativesMatrices];
    updatedMatrices[matrixIndex][rowIndex][colIndex] = parseFloat(value);
    updatedMatrices[matrixIndex][colIndex][rowIndex] = 1 / parseFloat(value); // Recíproca
    setAlternativesMatrices(updatedMatrices);
  };

  // Enviar datos al hook para cálculo
  const onSubmit = () => {
    calculateAHP(matrix, alternativesMatrices);
  };

  const handleReset = () => {
    reset();
    setMatrixSize(0);
    setAlternativeSize(0);
    setMatrix([]);
    setAlternativesMatrices([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Análisis de Jerarquía Analítica (AHP)</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Planteamiento</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tamaño de la matriz de criterios */}
          <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="matrixSize" className="block font-semibold">Tamaño de la Matriz de Criterios:</label>
            <input
              type="number"
              id="matrixSize"
              placeholder="Ej: 3"
              min="1"
              className="p-2 border rounded-lg"
              value={matrixSize}
              onChange={(e) => setMatrixSize(parseInt(e.target.value))}
            />
            <button
              type="button"
              className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
              onClick={() => createMatrix(matrixSize)}
            >
              Crear Matriz
            </button>
          </div>

          {/* Tamaño de alternativas */}
          <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="alternativeSize" className="block font-semibold">Número de Alternativas:</label>
            <input
              type="number"
              id="alternativeSize"
              placeholder="Ej: 3"
              min="1"
              className="p-2 border rounded-lg"
              value={alternativeSize}
              onChange={(e) => setAlternativeSize(parseInt(e.target.value))}
            />
            <button
              type="button"
              className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
              onClick={() => createAlternativeMatrices(matrixSize, alternativeSize)}
            >
              Crear Alternativas
            </button>
          </div>

          {matrix.length > 0 && (
            <div className="overflow-auto">
              <h3 className="font-semibold mb-4">Matriz de Comparación de Criterios</h3>
              <table className="table-auto w-full text-left text-gray-600 mb-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Criterios</th>
                    {matrix.map((_, colIndex) => (
                      <th key={colIndex} className="px-4 py-2">C{colIndex + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="px-4 py-2 font-semibold">C{rowIndex + 1}</td>
                      {row.map((value, colIndex) => (
                        <td key={colIndex} className="px-4 py-2">
                          {rowIndex === colIndex ? (
                            <input
                              type="number"
                              value={1}
                              readOnly
                              className="w-full p-2 border rounded-lg bg-gray-100"
                            />
                          ) : (
                            <input
                              type="number"
                              step="0.0001"
                              value={value}
                              className="w-full p-2 border rounded-lg"
                              onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {alternativesMatrices.length > 0 && (
            <div className="space-y-6">
              {alternativesMatrices.map((matrix, matrixIndex) => (
                <div key={matrixIndex}>
                  <h3 className="font-semibold mb-4">Matriz de Comparación para el Criterio {matrixIndex + 1}</h3>
                  <table className="table-auto w-full text-left text-gray-600 mb-4">
                    <thead>
                      <tr>
                        <th className="px-4 py-2">Alternativas</th>
                        {matrix.map((_, colIndex) => (
                          <th key={colIndex} className="px-4 py-2">A{colIndex + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="px-4 py-2 font-semibold">A{rowIndex + 1}</td>
                          {row.map((value, colIndex) => (
                            <td key={colIndex} className="px-4 py-2">
                              {rowIndex === colIndex ? (
                                <input
                                  type="number"
                                  value={1}
                                  readOnly
                                  className="w-full p-2 border rounded-lg bg-gray-100"
                                />
                              ) : (
                                <input
                                  type="number"
                                  step="0.0001"
                                  value={value}
                                  className="w-full p-2 border rounded-lg"
                                  onChange={(e) => handleAlternativeMatrixChange(matrixIndex, rowIndex, colIndex, e.target.value)}
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}

          {matrix.length > 0 && (
            <div className="flex space-x-4">
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-colors">
                Calcular AHP
              </button>
              <button type="button" onClick={handleReset} className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-colors">
                Reiniciar
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Mostrar los pesos de los criterios */}
      {criteriaWeights && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Peso de los Criterios</h2>
          <ul className="list-disc list-inside">
            {criteriaWeights.map((weight, index) => (
              <li key={index}>Criterio {index + 1}: {weight.toFixed(4)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Mostrar los pesos de las alternativas */}
      {weights && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Resultado de AHP (Alternativas)</h2>
          <ul className="list-disc list-inside">
            {weights.map((weight, index) => (
              <li key={index}>Alternativa {index + 1}: {weight.toFixed(4)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AHPPage;
