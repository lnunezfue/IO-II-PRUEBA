import { useState } from "react";

/**
 * Hook para calcular métricas de teoría de colas
 * @param {object} params Parámetros para los modelos de cola
 * @param {string} variation Modelo de cola seleccionado
 * @returns {object} Resultados de las métricas calculadas
 */
const useQueue = (params, variation) => {
  const [result, setResult] = useState([]);

  const calculateMetrics = (values, variation) => {
    const { lambda, mu, servers, arrivalDistribution, serviceDistribution } = values;

    if (!lambda || !mu || !servers || lambda <= 0 || mu <= 0 || servers <= 0) {
      console.error("Valores inválidos. Asegúrate de que λ, μ y c sean mayores a 0.");
      return [];
    }

    const rho = lambda / (servers * mu); // Utilización del sistema
    if (rho >= 1 && variation !== "mm_infinity") {
      console.error("El sistema es inestable (ρ >= 1).");
      return [];
    }

    let Lq, L, Wq, W, P0;

    switch (variation) {
      case "mm1":
        // Modelo M/M/1
        Lq = (rho ** 2) / (1 - rho);
        L = Lq + rho;
        Wq = Lq / lambda;
        W = Wq + 1 / mu;
        break;

      case "mmc":
        // Modelo M/M/c
        const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
        P0 =
          1 / 
          (Array.from({ length: servers }, (_, k) => (lambda / mu) ** k / factorial(k)).reduce(
            (sum, val) => sum + val,
            0
          ) + 
          ((lambda / mu) ** servers / (factorial(servers) * (1 - rho))));

        Lq = (P0 * ((lambda / mu) ** servers) * rho) / (factorial(servers) * (1 - rho) ** 2);
        L = Lq + lambda / mu;
        Wq = Lq / lambda;
        W = Wq + 1 / mu;
        break;

      case "mm_infinity":
        // Modelo M/M/∞
        Lq = 0;
        L = lambda / mu;
        Wq = 0;
        W = 1 / mu;
        break;

      case "md1":
        // Modelo M/D/1 (Distribución de servicio determinística)
        const Lmd1 = lambda ** 2 / (2 * (1 - rho)); // Lq para M/D/1
        const Wmd1 = Lmd1 / lambda; // Wq para M/D/1
        L = Lmd1 + lambda / mu;
        Wq = Wmd1;
        W = Wq + 1 / mu;
        break;

      case "mg1":
        // Modelo M/G/1 (Distribución general para el servicio)
        const mg1_Lq = (lambda ** 2) / (2 * (1 - rho)); // Lq para M/G/1 (simplificado)
        const mg1_Wq = mg1_Lq / lambda; // Wq para M/G/1
        L = mg1_Lq + lambda / mu;
        Wq = mg1_Wq;
        W = Wq + 1 / mu;
        break;

      case "mgc0":
        // Modelo M/G/c/0 (c servidores y cola sin límite)
        const mgc0_Lq = (lambda ** 2) / (2 * (1 - rho)); // Lq para M/G/c/0
        const mgc0_Wq = mgc0_Lq / lambda; // Wq para M/G/c/0
        L = mgc0_Lq + lambda / mu;
        Wq = mgc0_Wq;
        W = Wq + 1 / mu;
        break;

      default:
        console.error("Modelo no soportado.");
        return [];
    }

    return [
      { label: "Utilización del sistema (ρ)", value: rho },
      { label: "Número esperado en cola (Lq)", value: Lq },
      { label: "Número esperado en el sistema (L)", value: L },
      { label: "Tiempo promedio en cola (Wq)", value: Wq },
      { label: "Tiempo promedio en el sistema (W)", value: W },
    ];
  };

  const compute = (values, variation) => {
    const metrics = calculateMetrics(values, variation);
    setResult(metrics);
  };

  return { result, compute };
};

export default useQueue;
