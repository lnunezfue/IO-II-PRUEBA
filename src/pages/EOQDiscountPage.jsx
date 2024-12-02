import { useState } from "react";
import { useForm } from "react-hook-form";
import useEOQDiscounts from "../hooks/useEOQDiscounts";

export const EOQDiscountPage = () => {
  const { handleSubmit, register, reset } = useForm();
  const { bestOption, calculateEOQDiscounts } = useEOQDiscounts();
  const [discounts, setDiscounts] = useState([]);

  // Agregar un nuevo nivel de descuento
  const addDiscount = () => {
    setDiscounts([...discounts, { minQuantity: 0, rate: 0, unitCost: 0 }]);
  };

  // Función para actualizar el descuento en un índice
  const updateDiscount = (index, field, value) => {
    const updatedDiscounts = [...discounts];
    updatedDiscounts[index][field] = parseFloat(value);
    setDiscounts(updatedDiscounts);
  };

  const onSubmit = handleSubmit(values => {
    const data = {
      demand: values.demand,
      orderingCost: values.orderingCost,
      holdingCost: values.holdingCost,
      discounts: discounts
    };
    calculateEOQDiscounts(data);
  });

  const handleReset = () => {
    reset();
    setDiscounts([]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Cálculo EOQ con Descuentos por Cantidad</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Planteamiento</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <table className="table-auto w-full text-left text-gray-600">
            <thead>
              <tr>
                <th className="px-4 py-2">Parameter</th>
                <th className="px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">Demand rate (D)</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    {...register("demand")}
                    placeholder="Demanda"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Setup/ordering cost (S)</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    {...register("orderingCost")}
                    placeholder="Costo de Ordenar"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Holding/carrying cost (H)</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    {...register("holdingCost")}
                    placeholder="Costo de Almacenamiento"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-md font-semibold mb-2">Descuentos por cantidad</h3>
          {discounts.map((discount, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Cantidad mínima</label>
                <input
                  type="number"
                  placeholder="Min Quantity"
                  value={discount.minQuantity}
                  onChange={(e) => updateDiscount(index, "minQuantity", e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2">Tasa de descuento (%)</label>
                <input
                  type="number"
                  placeholder="Descuento (%)"
                  value={discount.rate}
                  onChange={(e) => updateDiscount(index, "rate", e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2">Costo unitario</label>
                <input
                  type="number"
                  placeholder="Unit Cost"
                  value={discount.unitCost}
                  onChange={(e) => updateDiscount(index, "unitCost", e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addDiscount}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
          >
            Agregar descuento
          </button>

          <div className="flex space-x-4 mt-4">
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-colors">Calcular EOQ</button>
            <button type="button" onClick={handleReset} className="bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-colors">Reiniciar</button>
          </div>
        </form>
      </div>

      {bestOption && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Mejor Opción</h2>
          <p><strong>EOQ:</strong> {bestOption.bestEOQ}</p>
          <p><strong>Costo Total:</strong> {bestOption.bestCost}</p>
          <p><strong>Descuento Aplicado:</strong> {bestOption.bestDiscount ? bestOption.bestDiscount.unitCost : "N/A"}</p>
        </div>
      )}
    </div>
  );
};

export default EOQDiscountPage;
