import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useTablaDecision } from '../hooks/useTablaDecision'; 

export const TablaDecision = () => {
    const { handleSubmit, register, reset } = useForm();
    const { tabla, agregarAlternativa, calcularCriterio, resultado } = useTablaDecision();

    const [numAlternativas, setNumAlternativas] = useState(0);
    const [numEscenarios, setNumEscenarios] = useState(0);
    const [criterio, setCriterio] = useState('optimista'); // Criterio por defecto

    const onSubmit = handleSubmit((values) => {
        const alternativas = [];
        for (let i = 0; i < numAlternativas; i++) {
            const alternativa = {
                nombre: values[`alternativa${i + 1}`],
                valores: []
            };
            for (let j = 0; j < numEscenarios; j++) {
                alternativa.valores.push(parseFloat(values[`valor${i + 1}_${j + 1}`]));
            }
            alternativas.push(alternativa);
        }
        agregarAlternativa(alternativas);
        calcularCriterio(criterio); // Calcular en base al criterio seleccionado
    });

    const handleReset = () => {
        setNumAlternativas(0);
        setNumEscenarios(0);
        reset();
    };

    const handleCriterioChange = (e) => {
        setCriterio(e.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50">
            <Link to={'/'}>
                <h1 className="text-3xl font-bold mb-8 mt-6 text-gray-700">Método de Tablas de Decisión</h1>
            </Link>

            <div className="grid grid-cols-1 gap-6 w-full max-w-6xl mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 text-gray-600">Planteamiento</h2>

                    <div className="mb-4 flex items-center">
                        <label className="block mr-4 text-gray-500 dark:text-gray-400">
                            Número de Alternativas:
                        </label>
                        <input
                            type="number"
                            className="w-10 text-center rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            value={numAlternativas}
                            onChange={(e) => setNumAlternativas(parseInt(e.target.value))}
                            min={0}
                            max={10}
                        />
                    </div>

                    <div className="mb-4 flex items-center">
                        <label className="block mr-4 text-gray-500 dark:text-gray-400">
                            Número de Escenarios:
                        </label>
                        <input
                            type="number"
                            className="w-10 text-center rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            value={numEscenarios}
                            onChange={(e) => setNumEscenarios(parseInt(e.target.value))}
                            min={0}
                            max={10}
                        />
                    </div>

                    {numAlternativas > 0 && numEscenarios > 0 && (
                        <form onSubmit={onSubmit} className="overflow-auto">
                            <table className="bg-white">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr className="divide-x divide-gray-200 text-center">
                                        <th className="tracking-wide p-2">Alternativa</th>
                                        {Array.from({ length: numEscenarios }).map((_, i) => (
                                            <th key={i} className="tracking-wide p-2">Escenario {i + 1}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {Array.from({ length: numAlternativas }).map((_, i) => (
                                        <tr key={i} className="divide-x divide-gray-200 hover:bg-gray-100">
                                            <td className="whitespace-nowrap p-2 text-center">
                                                <input
                                                    type="text"
                                                    className="px-2 text-center"
                                                    {...register(`alternativa${i + 1}`, { required: true })}
                                                    placeholder={`Alternativa ${i + 1}`}
                                                />
                                            </td>
                                            {Array.from({ length: numEscenarios }).map((_, j) => (
                                                <td key={j} className="whitespace-nowrap p-2 text-center">
                                                    <input
                                                        type="number"
                                                        className="px-2 text-center"
                                                        {...register(`valor${i + 1}_${j + 1}`, { required: true })}
                                                        placeholder="Valor"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-4">
                                <label className="block mb-2 text-gray-600">Selecciona el criterio de decisión:</label>
                                <select
                                    value={criterio}
                                    onChange={handleCriterioChange}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                >
                                    <option value="optimista">Optimista</option>
                                    <option value="pesimista">Pesimista</option>
                                    <option value="laplace">Laplace</option>
                                    <option value="hurwicz">Hurwicz</option>
                                    <option value="savage">Savage</option>
                                </select>
                            </div>

                            <button className="bg-gray-900 my-5 px-4 rounded font-bold text-white py-2" type="submit">
                                CALCULAR
                            </button>
                            <button
                                className="ml-2 border rounded-md px-4 bg-gray-900 text-gray-50 hover:bg-gray-100 hover:text-black transition-colors"
                                onClick={handleReset}
                            >
                                Reiniciar
                            </button>
                        </form>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-600">Resultado</h2>
                        {resultado && (
                            <div className="mt-4">
                                <p className="text-lg text-gray-700">Criterio: {resultado.criterio}</p>
                                <p className="text-lg text-gray-700">Mejor Alternativa: {resultado.alternativa}</p>
                                <p className="text-lg text-gray-700">Valor: {resultado.valor.toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

