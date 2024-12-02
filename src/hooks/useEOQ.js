const useEOQ = () => {
  const calculateEOQ = (demand, orderingCost, holdingCost, variation, otherParams = {}) => {
    let eoq = 0;

    switch (variation) {
      case 'standard':
        eoq = Math.sqrt((2 * demand * orderingCost) / holdingCost);
        break;

      case 'faltantes-planeados':
        const { shortageCost } = otherParams;
        eoq = Math.sqrt((2 * demand * orderingCost) / (holdingCost + shortageCost));
        break;

      case 'demanda-probabilistica':
        const { Cu, Co } = otherParams;
        const serviceLevel = Cu / (Cu + Co); // Relación probabilística
        eoq = demand * serviceLevel;
        break;

      case 'revision-periodica':
        const { reviewPeriod, serviceLevelZ, leadTime, stdDev } = otherParams;
        const demandDuringPeriod = demand * (leadTime + reviewPeriod);
        const safetyStock = serviceLevelZ * stdDev * Math.sqrt(leadTime + reviewPeriod);
        eoq = Math.sqrt((2 * demand * orderingCost) / holdingCost) + safetyStock;
        break;

      case 'tamaño-lote-produccion':
        const { productionRate } = otherParams;
        eoq = Math.sqrt((2 * demand * orderingCost) / (holdingCost * (1 - demand / productionRate)));
        break;

      case 'con-ventas-perdidas':
        const { salesLossCost, leadTimeVariability } = otherParams;
        eoq = Math.sqrt((2 * demand * orderingCost) / (holdingCost + salesLossCost));
        break;

      case 'descuentos-cantidad':
        const { discountTiers } = otherParams;
        eoq = calculateEOQWithDiscounts(demand, orderingCost, holdingCost, discountTiers);
        break;

      default:
        eoq = Math.sqrt((2 * demand * orderingCost) / holdingCost);
    }
    return eoq;
  };

  const calculateEOQWithDiscounts = (demand, orderingCost, holdingCost, discountTiers) => {
    let bestEOQ = 0;
    let minTotalCost = Infinity;

    // Iterar sobre cada nivel de descuento
    for (let i = 0; i < discountTiers.length; i++) {
      const { price, minOrderQty } = discountTiers[i];

      // Calcular el EOQ para ese nivel de descuento
      const eoq = Math.sqrt((2 * demand * orderingCost) / (holdingCost * price));

      // Asegurarse de que el EOQ cumpla el mínimo del descuento
      const adjustedEOQ = Math.max(eoq, minOrderQty);

      // Calcular el costo total (costo de pedido, mantenimiento e inventario)
      const annualSetupCost = (demand / adjustedEOQ) * orderingCost;
      const annualHoldingCost = (adjustedEOQ / 2) * holdingCost * price;
      const totalCost = annualSetupCost + annualHoldingCost + demand * price;

      // Encontrar el costo total mínimo
      if (totalCost < minTotalCost) {
        minTotalCost = totalCost;
        bestEOQ = adjustedEOQ;
      }
    }

    return bestEOQ;
  };

  const calculateReorderPoint = (dailyDemand, leadTime, serviceLevelZ, stdDev, variation) => {
    if (variation === 'demanda-probabilistica' || variation === 'punto-reorden' || variation === 'revision-periodica') {
      return (dailyDemand * leadTime) + (serviceLevelZ * stdDev);
    } else if (variation === 'sin-ventas-perdidas' || variation === 'con-ventas-perdidas') {
      return (dailyDemand * leadTime) + (serviceLevelZ * stdDev * Math.sqrt(leadTime));
    } else {
      return dailyDemand * leadTime;
    }
  };

  const eoq_format = (inputForm, variation) => {
    const result = [];
    const columns = 9;

    for (let i = 1; i <= Object.keys(inputForm).length / columns; i++) {
      const name = inputForm[`producto${i}`];
      const demandRate = parseFloat(inputForm[`demandRate${i}`]) || 0;
      const orderingCost = parseFloat(inputForm[`orderingCost${i}`]) || 0;
      const holdingCost = parseFloat(inputForm[`holdingCost${i}`]) || 0;
      const unitCost = parseFloat(inputForm[`unitCost${i}`]) || 0;
      const daysPerYear = parseFloat(inputForm[`daysPerYear${i}`]) || 0;
      let dailyDemandRate = parseFloat(inputForm[`dailyDemandRate${i}`]) || 0;
      const leadTime = parseFloat(inputForm[`leadTime${i}`]) || 0;
      const stdDev = parseFloat(inputForm[`stdDev${i}`]) || 0;
      const serviceLevelZ = parseFloat(inputForm[`serviceLevel${i}`]) || 1.0;
      const shortageCost = parseFloat(inputForm[`shortageCost${i}`]) || 0;
      const Cu = parseFloat(inputForm[`Cu${i}`]) || 0;
      const Co = parseFloat(inputForm[`Co${i}`]) || 0;
      const productionRate = parseFloat(inputForm[`productionRate${i}`]) || 0;
      const salesLossCost = parseFloat(inputForm[`salesLossCost${i}`]) || 0;
      const leadTimeVariability = parseFloat(inputForm[`leadTimeVariability${i}`]) || 0;
      const priceTier = parseFloat(inputForm[`priceTier${i}`]) || 1.0;
      const reviewPeriod = parseFloat(inputForm[`reviewPeriod${i}`]) || 0;
      const discountTiers = inputForm[`discountTiers${i}`] || [];

      if (dailyDemandRate === 0 && demandRate > 0 && daysPerYear > 0) {
        dailyDemandRate = demandRate / daysPerYear;
      }

      const eoq = calculateEOQ(demandRate, orderingCost, holdingCost, variation, { stdDev, serviceLevelZ, shortageCost, Cu, Co, productionRate, salesLossCost, leadTimeVariability, priceTier, reviewPeriod, discountTiers });
      const reorderPoint = calculateReorderPoint(dailyDemandRate, leadTime, serviceLevelZ, stdDev, variation);

      const averageInventory = eoq / 2 || 0;
      const ordersPerPeriod = demandRate / eoq || 0;
      const annualSetupCost = ordersPerPeriod * orderingCost || 0;
      const annualHoldingCost = averageInventory * holdingCost || 0;
      const totalInventoryCost = annualHoldingCost + annualSetupCost || 0;
      const totalUnitCost = demandRate * unitCost || 0;
      const totalCostIncludingUnits = totalUnitCost + totalInventoryCost || 0;

      result.push({
        name,
        demandRate,
        eoq: parseFloat(eoq.toFixed(2)),
        reorderPoint: parseFloat(reorderPoint.toFixed(2)),
        averageInventory: parseFloat(averageInventory.toFixed(2)),
        ordersPerPeriod: parseFloat(ordersPerPeriod.toFixed(2)),
        annualSetupCost: parseFloat(annualSetupCost.toFixed(2)),
        annualHoldingCost: parseFloat(annualHoldingCost.toFixed(2)),
        totalInventoryCost: parseFloat(totalInventoryCost.toFixed(2)),
        totalUnitCost: parseFloat(totalUnitCost.toFixed(2)),
        totalCostIncludingUnits: parseFloat(totalCostIncludingUnits.toFixed(2)),
      });
    }
    return result;
  };

  return {
    eoq_format
  };
};

export default useEOQ;
