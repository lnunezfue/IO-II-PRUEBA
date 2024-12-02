import { Link } from "react-router-dom";

export const Main = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="px-12">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 text-center">
            Proyecto de Investigación Operativa
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-8xl">
            {/* Métodos existentes */}
            <Link
              to="simplex"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <CalculatorIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Método Simplex
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Resuelve problemas de programación lineal utilizando el Método Simplex, incluyendo variantes como el Método de 2 Fases y Gran M.
              </p>
            </Link>
            <Link
              to="critical-route"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <TrendingDown className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Método de la Ruta Crítica CPM
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Determina la secuencia más larga de tareas críticas identificando el tiempo mínimo necesario para completar el proyecto.
              </p>
            </Link>
            <Link
              to="pert"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <Clock className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Método PERT
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Evalúa la duración de tareas en proyectos utilizando estimaciones optimistas, probables y pesimistas para gestionar incertidumbres.
              </p>
            </Link>
            <Link
              to="eoq"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <CalculatorIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Método EOQ
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Calcula la cantidad económica de pedido para minimizar costos de inventario y pedidos en tu negocio.
              </p>
            </Link>
            <Link
              to="eoq-discounts"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <ShoppingCart className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                EOQ con Descuentos
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Calcula el EOQ optimizado considerando descuentos por volumen de compra.
              </p>
            </Link>
            <Link
              to="ahp"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <TwoWayArrow className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Método AHP
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Calcula la mejor alternativa basada en criterios ponderados.
              </p>
            </Link>
            <Link
              to="decision-tree"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <DecisionTreeIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Árbol de Decisión
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Visualiza y analiza decisiones con probabilidades y payoff.
              </p>
            </Link>
            <Link
              to="decision-table"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <TablaDecisionIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Tabla de Decisión
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Aplica y analiza diferentes criterios de decisión.
              </p>
            </Link>
            <Link
              to="queue-theory"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <QueueIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Teoría de Colas
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Analiza y modela sistemas de colas para optimizar tiempos de espera y recursos.
              </p>
            </Link>
            
            {/* Nuevas páginas de programación matemática */}
            <Link
              to="separable-programming"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <FunctionIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Programación Separable
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Resuelve problemas de optimización donde la función objetivo y las restricciones tienen una forma separable.
              </p>
            </Link>
            <Link
              to="fractional-programming"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <FractionsIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Programación Fraccional
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Optimiza problemas donde la función objetivo y las restricciones son fracciones racionales.
              </p>
            </Link>
            <Link
              to="non-convex-programming"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <NonConvexIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Programación No Convexa
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Trata problemas de optimización con funciones no convexas que pueden tener múltiples óptimos locales.
              </p>
            </Link>
            <Link
              to="geometric-programming"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <GeometryIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Programación Geométrica
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Resuelve problemas de optimización con funciones de forma geométrica, como productos y cocientes de términos polinómicos.
              </p>
            </Link>
            <Link
              to="convex-programming"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <ConvexIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Programación Convexa
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Optimiza problemas donde la función objetivo y las restricciones son convexas, garantizando una solución única.
              </p>
            </Link>
            <Link
              to="quadratic-programming"
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col items-center justify-center"
            >
              <ParabolaIcon className="w-12 h-12 text-gray-600 dark:text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300 text-center">
                Programación Cuadrática
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Resuelve problemas de optimización con funciones cuadráticas, comúnmente aplicadas en áreas de finanzas y economía.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};


// Iconos nuevos
function FunctionIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function FractionsIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
      <path d="M6 15l6 6 6-6" />
    </svg>
  );
}

function NonConvexIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l16 16" />
      <path d="M4 16L16 4" />
    </svg>
  );
}

function GeometryIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="4 4 20 4 20 20 4 20" />
    </svg>
  );
}

function ConvexIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ParabolaIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}


function CalculatorIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}

function TrendingDown(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function Clock(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function QueueIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="6" r="4" />
      <circle cx="6" cy="14" r="3" />
      <circle cx="18" cy="14" r="3" />
      <line x1="6" y1="17" x2="6" y2="19" />
      <line x1="12" y1="9" x2="12" y2="11" />
      <line x1="18" y1="17" x2="18" y2="19" />
    </svg>
  );
}

function ShoppingCart(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function TwoWayArrow(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
      <polyline points="17 17 7 17 7 7" />
    </svg>
  );
}
function DecisionTreeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="19" r="3" />
      <circle cx="19" cy="19" r="3" />
      <line x1="12" y1="8" x2="5" y2="16" />
      <line x1="12" y1="8" x2="19" y2="16" />
    </svg>
  );
}
function TablaDecisionIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  );
}
