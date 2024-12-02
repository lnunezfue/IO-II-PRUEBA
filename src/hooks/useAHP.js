import { useState } from "react";

// Hook para manejar el análisis de Jerarquía Analítica (AHP)
const useAHP = () => {
  const [weights, setWeights] = useState(null);
  const [criteriaWeights, setCriteriaWeights] = useState(null);

  // Función para calcular los pesos usando AHP
  const calculateAHP = (criteriaMatrix, alternativesMatrices) => {
    const size = criteriaMatrix.length;

    // Sumar cada columna para la matriz de criterios
    const columnSums = Array(size).fill(0);
    criteriaMatrix.forEach(row => {
      row.forEach((value, colIndex) => {
        columnSums[colIndex] += value;
      });
    });

    // Normalizar la matriz de criterios dividiendo por la suma de columnas
    const normalizedCriteriaMatrix = criteriaMatrix.map(row =>
      row.map((value, colIndex) => value / columnSums[colIndex])
    );

    // Calcular los pesos promedio de cada fila (criterios)
    const calculatedCriteriaWeights = normalizedCriteriaMatrix.map(row =>
      row.reduce((sum, value) => sum + value, 0) / size
    );

    setCriteriaWeights(calculatedCriteriaWeights);

    // Calcular pesos para cada alternativa por criterio
    const alternativesWeights = alternativesMatrices.map((matrix, i) => {
      const columnSums = Array(matrix.length).fill(0);
      matrix.forEach(row => {
        row.forEach((value, colIndex) => {
          columnSums[colIndex] += value;
        });
      });
      const normalizedMatrix = matrix.map(row =>
        row.map((value, colIndex) => value / columnSums[colIndex])
      );
      return normalizedMatrix.map(row =>
        row.reduce((sum, value) => sum + value, 0) / matrix.length
      );
    });

    // Calcular la ponderación final de cada alternativa
    const finalWeights = alternativesWeights[0].map((_, altIndex) => {
      return alternativesWeights.reduce((total, altWeights, critIndex) => {
        return total + altWeights[altIndex] * calculatedCriteriaWeights[critIndex];
      }, 0);
    });

    setWeights(finalWeights);
  };

  return {
    weights,
    criteriaWeights,
    calculateAHP
  };
};

export default useAHP;
