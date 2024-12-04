import React, { useState, useEffect } from 'react';

export const DynamicProgrammingPage = () => {
  const [numItems, setNumItems] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [weights, setWeights] = useState([]);
  const [values, setValues] = useState([]);
  const [dpResult, setDpResult] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [problemType, setProblemType] = useState('knapsack');
  const [distances, setDistances] = useState([]);

  const predefinedProblems = {
    knapsack: {
      numItems: 4,
      capacity: 10,
      weights: [2, 3, 4, 5],
      values: [3, 4, 5, 6]
    },
    brigades: {
      numItems: 3,
      capacity: 6,
      weights: [2, 3, 4],
      values: [4, 5, 6]
    },
    routes: {
      numItems: 4,
      capacity: 0,
      weights: [
        [0, 10, 15, 30],
        [10, 0, 35, 25],
        [15, 35, 0, 10],
        [30, 25, 10, 0]
      ],
      values: [0, 0, 0, 0]
    }
  };

  useEffect(() => {
    const problemData = predefinedProblems[problemType];
    setNumItems(problemData.numItems);
    setCapacity(problemData.capacity);
    setWeights(problemData.weights);
    setValues(problemData.values);
    setDistances(problemData.weights);
  }, [problemType]);

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

  const handleDistanceChange = (e, from, to) => {
    const newDistances = [...distances];
    newDistances[from][to] = parseInt(e.target.value);
    newDistances[to][from] = parseInt(e.target.value);
    setDistances(newDistances);
  };

  const calculateDP = () => {
    if (problemType === 'knapsack' || problemType === 'brigades') {
      if (numItems === 0 || capacity === 0 || weights.length === 0 || values.length === 0) {
        alert('Por favor, ingrese todos los datos.');
        return;
      }
    } else if (problemType === 'routes') {
      if (numItems === 0 || distances.length === 0 || distances.some(row => row.length !== numItems)) {
        alert('Por favor, ingrese correctamente todas las distancias.');
        return;
      }
    }    

    let dp, maxValue, itemsSelected;

    if (problemType === 'knapsack') {
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
      let brigadeAssignments = Array(numItems).fill(0);
      for (let i = numItems; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
          brigadeAssignments[i - 1] += 1;
          w -= weights[i - 1];
        }
      }

      itemsSelected = brigadeAssignments.map((num, idx) => `País/Punto ${idx + 1}: ${num} brigadas`);

    } else if (problemType === 'routes') {
      const dist = distances;

      for (let i = 0; i < numItems; i++) {
        for (let j = 0; j < numItems; j++) {
          if (dist[i][j] === undefined || isNaN(dist[i][j])) {
            alert('Por favor asegúrese de que todas las distancias estén ingresadas correctamente.');
            return;
          }
        }
      }      

      dp = Array(numItems).fill(Infinity);
      dp[0] = 0;

      let previousCity = Array(numItems).fill(null);

      for (let i = 0; i < numItems; i++) {
        for (let j = 0; j < numItems; j++) {
          if (i !== j && dp[i] + dist[i][j] < dp[j]) {
            dp[j] = dp[i] + dist[i][j];
            previousCity[j] = i;
          }
        }
      }

      maxValue = dp[numItems - 1];
      let path = [];
      let currentCity = numItems - 1;

      while (currentCity !== null) {
        path.push(currentCity);
        currentCity = previousCity[currentCity];
      }

      itemsSelected = path.reverse().map(city => `Ciudad ${city + 1}`);
    }

    setDpResult(maxValue);
    setSelectedItems(itemsSelected);
  };

  const resetForm = () => {
    setNumItems(0);
    setCapacity(0);
    setWeights([]);
    setValues([]);
    setDistances([]);
    setDpResult(null);
    setSelectedItems([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Problema de Programación Dinámica</h1>
      <div className="mb-6">
        <label className="text-lg font-semibold">Selecciona el tipo de problema:</label>
        <select
          value={problemType}
          onChange={(e) => setProblemType(e.target.value)}
          className="p-2 border rounded-lg w-full"
        >
          <option value="knapsack">Mochila</option>
          <option value="brigades">Brigadas</option>
          <option value="routes">Diligencia de Rutas</option>
        </select>
      </div>

      {problemType === 'knapsack' || problemType === 'brigades' ? (
        <div>
          <div className="mb-4">
            <label className="block text-lg font-semibold">Capacidad:</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="p-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-green-600">Datos de Pesos y Valores</h2>
            <table className="table-auto w-full border-collapse border mt-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Ítem</th>
                  <th className="border px-4 py-2">Peso</th>
                  <th className="border px-4 py-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: numItems }).map((_, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">Ítem {index + 1}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={weights[index] || ''}
                        onChange={(e) => handleInputChange(e, 'weight', index)}
                        className="p-2 border rounded-lg"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="number"
                        value={values[index] || ''}
                        onChange={(e) => handleInputChange(e, 'value', index)}
                        className="p-2 border rounded-lg"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : problemType === 'routes' ? (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-red-600">Distancias entre Ciudades</h2>
            <table className="table-auto w-full border-collapse border mt-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Desde/Ciudad</th>
                  {[...Array(numItems)].map((_, index) => (
                    <th key={index} className="border px-4 py-2">Ciudad {index + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(numItems)].map((_, fromIndex) => (
                  <tr key={fromIndex}>
                    <td className="border px-4 py-2">Ciudad {fromIndex + 1}</td>
                    {[...Array(numItems)].map((_, toIndex) => (
                      <td key={toIndex} className="border px-4 py-2">
                        <input
                          type="number"
                          value={distances[fromIndex][toIndex] || ''}
                          onChange={(e) => handleDistanceChange(e, fromIndex, toIndex)}
                          className="p-2 border rounded-lg"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex justify-center">
        <button
          onClick={calculateDP}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-4"
        >
          Calcular
        </button>
        <button
          onClick={resetForm}
          className="bg-gray-400 text-white px-6 py-2 rounded-lg"
        >
          Restablecer
        </button>
      </div>

      {dpResult !== null && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold">Resultado</h2>
          <p className="text-lg">Valor máximo: {dpResult}</p>
          <h3 className="mt-4 text-lg font-semibold">Elementos seleccionados:</h3>
          <ul>
            {selectedItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
