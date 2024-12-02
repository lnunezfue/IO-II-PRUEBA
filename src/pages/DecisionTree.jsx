import React, { useState } from 'react';
import { Graphviz } from 'graphviz-react';

export const DecisionTree = () => {
    const [decisions, setDecisions] = useState([
        { id: 1, name: 'Inicio', alternatives: [] }
    ]);
    const [bestDecision, setBestDecision] = useState(null);
    const [summary, setSummary] = useState([]);

    // Añadir una nueva decisión conectada a "Inicio"
    const addDecision = () => {
        setDecisions([
            ...decisions,
            { id: decisions.length + 1, name: `Decisión ${decisions.length}`, alternatives: [] }
        ]);
    };

    // Añadir una nueva alternativa a la decisión seleccionada
    const addAlternative = (decisionId, alternative) => {
        if (!alternative.name || isNaN(alternative.probability) || isNaN(alternative.benefit)) {
            alert('Por favor, introduce valores válidos para la alternativa.');
            return;
        }

        setDecisions(
            decisions.map(decision => {
                if (decision.id === decisionId && decision.name !== 'Inicio') {
                    return { ...decision, alternatives: [...decision.alternatives, alternative] };
                }
                return decision;
            })
        );
    };
    // Añadir sub-alternativa a una alternativa existente
    const addSubAlternative = (decisionId, altName, subAlternative) => {
        setDecisions(
            decisions.map(decision => {
                if (decision.id === decisionId) {
                    return {
                        ...decision,
                        alternatives: decision.alternatives.map(alt => {
                            if (alt.name === altName) {
                                return {
                                    ...alt,
                                    subAlternatives: [...(alt.subAlternatives || []), subAlternative]
                                };
                            }
                            return alt;
                        })
                    };
                }
                return decision;
            })
        );
    };

    // Calcular la mejor alternativa y su valor esperado por nivel
    const calculateBestAlternative = () => {
        let summaryData = [];
        let bestDecision = null;
        let maxTotalValue = -Infinity;

        decisions.slice(1).forEach(decision => {
            let totalExpectedValue = 0;
            let decisionSummary = {
                decisionName: decision.name,
                alternatives: []
            };

            decision.alternatives.forEach(alt => {
                let altExpectedValue = alt.probability * alt.benefit;
                
                if (alt.subAlternatives) {
                    alt.subAlternatives.forEach(subAlt => {
                        altExpectedValue += subAlt.probability * subAlt.benefit;
                    });
                }

                totalExpectedValue += altExpectedValue;
                decisionSummary.alternatives.push({
                    name: alt.name,
                    probability: alt.probability,
                    benefit: alt.benefit,
                    expectedValue: altExpectedValue
                });
            });

            decisionSummary.totalExpectedValue = totalExpectedValue;

            if (totalExpectedValue > maxTotalValue) {
                maxTotalValue = totalExpectedValue;
                bestDecision = decision.name;
            }

            summaryData.push(decisionSummary);
        });

        setSummary(summaryData);
        setBestDecision(bestDecision);
    };

    // Crear el gráfico con Graphviz
    const createGraph = () => {
        let graph = 'digraph G { rankdir=LR; node [shape=box]; ';

        decisions.slice(1).forEach(decision => {
            graph += `"Inicio" -> "${decision.name}" [label=""]`;

            decision.alternatives.forEach(alt => {
                graph += `"${decision.name}" -> "${alt.name} (P: ${alt.probability}, B: ${alt.benefit}, VE: ${alt.expectedValue?.toFixed(2)})" [label="${alt.name}"]`;

                if (alt.subAlternatives) {
                    alt.subAlternatives.forEach(subAlt => {
                        graph += `"${alt.name} (P: ${alt.probability}, B: ${alt.benefit}, VE: ${alt.expectedValue?.toFixed(2)})" -> "${subAlt.name} (P: ${subAlt.probability}, B: ${subAlt.benefit}, VE: ${(subAlt.probability * subAlt.benefit)?.toFixed(2)})" [label="${subAlt.name}"];`;
                    });
                }
            });
        });

        graph += '}';
        return graph;
    };
    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-700">Árbol de Decisión</h1>

            <div className="grid grid-cols-1 gap-6 w-full max-w-6xl mb-6">
                <button onClick={addDecision} className="bg-black text-white px-4 py-2 rounded-md">
                    Agregar Decisión
                </button>

                {decisions.slice(1).map(decision => (
                    <div key={decision.id} className="p-4 bg-gray-100 rounded-md shadow-md mb-4">
                        <h2>{decision.name}</h2>

                        <div className="flex">
                            <input
                                type="text"
                                placeholder="Alternativa"
                                className="mr-2 p-2 border rounded-md"
                                id={`alt-name-${decision.id}`}
                            />
                            <input
                                type="number"
                                placeholder="Probabilidad"
                                className="mr-2 p-2 border rounded-md"
                                id={`alt-prob-${decision.id}`}
                            />
                            <input
                                type="number"
                                placeholder="Beneficio"
                                className="mr-2 p-2 border rounded-md"
                                id={`alt-benefit-${decision.id}`}
                            />
                            <button
                                onClick={() =>
                                    addAlternative(decision.id, {
                                        name: document.getElementById(`alt-name-${decision.id}`).value,
                                        probability: parseFloat(document.getElementById(`alt-prob-${decision.id}`).value),
                                        benefit: parseFloat(document.getElementById(`alt-benefit-${decision.id}`).value),
                                        subAlternatives: []
                                    })
                                }
                                className="bg-black text-white px-4 py-2 rounded-md"
                            >
                                Agregar Alternativa
                            </button>
                        </div>

                        {/* Sub-alternativas */}
                        {decision.alternatives.map(alt => (
                            <div key={alt.name}>
                                <h3>{alt.name} - Sub-alternativas</h3>
                                <input
                                    type="text"
                                    placeholder="Sub-Alternativa"
                                    className="mr-2 p-2 border rounded-md"
                                    id={`sub-alt-name-${alt.name}`}
                                />
                                <input
                                    type="number"
                                    placeholder="Probabilidad"
                                    className="mr-2 p-2 border rounded-md"
                                    id={`sub-alt-prob-${alt.name}`}
                                />
                                <input
                                    type="number"
                                    placeholder="Beneficio"
                                    className="mr-2 p-2 border rounded-md"
                                    id={`sub-alt-benefit-${alt.name}`}
                                />
                                <button
                                    onClick={() =>
                                        addSubAlternative(decision.id, alt.name, {
                                            name: document.getElementById(`sub-alt-name-${alt.name}`).value,
                                            probability: parseFloat(document.getElementById(`sub-alt-prob-${alt.name}`).value),
                                            benefit: parseFloat(document.getElementById(`sub-alt-benefit-${alt.name}`).value)
                                        })
                                    }
                                    className="bg-black text-white px-4 py-2 rounded-md"
                                >
                                    Agregar Sub-Alternativa
                                </button>
                            </div>
                        ))}
                    </div>
                ))}

                <div className="flex">
                    <button onClick={calculateBestAlternative} className="bg-gray-800 text-white px-4 py-2 rounded-md mr-4">
                        Calcular Mejor Alternativa
                    </button>
                    <button onClick={() => setBestAlternative(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                        Reiniciar
                    </button>
                </div>
            </div>

            <div className="w-full h-96 bg-white border border-gray-300 rounded-md flex justify-center items-center">
                <div className="w-full max-w-4xl">
                    <Graphviz dot={createGraph()} options={{ height: 400, width: 800 }} />
                </div>
            </div>

            {/* Resumen de Valores Esperados */}
            {summary.length > 0 && (
                <div className="mt-6 p-4 bg-white rounded-md shadow-md">
                    <h2 className="text-lg font-bold mb-4">Resumen de Valores Esperados</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-black">
                                <th className="border p-2">Decisión</th>
                                <th className="border p-2">Alternativa</th>
                                <th className="border p-2">Probabilidad</th>
                                <th className="border p-2">Beneficio</th>
                                <th className="border p-2">Valor Esperado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.map((decisionSummary, decisionIndex) => (
                                decisionSummary.alternatives.map((alt, altIndex) => (
                                    <tr key={`${decisionIndex}-${altIndex}`} className={alt.name === decisionSummary.bestAlternative ? 'bg-gray-300' : ''}>
                                        {altIndex === 0 && (
                                            <td className="border p-2" rowSpan={decisionSummary.alternatives.length}>
                                                {decisionSummary.decisionName}
                                            </td>
                                        )}
                                        <td className="border p-2">{alt.name}</td>
                                        <td className="border p-2">{alt.probability}</td>
                                        <td className="border p-2">{alt.benefit}</td>
                                        <td className="border p-2">{alt.expectedValue?.toFixed(2)}</td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="border p-2 font-bold" colSpan="4">Mejor Decisión</td>
                                <td className="border p-2 font-bold">{bestDecision}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    );
};
