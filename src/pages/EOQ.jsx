import { useState } from "react";
import { useForm } from "react-hook-form";
import useEOQ from "../hooks/useEOQ";

export const EOQ = () => {
  const { handleSubmit, register, reset } = useForm();
  const { eoq_format } = useEOQ();
  const [setting, setSetting] = useState({ num_products: 1, eoq_variation: 'standard' });
  const [result, setResult] = useState([]);

  const onSubmit = handleSubmit(values => {
    const formattedValues = formatValues(values);
    if (validateForm(formattedValues)) {
      const data = eoq_format(formattedValues, setting.eoq_variation); // Pasamos la variación seleccionada
      setResult(data);  // Actualizamos los resultados
    } else {
      console.error("Formulario inválido. Verifica los valores ingresados.");
    }
  });

  const validateForm = (values) => {
    for (let key in values) {
      if (isNaN(values[key]) || values[key] === "") {
        return false;
      }
    }
    return true;
  };

  const formatValues = (values) => {
    const formatted = {};
    for (let key in values) {
      formatted[key] = parseFloat(values[key]) || 0;
    }
    return formatted;
  };

  const handleReset = () => {
    setSetting({ num_products: 1, eoq_variation: 'standard' });
    setResult([]);
    reset();
  };

  const increment = () => {
    const numProducts = setting?.num_products;
    if (numProducts < 20) {
      setSetting({ ...setting, num_products: numProducts + 1 });
    }
  };

  const decrement = () => {
    const numProducts = setting?.num_products;
    if (numProducts > 1) {
      setSetting({ ...setting, num_products: numProducts - 1 });
    }
  };

  const handleVariationChange = (e) => {
    setSetting({ ...setting, eoq_variation: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 mt-6 text-gray-700">EOQ Calculator</h1>
      <div className="grid grid-cols-1 gap-6 w-full max-w-6xl mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-2 text-gray-600">Variación de EOQ</h2>
          <select
            className="w-full mb-4 p-2 border rounded-md"
            value={setting.eoq_variation}
            onChange={handleVariationChange}
          >
            <option value="standard">EOQ Estándar</option>
            <option value="faltantes-planeados">Modelo con faltantes planeados</option>
            <option value="demanda-probabilistica">Modelo de inventario de periodo único con demanda probabilística</option>
            <option value="revision-periodica">Modelo de revisión periódica con demanda probabilística</option>
            <option value="tamaño-lote-produccion">Modelo de tamaño de lote de producción económico</option>
            <option value="con-ventas-perdidas">Modelo con demanda y tiempo de entrega probabilístico y con ventas perdidas</option>
            <option value="descuentos-cantidad">EOQ con descuentos por cantidad</option>
          </select>

          <ProductForm
            setting={setting}
            register={register}
            increment={increment}
            decrement={decrement}
            onSubmit={onSubmit}
            variation={setting.eoq_variation}
          />
          <ResultsTable result={result} />
        </div>
      </div>
    </div>
  );
};

const ProductForm = ({ setting, register, increment, decrement, onSubmit, variation }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
    <h2 className="text-xl font-semibold mb-2 text-gray-600">Product Information</h2>
    <div className="mb-4 flex items-center">
      <label htmlFor="num-products" className="block mr-4 text-gray-500 dark:text-gray-400">
        Number of Products:
      </label>
      <div className="flex items-center">
        <button
          className="mx-2 border rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={decrement}
        >
          <MinusIcon className="w-4 h-4" />
        </button>
        <input
          id="num-products"
          type="number"
          className="w-10 text-center rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 focus:border-blue-500 focus:ring-blue-500"
          value={setting?.num_products}
          readOnly
        />
        <button
          className="mx-2 border rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={increment}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>
    </div>

    <form onSubmit={onSubmit} className="overflow-auto">
      {Array.from({ length: setting?.num_products }).map((_, index) => (
        <ProductFields
          key={index}
          register={register}
          index={index}
          variation={variation}
        />
      ))}
      <button className="bg-gray-900 my-5 px-2.5 rounded font-bold text-white py-2" type="submit">
        CALCULATE EOQ
      </button>
    </form>
  </div>
);



const ProductFields = ({ register, index, variation }) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-600">Product {index + 1}</h3>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Product Name" name={`producto${index + 1}`} register={register} />
        <InputField label="Demand Rate (D)" name={`demandRate${index + 1}`} type="number" register={register} step="0.01" />
        <InputField label="Ordering Cost (S)" name={`orderingCost${index + 1}`} type="number" register={register} step="0.01" />
        <InputField label="Holding Cost (H)" name={`holdingCost${index + 1}`} type="number" register={register} step="0.01" />
        <InputField label="Unit Cost" name={`unitCost${index + 1}`} type="number" register={register} step="0.01" />
        <InputField label="Days per Year" name={`daysPerYear${index + 1}`} type="number" register={register} />
        <InputField label="Daily Demand Rate (d)" name={`dailyDemandRate${index + 1}`} type="number" register={register} step="0.01" />
        <InputField label="Lead Time (L)" name={`leadTime${index + 1}`} type="number" register={register} />
  
        {/* Campos adicionales según la variación seleccionada */}
        {(variation === 'demanda-probabilistica' || variation === 'revision-periodica' || variation === 'con-ventas-perdidas') && (
          <>
            <InputField label="Standard Deviation" name={`stdDev${index + 1}`} type="number" register={register} step="0.01" />
            <InputField label="Service Level (z)" name={`serviceLevel${index + 1}`} type="number" register={register} step="0.01" />
          </>
        )}
  
        {variation === 'faltantes-planeados' && (
          <InputField label="Shortage Cost" name={`shortageCost${index + 1}`} type="number" register={register} step="0.01" />
        )}
  
        {variation === 'tamaño-lote-produccion' && (
          <InputField label="Production Rate" name={`productionRate${index + 1}`} type="number" register={register} step="0.01" />
        )}
  
        {variation === 'con-ventas-perdidas' && (
          <InputField label="Sales Loss Cost" name={`salesLossCost${index + 1}`} type="number" register={register} step="0.01" />
        )}
  
        {variation === 'descuentos-cantidad' && (
          <div className="col-span-2">
            <label className="block text-gray-700">Discount Tiers:</label>
            <textarea
              name={`discountTiers${index + 1}`}
              {...register(`discountTiers${index + 1}`)}
              placeholder="Ej: [{ price: 10, minOrderQty: 500 }, { price: 9.5, minOrderQty: 1000 }]"
              className="px-2 text-center border rounded-md w-full"
            />
          </div>
        )}
      </div>
    </div>
);
  
const InputField = ({ label, name, type = "text", step, register }) => (
  <div>
    <label className="block text-gray-700">{label}:</label>
    <input
      type={type}
      step={step}
      className="px-2 text-center border rounded-md"
      {...register(name, { required: true })}
    />
  </div>
);

const ResultsTable = ({ result }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col">
    <h2 className="text-xl font-semibold mb-2 text-gray-600">Result</h2>
    {result.length !== 0 && (
      <>
        <hr />
        <h3 className="text-lg font-semibold mb-2 pt-2 text-gray-600 dark:text-gray-300">EOQ Result</h3>
        <div className="overflow-auto w-full">
          <table className="bg-white w-full text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr className="divide-x divide-gray-200 text-center">
                <th className="p-2">Parameter</th>
                <th className="p-2">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {result.map((product, i) => (
                <ProductResult key={i} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
  </div>
);

const ProductResult = ({ product }) => (
  <>
    <ResultRow label="Optimal order quantity (Q*)" value={formatNumber(product.eoq)} />
    <ResultRow label="Reorder Point" value={formatNumber(product.reorderPoint)} />
    <ResultRow label="Average Inventory" value={formatNumber(product.averageInventory)} />
    <ResultRow label="Orders per period" value={formatNumber(product.ordersPerPeriod)} />
    <ResultRow label="Annual Setup Cost" value={formatNumber(product.annualSetupCost)} />
    <ResultRow label="Annual Holding Cost" value={formatNumber(product.annualHoldingCost)} />
    <ResultRow label="Total Inventory (Holding + Setup) Cost" value={formatNumber(product.totalInventoryCost)} />
    <ResultRow label="Unit Cost (PD)" value={formatNumber(product.totalUnitCost)} />
    <ResultRow label="Total Cost (including units)" value={formatNumber(product.totalCostIncludingUnits)} />
  </>
);

const formatNumber = (value) => {
  if (isNaN(value) || value === null || value === undefined) {
    return "-";
  }
  return parseFloat(value).toFixed(2);
};

const ResultRow = ({ label, value }) => (
  <tr className="divide-x divide-gray-200 hover:bg-gray-100">
    <td className="whitespace-nowrap p-2 text-center">{label}</td>
    <td className="whitespace-nowrap p-2 text-center">{value}</td>
  </tr>
);

function MinusIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
