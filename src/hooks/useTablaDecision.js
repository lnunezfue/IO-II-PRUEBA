import { useState } from 'react';

export const useTablaDecision = () => {
    const [tabla, setTabla] = useState([]);
    const [resultado, setResultado] = useState(null);

    const agregarAlternativa = (alternativas) => {
        setTabla(alternativas);
    };

    const calcularCriterio = (criterio) => {
        if (tabla.length === 0) return;

        let mejorAlternativa = '';
        let mejorValor = -Infinity; // Iniciamos mejorValor en -Infinity para asegurar la comparación correcta

        switch (criterio) {
            case 'optimista':
                tabla.forEach((alt) => {
                    const maxVal = Math.max(...alt.valores);
                    if (maxVal > mejorValor) {
                        mejorValor = maxVal;
                        mejorAlternativa = alt.nombre;
                    }
                });
                setResultado({ criterio: 'Optimista', valor: mejorValor, alternativa: mejorAlternativa });
                break;

            case 'pesimista':
                // Para cada alternativa, obtenemos el mínimo y luego comparamos para obtener el mayor entre los mínimos
                tabla.forEach((alt) => {
                    const minVal = Math.min(...alt.valores); // Obtenemos el valor mínimo de cada alternativa
                    if (minVal > mejorValor) { // Comparamos para obtener el mayor de los mínimos
                        mejorValor = minVal;
                        mejorAlternativa = alt.nombre;
                    }
                });
                setResultado({ criterio: 'Pesimista', valor: mejorValor, alternativa: mejorAlternativa });
                break;

            case 'laplace':
                tabla.forEach((alt) => {
                    const promedio = alt.valores.reduce((acc, val) => acc + val, 0) / alt.valores.length;
                    if (promedio > mejorValor) {
                        mejorValor = promedio;
                        mejorAlternativa = alt.nombre;
                    }
                });
                setResultado({ criterio: 'Laplace', valor: mejorValor, alternativa: mejorAlternativa });
                break;

            case 'hurwicz':
                const alpha = 0.5; // Puedes cambiar el valor de alpha aquí o parametrizarlo si es necesario
                tabla.forEach((alt) => {
                    const hurwiczVal = alpha * Math.max(...alt.valores) + (1 - alpha) * Math.min(...alt.valores);
                    if (hurwiczVal > mejorValor) {
                        mejorValor = hurwiczVal;
                        mejorAlternativa = alt.nombre;
                    }
                });
                setResultado({ criterio: 'Hurwicz', valor: mejorValor, alternativa: mejorAlternativa });
                break;

            case 'savage':
                const maximosPorEscenario = Array(tabla[0].valores.length).fill(0);

                // Encontrar los máximos por escenario
                tabla.forEach((alt) => {
                    alt.valores.forEach((valor, index) => {
                        maximosPorEscenario[index] = Math.max(maximosPorEscenario[index], valor);
                    });
                });

                // Calcular arrepentimiento
                mejorValor = Infinity; // Inicializamos con Infinity ya que queremos minimizar el arrepentimiento
                tabla.forEach((alt) => {
                    const arrepentimientos = alt.valores.map((valor, index) => maximosPorEscenario[index] - valor);
                    const maxArrepentimiento = Math.max(...arrepentimientos);
                    if (maxArrepentimiento < mejorValor) {
                        mejorValor = maxArrepentimiento;
                        mejorAlternativa = alt.nombre;
                    }
                });
                setResultado({ criterio: 'Savage', valor: mejorValor, alternativa: mejorAlternativa });
                break;

            default:
                break;
        }
    };

    return { tabla, agregarAlternativa, calcularCriterio, resultado };
};

