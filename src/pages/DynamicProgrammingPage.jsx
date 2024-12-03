import React, { useState, useEffect } from 'react';

export const DynamicProgrammingPage = () => {
  // Estado para manejar la entrada de datos y resultados
  const [numItems, setNumItems] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [weights, setWeights] = useState([]);
  const [values, setValues] = useState([]);
  const [dpResult, setDpResult] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [problemType, setProblemType] = useState('knapsack'); // Tipo de problema: mochila, brigadas o diligencia de rutas

  // Valores predefinidos para cada tipo de problema
  const predefinedProblems = {
    knapsack: {
      numItems: 4,
      capacity: 10,
      weights: [2, 3, 4, 5],
      values: [3, 4, 5, 6]
    },
    brigades: {
      numItems: 3,
      capacity: 6,  // Capacidad total de brigadas
      weights: [2, 3, 4],  // Asumimos que cada brigada tiene un "peso" (capacidad que puede cubrir)
      values: [4, 5, 6]  // El valor es el "beneficio" que aporta cada brigada
    },
    routes: {
      numItems: 4,
      capacity: 0,  // No hay capacidad en la diligencia, es un problema de rutas
      weights: [
        [0, 10, 15, 30], // Costos entre puntos (de ciudad 0 a 3)
        [10, 0, 35, 25],
        [15, 35, 0, 10],
        [30, 25, 10, 0]
      ],
      values: [0, 0, 0, 0]  // No hay valores en este caso, solo costos entre los puntos
    }
  };

  // Función que actualiza los valores del problema basado en la selección
  useEffect(() => {
    const problemData = predefinedProblems[problemType];
    setNumItems(problemData.numItems);
    setCapacity(problemData.capacity);
    setWeights(problemData.weights);
    setValues(problemData.values);
  }, [problemType]);

  // Manejar cambios en los valores de los objetos (peso y valor)
  const handleInputChange = (e, type, index) => {
    const value = parseInt(e.target.value);
    if (type === 'weight') {
      const newWeights = [...weights];
      newWeights[index] = value;
      setWeights(newWeights);
    } else if (type === 'value') {
      const newValues = [...values];
      newValues[index] = value;
      setValues(newValues);
    }
  };

  // Cálculo de la programación dinámica (adaptado para cada tipo de problema)
  const calculateDP = () => {
    if (numItems === 0 || capacity === 0 || weights.length === 0 || values.length === 0) {
      alert('Por favor, ingrese todos los datos.');
      return;
    }

    let dp, maxValue, itemsSelected;

    if (problemType === 'knapsack') {
      // Problema de la mochila
      dp = Array(numItems + 1).fill(null).map(() =>
        Array(capacity + 1).fill(0)
      );

      for (let i = 1; i <= numItems; i++) {
        for (let w = 1; w <= capacity; w++) {
          if (weights[i - 1] <= w) {
            dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
          } else {
            dp[i][w] = dp[i - 1][w];
          }
        }
      }

      maxValue = dp[numItems][capacity];
      itemsSelected = [];
      let w = capacity;
      for (let i = numItems; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
          itemsSelected.push(i - 1);
          w -= weights[i - 1];
        }
      }

    } else if (problemType === 'brigades') {
      // Problema de brigadas (ejemplo simplificado)
      dp = Array(numItems + 1).fill(null).map(() =>
        Array(capacity + 1).fill(0)
      );

      for (let i = 1; i <= numItems; i++) {
        for (let w = 1; w <= capacity; w++) {
          if (weights[i - 1] <= w) {
            dp[i][w] = Math.max(dp[i - 1][w], values[i - 1] + dp[i - 1][w - weights[i - 1]]);
          } else {
            dp[i][w] = dp[i - 1][w];
          }
        }
      }

      maxValue = dp[numItems][capacity];
      itemsSelected = [];
      let w = capacity;
      let brigadeAssignments = Array(numItems).fill(0); // Inicializa las brigadas asignadas
      for (let i = numItems; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
          brigadeAssignments[i - 1] += 1;
          w -= weights[i - 1];
        }
      }

      // Asigna las brigadas a cada país o punto
      itemsSelected = brigadeAssignments.map((num, idx) => `País/Punto ${idx + 1}: ${num} brigadas`);
      
    } else if (problemType === 'routes') {
      // Problema de diligencia de rutas (algoritmo de costo mínimo)
      const dist = weights; // La matriz de distancias

      // Inicialización del DP
      dp = Array(numItems).fill(Infinity);
      dp[0] = 0; // El costo de la primera ciudad es 0

      // Llenado de la matriz de DP (algoritmo de costo mínimo)
      let previousCity = Array(numItems).fill(null);

      for (let i = 0; i < numItems; i++) {
        for (let j = 0; j < numItems; j++) {
          if (i !== j && dp[i] + dist[i][j] < dp[j]) {
            dp[j] = dp[i] + dist[i][j];
            previousCity[j] = i;
          }
        }
      }

      maxValue = dp[numItems - 1]; // El costo mínimo es el valor en la última ciudad
      let path = [];
      let currentCity = numItems - 1;

      // Reconstruir el camino
      while (currentCity !== null) {
        path.push(currentCity);
        currentCity = previousCity[currentCity];
      }

      // Mostrar la ruta más corta
      itemsSelected = path.reverse().map(city => `Ciudad ${city + 1}`);
    }

    setDpResult(maxValue);
    setSelectedItems(itemsSelected);
  };

  // Resetear valores
  const resetForm = () => {
    setNumItems(0);
    setCapacity(0);
    setWeights([]);
    setValues([]);
    setDpResult(null);
    setSelectedItems([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Programación Dinámica - Selección de Problema</h1>

      {/* Selector de Tipo de Problema */}
      <div className="mb-4">
        <label htmlFor="problemType" className="block font-semibold">Seleccionar tipo de problema:</label>
        <select
          id="problemType"
          value={problemType}
          onChange={(e) => setProblemType(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="knapsack">Mochila</option>
          <option value="brigades">Brigadas</option>
          <option value="routes">Diligencia de Rutas</option>
        </select>
      </div>

      {/* Entrada de Número de Objetos y Capacidad */}
      <div className="mb-4">
        <label htmlFor="numItems" className="block font-semibold">Número de Objetos:</label>
        <input
          type="number"
          id="numItems"
          value={numItems}
          onChange={(e) => setNumItems(Number(e.target.value))}
          className="p-2 border rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="capacity" className="block font-semibold">Capacidad Máxima:</label>
        <input
          type="number"
          id="capacity"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          className="p-2 border rounded-lg"
        />
      </div>

      {/* Entradas de Pesos y Valores */}
      <div className="mb-4">
        <h3 className="font-semibold">Ingresar Pesos y Valores de los Objetos</h3>
        {Array.from({ length: numItems }, (_, index) => (
          <div key={index} className="flex space-x-4">
            <input
              type="number"
              placeholder={`Peso ${index + 1}`}
              value={weights[index] || ''}
              onChange={(e) => handleInputChange(e, 'weight', index)}
              className="p-2 border rounded-lg"
            />
            <input
              type="number"
              placeholder={`Valor ${index + 1}`}
              value={values[index] || ''}
              onChange={(e) => handleInputChange(e, 'value', index)}
              className="p-2 border rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Botones para Calcular y Reiniciar */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={calculateDP}
          className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700"
        >
          Calcular
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
        >
          Reiniciar
        </button>
      </div>

      {/* Mostrar los resultados */}
      {dpResult !== null && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Resultado</h2>
          <p className="text-lg">Valor máximo o costo mínimo: {dpResult}</p>
          <p className="text-lg">Decisiones tomadas: {selectedItems.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default DynamicProgrammingPage;
