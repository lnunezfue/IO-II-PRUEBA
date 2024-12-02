import { useEffect, useState } from "react";
import parse from 'html-react-parser'
import { jsx_funcionObjetivo, jsx_matriz, jsx_problema, jsx_restriccion } from "../helpers/simplex/";
import { Link } from "react-router-dom";
export const Simplex = () => {
    var jsx_pr = new jsx_problema();
    const [obj, setObj] = useState("max");
    const [numvar, setNumvar] = useState(2);
    const [variables, setVariables] = useState([{ sign: '+', value: '' }, { sign: '+', value: '' }]);
    const [restricciones, setRestricciones] = useState([{ sign: '+', value: '' }, { sign: '+', value: '' }]);
    const [desigualdad, setDesigualdad] = useState('<=');
    const [limite, setLimite] = useState('');
    const [hiddenMethod, setHiddenMethod] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState('dosfases');
    const [jsx_arrayRestricciones, setJsx_arrayRestricciones] = useState([])
    const [jsx_arrayRestriccionesActivas, setJsx_arrayRestriccionesActivas] = useState([])
    const [addElementProblema, setAddElementProblema] = useState([])
    const [jsx_pro_p1, setJsx_pro_p1] = useState('');
    const [jsx_pro_p2, setJsx_pro_p2] = useState('');
    const [resultados, setResultados] = useState([]);

    const limpiarDatos = () => {
        setObj('max');
        setNumvar(2);
        setVariables([{ sign: '+', value: '' }, { sign: '+', value: '' }]);
        setRestricciones([{ sign: '+', value: '' }, { sign: '+', value: '' }])
        setDesigualdad('<=');
        setLimite('');
        setHiddenMethod(true)
        setSelectedMethod('dosfases');
        setJsx_arrayRestricciones([])
        setJsx_arrayRestriccionesActivas([])
        setAddElementProblema([])
        setJsx_pro_p1('');
        setJsx_pro_p2('');
        setResultados([]);
        jsx_pr= new jsx_problema();
    }
    const generarNoNegatividad = () => {
        const variable = []
        for (let i = 1; i <= numvar; i++) {
            variable.push(<span key={i}>X<sub>{i}</sub>{i < numvar ? ', ' : ''}</span>);
        }
        return <>{variable} &ge; 0</>;
    }
    const increment = () => {
        if (numvar < 8) {
            setNumvar(numvar + 1);
            setVariables([...variables, { sign: '+', value: '' }]);
            setRestricciones([...restricciones, { sign: '+', value: '' }]);
        }
    }
    const decrement = () => {
        if (numvar > 2) {
            setNumvar(numvar > 2 ? numvar - 1 : 2);
            setVariables(variables.slice(0, -1));
            setRestricciones(restricciones.slice(0, -1));

        }
    }
    const addElement = (numItems) => {
        const newList = (
            <li key={addElementProblema.length}>
                {numItems.map((item, index) => {
                    return (
                        <p key={index} className="inline-block px-0.5">
                            {((index + 1) % 3 === 0)
                                ? <span>X<sub>{item}</sub></span>
                                : <span>{item}</span>
                            }
                        </p>
                    );
                })}
            </li>
        );

        setAddElementProblema([...addElementProblema, newList]);
    };
    const handleVariableChange = (index, field, value) => {
        const newVariables = [...variables];
        newVariables[index][field] = value;
        setVariables(newVariables);
        jxs_actualizar()
    }
    const handleRestriccionChange = (index, field, value) => {
        const newRestricciones = [...restricciones];
        newRestricciones[index][field] = value;
        setRestricciones(newRestricciones);
    }
    const handleLimiteChange = (value) => {
        setLimite(value)
    }
    const handleChangeMethod = (event) => {
        setSelectedMethod(event.target.id);
        jsx_actualizarProblema();
    }
    const handleAddRestriccion = () => {
        let cadena = "";
        let cadenaaux = [];
        let equis = [];
        let distintocero = false;
        restricciones.forEach((restriccion, index) => {
            const signo = restriccion.sign === '+' ? '+' : '-';
            const valor = isNaN(parseFloat(restriccion.value)) ? 0 : restriccion.value;
            equis.push(parseFloat(signo + valor));
            if (parseFloat(valor) !== 0) {
                distintocero = true;
                cadena += `${signo}${valor}X<sub>${index + 1}</sub>`;
                cadenaaux.push(signo)
                cadenaaux.push(valor)
                cadenaaux.push(index + 1)
            }
        });

        if (!distintocero) return;
        let sign = desigualdad === '<=' ? "&le;" : desigualdad === '=' ? "=" : "&ge;";
        let limiteParsed = isNaN(parseFloat(limite)) ? 0 : limite;
        cadena += `${sign}${limiteParsed}`;
        cadenaaux.push(desigualdad)
        cadenaaux.push(limiteParsed)

        addElement(cadenaaux);
        const nuevaRestriccion = {
            cadena,
            equis,
            desigualdad,
            limite: limiteParsed
        };
        const re01 = new jsx_restriccion(equis, desigualdad, limiteParsed);
        setJsx_arrayRestricciones(prevArray => [...prevArray, re01]);
        setJsx_arrayRestriccionesActivas(prevArray => [...prevArray, true]);

        jxs_actualizar();
        setDesigualdad('<=');//Limpia datos
        setLimite('');//Limpia datos
    }
    const jxs_actualizar = () => {
        const foDatos = variables.map(item => item.value === "" ? 0 : `${item.sign}${item.value}`);
        const fo01 = new jsx_funcionObjetivo(obj, foDatos)
        jsx_pr = new jsx_problema();
        jsx_pr.setFuncionObjetivo(fo01)
        for (let i = 0; i < jsx_arrayRestricciones.length; i++) {
            if (jsx_arrayRestriccionesActivas[i] === true) {
                jsx_pr.addRestriccion(jsx_arrayRestricciones[i])
            }
        }
        jsx_actualizarProblema()
    }

    const jsx_actualizarProblema = () => {
        const antiguo = jsx_pr.clone();
        antiguo.procesar();
        const tam = antiguo.toString()
        if (tam.trim().length > 3) {
            setJsx_pro_p1(parse(antiguo.toHTML()))
        }
        var problemArt;
        if (selectedMethod === 'dosfases') {
            problemArt = antiguo.clone().dosfases();
        } else {
            problemArt = antiguo.clone().mgrande();
        }
        if (!problemArt) {
            problemArt = antiguo.clone()
            setHiddenMethod(true);
        } else {
            setHiddenMethod(false);
        }
        if (problemArt.toString().trim().length > 3) {
            setJsx_pro_p2(parse(problemArt.toHTML()))
        }


    }
    const jsx_resolver_matriz = (ma, it, es, fa) => {
        var ma01 = ma;
        let iteracion = it;
        let tieneartificiales = es;
        var tituloCadOld = 'Matriz inicial';
        if (fa == 1) {
            tituloCadOld = 'Matriz primera fase';
        } else if (fa == 2) {
            tituloCadOld = 'Matriz segunda fase';
        }
        var finmsg = '';
        do {
            if (ma01.quienEntra() != null && ma01.quienSale() != null) {
                var entra = ma01.quienEntraX();
                var sale = ma01.quienSaleX();
                var tituloCad = 'Iteración ' + ((iteracion++) + 1) + ': entra ' + entra + ' y sale ' + sale;
            } else {
                var tituloCad = '';
                if (!tieneartificiales) {
                    tituloCad = 'Iteración ' + (iteracion++) + ': no hay mas iteraciones';
                    if (ma01.quienEntra() != null && ma01.esMultiple() == false) {
                        finmsg = '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;La soluci&oacute;n es ilimitada, la variable ' + ma01.quienEntraX() + ' debe entrar a la base pero ninguna puede salir.';
                    }
                    if (ma01.esMultiple() == true) {
                        finmsg = '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;La soluci&oacute;n es m&uacute;ltiple, nos encontramos en un punto &oacute;ptimo y hay variables no b&aacute;sicas con coste reducido igual a 0.';
                    }
                } else {
                    if (selectedMethod === 'dosfases') {
                        tituloCad = 'Iteraci&oacute;n ' + (iteracion++) + ': fin de la primera fase';
                        var comotermino = ma01.finPrimeraFase();
                        if (comotermino == 0) {
                            finmsg = '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Se han expulsado todas las variables artificiales de la base.'
                        } else if (comotermino == 1) {
                            finmsg = '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Las variables artificiales que no se han expulsado de la base valen 0, son linealmente dependientes.';
                        } else if (comotermino == 2) {
                            finmsg = '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Existe una variable artificial en la base extrictamente mayor que 0, el problema es infactible.';
                        }
                    } else {
                        tituloCad = 'Iteraci&oacute;n ' + (iteracion++) + ': no hay m&aacute;s iteraciones';
                        if (ma01.finMgrande() == true) {
                            finmsg = '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Las variables artificiales que no se han expulsado de la base valen 0, son linealmente dependientes.';
                        }
                    }
                }
            }

            var titulo = "<h3><a href='#'>" + tituloCadOld + "</a></h3>";
            tituloCadOld = tituloCad;

            let contenido = "<div>" + ma01.toString() + finmsg + "</div>";
            let res = "<div className=\"pt-2\">" + titulo + contenido + "</div>";
            setResultados((prev) => [...prev, parse(res)])

        } while (ma01.avanzar())
    }
    const handleResolverProblema = () => {
        setResultados([]);
        jxs_actualizar();
        var antiguo = jsx_pr.clone();
        antiguo.procesar();
        var antiguocopia;
        let tieneartificiales = false;
        let fase = 0
        if (selectedMethod === 'dosfases') {
            antiguocopia = antiguo.clone().dosfases();
            fase = 1;
        }
        else {
            antiguocopia = antiguo.clone().mgrande();
        }
        if (antiguocopia != false) {
            tieneartificiales = true;
            antiguo = antiguocopia;
        } else {
            fase = 0;
        }
        var ma01 = new jsx_matriz(antiguo);
        jsx_resolver_matriz(ma01, 0, tieneartificiales, fase);//terminar la function
        if (tieneartificiales) {
            if (selectedMethod === 'dosfases') {
                if (ma01.finPrimeraFase() != 2) {
                    var temp = jsx_pr.clone();
                    temp.procesar();
                    fase = 2;
                    var ma02 = ma01.getSegundaFase(temp.getFuncionObjetivo());
                    jsx_resolver_matriz(ma02, 0, false, fase);
                }
            } else { }
        }
        // cont.accordion({collapsible:false});

    }
    useEffect(() => {
        if (jsx_arrayRestricciones.length > 0) {
            jxs_actualizar();
        }
    }, [jsx_arrayRestricciones, selectedMethod])
    return (
        <div className="flex flex-col items-center justify-center  bg-gray-50">
            <Link to={'/'}>
                <h1 className="text-3xl font-bold mb-8 mt-6 text-gray-700">Método Simplex</h1>
            </Link>
            <div className="grid grid-cols-1 gap-6 w-full max-w-6xl mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 text-gray-600">Función Objetivo</h2>
                    <div className="mb-4 flex items-center justify-between">
                        <input
                            type="button"
                            value="Maximizar"
                            className={`rounded-md border shadow-sm py-1 mr-4 w-full transition-colors cursor-pointer ${obj === 'max'
                                ? 'bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900'
                                : 'hover:bg-gray-900 hover:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-900'
                                }`}
                            onClick={() => setObj('max')}
                        />
                        <input
                            type="button"
                            value="Minimizar"
                            className={`rounded-md border shadow-sm py-1 mr-4 w-full transition-colors cursor-pointer ${obj === 'min'
                                ? 'bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900'
                                : 'hover:bg-gray-900 hover:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-900'
                                }`}
                            onClick={() => setObj('min')}
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="num-variables" className="block mr-4 text-gray-500 dark:text-gray-400">
                            Número de Variables :
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
                                value={numvar}
                                readOnly
                            />
                            <button
                                className="mx-2 border  rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={increment}
                            ><PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="mb-4 flex items-center">
                        <label className="block mr-4 text-gray-500 dark:text-gray-400">
                            Objetivo:
                        </label>
                        <div className="flex items-center">
                            {variables.map((variable, index) => (
                                <div className="flex items-center ml-2" key={index}>
                                    <button
                                        className={`border rounded-l-md p-1 transition-colors ${variable.sign === '+' ? 'bg-gray-900 text-gray-50' : 'hover:bg-gray-100 hover:text-black'}`}
                                        onClick={() => handleVariableChange(index, 'sign', '+')}
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        className={`border rounded-r-md p-1 transition-colors ${variable.sign === '-' ? 'bg-gray-900 text-gray-50' : 'hover:bg-gray-100 hover:text-black'}`}
                                        onClick={() => handleVariableChange(index, 'sign', '-')}
                                    >
                                        <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        value={variable.value}
                                        onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                                        className="w-10 text-center border rounded-md border-gray-300 animate-none"
                                    />X <span className=" text-gray-500 dark:text-gray-400"><sub>{index + 1}</sub></span>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-600">Restricciones</h2>
                        <div className="grid gap-4">
                            <div className="flex items-center">
                                {restricciones.map((restriccion, index) => (
                                    <div className="flex items-center ml-2" key={index}>
                                        <button
                                            className={`border rounded-l-md p-1 transition-colors ${restriccion.sign === '+' ? 'bg-gray-900 text-gray-50' : 'hover:bg-gray-100 hover:text-black'}`}
                                            onClick={() => handleRestriccionChange(index, 'sign', '+')}
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            className={`border rounded-r-md p-1 transition-colors ${restriccion.sign === '-' ? 'bg-gray-900 text-gray-50' : 'hover:bg-gray-100 hover:text-black'}`}
                                            onClick={() => handleRestriccionChange(index, 'sign', '-')}
                                        >
                                            <MinusIcon className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="number"
                                            value={restriccion.value}
                                            onChange={(e) => handleRestriccionChange(index, 'value', e.target.value)}
                                            className="w-10 text-center border rounded-md border-gray-300 animate-none"
                                        />X <span className=" text-gray-500 dark:text-gray-400"><sub>{index + 1}</sub></span>
                                    </div>
                                ))}

                                <div className="flex items-center ml-4">
                                    <select
                                        className="p-0.5 px-1 border rounded-md bg-gray-900 text-white shadow-sm"
                                        value={desigualdad}
                                        onChange={(e) => setDesigualdad(e.target.value)}
                                    >
                                        {/* className="px-4 py-2 cursor-pointer hover:bg-gray-100" */}
                                        <option value="<=">&le;</option>
                                        <option value="=">=</option>
                                        <option value=">=">&ge;</option>
                                    </select>
                                    <input
                                        type="number"
                                        value={limite}
                                        onChange={(e) => handleLimiteChange(e.target.value)}
                                        className="w-10 text-center border rounded-md border-gray-300 animate-none"
                                    />
                                    <button
                                        className="ml-2 border rounded-md px-2 bg-gray-900 text-gray-50 hover:bg-gray-100 hover:text-black transition-colors"
                                        onClick={handleAddRestriccion}
                                    >
                                        Añadir
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <h3>Restricciones actuales</h3>
                            <ul>
                                {addElementProblema}
                            </ul>
                            {
                                generarNoNegatividad()
                            }
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 text-gray-600">Planteamiento del problema</h2>
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center">
                                <h3>Quitando desigualdades</h3>
                            </div>
                            <div>
                                {jsx_pro_p1}
                            </div>
                        </div>
                        <div className={hiddenMethod ? `hidden` : 'visible'}>
                            <div className="mb-4 flex items-center justify-between">
                                <button
                                    id="dosfases"
                                    className={`border w-full rounded-l-md transition-colors ${selectedMethod === 'dosfases'
                                        ? 'bg-gray-900 text-gray-50'
                                        : 'hover:bg-gray-900 hover:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-900'
                                        }`}
                                    onClick={handleChangeMethod}
                                >
                                    2 Fases
                                </button>
                                <button
                                    id="mgrande"
                                    className={`border w-full rounded-r-md transition-colors ${selectedMethod === 'mgrande'
                                        ? 'bg-gray-900 text-gray-50'
                                        : 'hover:bg-gray-900 hover:text-gray-50 dark:hover:bg-gray-50 dark:hover:text-gray-900'
                                        }`}
                                    onClick={handleChangeMethod}

                                >
                                    Gran M
                                </button>

                            </div>
                            <div>
                                {jsx_pro_p2}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            id="jsx_res_fo_boton"
                            className="border rounded-md w-36 bg-gray-900 text-gray-50"
                            onClick={handleResolverProblema}
                        >Resolver</button>
                    </div>
                    <div>
                        <button
                            id="jsx_res_fo_boton"
                            className="border rounded-md w-36 bg-gray-900 text-gray-50"
                            onClick={limpiarDatos}
                        >Nuevo Problema</button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2 text-gray-600">Resultado</h2>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-300">Tabla Simplex</h3>
                                <div>
                                    {resultados}
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
