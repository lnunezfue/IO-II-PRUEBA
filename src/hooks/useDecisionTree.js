import { useState } from "react";

// Hook para manejar el árbol de decisiones
const useDecisionTree = () => {
  const [treeData, setTreeData] = useState(null);

  const createDecisionTree = (decisions) => {
    const tree = {
      name: "Decision Tree",
      children: decisions.map((decision) => {
        return {
          name: decision.name,
          children: decision.alternatives.map((alternative) => {
            return {
              name: `${alternative.name} (P: ${alternative.probability})`,
              value: alternative.payoff
            };
          })
        };
      })
    };

    setTreeData(tree);
  };

  return {
    treeData,
    createDecisionTree
  };
};

export default useDecisionTree;
