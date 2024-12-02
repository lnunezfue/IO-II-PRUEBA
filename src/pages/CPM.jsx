import { useState } from "react"
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom"
import useCriticalRoute from "../hooks/useCriticalRoute"
import { Graphviz } from 'graphviz-react'

export const CPM = () => {
    const { handleSubmit, register, watch, reset } = useForm();
    const { getActividad, activity_format, cal_critical_route, generate_diagram } = useCriticalRoute()
    const [setting, setSetting] = useState({
        num_actividades: 0,
        tipo: '1'
    });
    const [result, setResult] = useState([])
    const [resultDot, setResultDot] = useState('')

    const onSubmit = handleSubmit(values => {
        const data = activity_format(values,setting?.tipo)
        const results = cal_critical_route(data,setting?.tipo)
        const dot = generate_diagram(results)
        setResult(results)
        setResultDot(dot)
    })

    const handleReset = () => {
        setSetting({
            num_actividades: 0,
            tipo: '1'
        });
        setResult([]);
        setResultDot('');
        reset();
    }
    const increment = () => {
        const numvar = setting?.num_actividades;
        if (numvar < 20) {
            setSetting({ ...setting, num_actividades: numvar + 1 });
        }
    }
    const decrement = () => {
        const numvar = setting?.num_actividades;
        if (numvar > 0) {
            setSetting({ ...setting, num_actividades: numvar - 1 });

        }
    }
    const handleSettings = (e) => {
        setSetting({ num_actividades: e })
    }
    return (
        <div className="flex flex-col items-center justify-center  bg-gray-50">
            <Link to={'/'}>
                <h1 className="text-3xl font-bold mb-8 mt-6 text-gray-700">Método de la Ruta Crítica (CPM)</h1>
            </Link>
            <div className="grid grid-cols-1 gap-6 w-full max-w-6xl mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 text-gray-600">Planteamiento</h2>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="num-variables" className="block mr-4 text-gray-500 dark:text-gray-400">
                            Número de Actividades :
                        </label>
                        <div className="flex items-center">
                            <button
                                className="mx-2 border rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={decrement}
                            >
                                <MinusIcon className="w-4 h-4" />
                            </button>
                            <input
                                id="num-variables"
                                type="number"
                                className="w-10 text-center rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                value={setting?.num_actividades}
                                readOnly
                            />
                            <button
                                className="mx-2 border  rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={increment}
                            ><PlusIcon className="w-4 h-4" />
                            </button>
                            <input
                                id="num-variables"
                                type="number"
                                className="w-10 text-center rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                onChange={(e) => handleSettings(e.target.value)}
                            />
                            <button
                                className="ml-2 border rounded-md px-2 bg-gray-900 text-gray-50 hover:bg-gray-100 hover:text-black transition-colors"
                                onClick={handleReset}
                            >
                                Nuevo Problema
                            </button>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center">
                        <form onSubmit={onSubmit} className="overflow-auto">
                            {setting?.num_actividades > 0 && (
                                <>
                                    <table className="bg-white">
                                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                                            <tr className="divide-x divide-gray-200 text-center">
                                                <th className="tracking-wide p-2">Actividad</th>
                                                <th className="tracking-wide p-2">Predecesor</th>
                                                {setting?.tipo === '1' && <th className="tracking-wide p-2">Duracion</th>}
                                                {setting?.tipo === '2' && (
                                                    <>
                                                        <th>Tiempo optimista</th>
                                                        <th>Tiempo medio</th>
                                                        <th>Tiempo pesimista</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {Array.from({ length: setting?.num_actividades }).map((_, index) => (
                                                <tr
                                                    key={index}
                                                    className="divide-x divide-gray-200 hover:bg-gray-100"
                                                >
                                                    <td className="whitespace-nowrap p-2 text-center">
                                                        <input
                                                            type="text"
                                                            className="px-2 text-center"
                                                            readOnly
                                                            value={`${getActividad(index + 1)}`}
                                                            {...register(`actividad${index + 1}`)}
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap p-2 text-center">
                                                        <input
                                                            type="text"
                                                            className="px-2 text-center"
                                                            pattern="^([A-Za-z](,\s?[A-Za-z])*)?$"
                                                            {...register(`predecesor${index + 1}`, {
                                                                pattern: /^([A-Za-z](,\s?[A-Za-z])*)?$/
                                                            })} />
                                                    </td>
                                                    {setting?.tipo === '2' && (
                                                        <>
                                                            <td>
                                                                <input type="text" {...register(`tiempoOptimista${index + 1}`)} />
                                                            </td>
                                                            <td>
                                                                <input type="text" {...register(`tiempoMedio${index + 1}`)} />
                                                            </td>
                                                            <td>
                                                                <input type="text" {...register(`tiempoPesimista${index + 1}`)} />
                                                            </td>
                                                        </>
                                                    )}
                                                    {setting?.tipo === '1' && (
                                                        <td className="whitespace-nowrap p-2 text-center">
                                                            <input
                                                                type="text"
                                                                className="px-2 text-center"
                                                                {...register(`duracion${index + 1}`, { required: true })}
                                                            />
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {/* <p className="text-red-800 font-semibold}">Escribe bien tus predecesores</p> */}
                                    <button className='bg-gray-900 my-5 px-2.5 rounded font-bold text-white py-2'>CALCULAR</button>
                                </>
                            )}
                        </form>

                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-600">Resultado</h2>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <div>
                                    {
                                        result.length !== 0 && (
                                            <>
                                                <hr />
                                                <h3 className="text-lg font-semibold mb-2 pt-2 text-gray-600 dark:text-gray-300">Tabla Resultado</h3>
                                                <div className="overflow-auto w-full">
                                                    <table className="bg-white">
                                                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                                                            <tr className="divide-x divide-gray-200 text-center">
                                                                <th className="tracking-wide p-2">Actividad</th>
                                                                <th className="tracking-wide p-2">Duracion</th>
                                                                <th className="tracking-wide p-2">Early Start</th>
                                                                <th className="tracking-wide p-2">Early Finish</th>
                                                                <th className="tracking-wide p-2">Late Start</th>
                                                                <th className="tracking-wide p-2">Late Finish</th>
                                                                <th className="tracking-wide p-2">Stack</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200">
                                                            {result.map((task, i) => (
                                                                <tr
                                                                    key={i}
                                                                    className="divide-x divide-gray-200 hover:bg-gray-100"
                                                                >
                                                                    <td className={`whitespace-nowrap p-2 text-center ${task.isCriticalPath ? 'text-red-500' : ''}`}>
                                                                        {task.name}
                                                                    </td>
                                                                    <td className="whitespace-nowrap p-2 text-center">
                                                                        {task.duration}
                                                                    </td>
                                                                    <td className="whitespace-nowrap p-2 text-center">
                                                                        {task.earlyStart}
                                                                    </td>
                                                                    <td className="whitespace-nowrap p-2 text-center">
                                                                        {task.earlyFinish}
                                                                    </td>
                                                                    <td className="whitespace-nowrap p-2 text-center">
                                                                        {task.lateStart}
                                                                    </td>
                                                                    <td className="whitespace-nowrap p-2 text-center">
                                                                        {task.lateFinish}
                                                                    </td>
                                                                    <td className="whitespace-nowrap p-2 text-center">
                                                                        {task.stack}
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                        </tbody>
                                                    </table>
                                                </div>
                                            </>
                                        )
                                    }
                                </div>

                            </div>
                            <div className="pt-4">
                                <div>
                                    {
                                        result.length !== 0 && (
                                            <>
                                                <hr />
                                                <h3 className="text-lg font-semibold mb-2 pt-6 text-gray-600 dark:text-gray-300">Red de Actividades</h3>
                                                <Graphviz
                                                    dot={resultDot}
                                                    options={{ zoom: true ,fit:true,width:800}}
                                                />
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



function MinusIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
        </svg>
    )
}


function PlusIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
