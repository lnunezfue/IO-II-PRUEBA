import { useState } from "react";

// Hook para manejar EOQ con descuentos por cantidad
const useEOQDiscounts = () => {
  const [bestOption, setBestOption] = useState(null);

  // Función para calcular el EOQ con descuentos por cantidad
  const calculateEOQDiscounts = (data) => {
    let bestCost = Infinity; // Empezamos con el costo más alto posible
    let bestEOQ = 0;
    let bestDiscount = null;

    data.discounts.forEach(discount => {
      const demand = parseFloat(data.demand);
      const orderingCost = parseFloat(data.orderingCost);
      const holdingCost = parseFloat(data.holdingCost) * (1 - discount.rate); // Ajustamos el costo de mantenimiento según el descuento

      const eoq = Math.sqrt((2 * demand * orderingCost) / holdingCost); // Fórmula del EOQ ajustada

      // Solo consideramos cantidades EOQ superiores al mínimo de la oferta
      if (eoq >= discount.minQuantity) {
        const totalHoldingCost = (holdingCost * eoq) / 2;
        const totalOrderingCost = (orderingCost * demand) / eoq;
        const totalUnitCost = demand * discount.unitCost;

        const totalCost = totalHoldingCost + totalOrderingCost + totalUnitCost;

        // Verificamos si este es el mejor costo hasta ahora
        if (totalCost < bestCost) {
          bestCost = totalCost;
          bestEOQ = eoq;
          bestDiscount = discount;
        }
      }
    });

    setBestOption({
      bestEOQ: bestEOQ.toFixed(2),
      bestCost: bestCost.toFixed(2),
      bestDiscount
    });
  };

  return {
    bestOption,
    calculateEOQDiscounts
  };
};

export default useEOQDiscounts;
