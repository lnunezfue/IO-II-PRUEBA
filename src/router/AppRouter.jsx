import { Routes, Route } from "react-router-dom";
import {
  Main,
  Simplex,
  CPM,
  PERT,
  EOQ,
  DecisionTree,
  EOQDiscountPage,
  AHPPage,
  TablaDecision,
  Queue,
  QuadraticPage,
  GeometricPage,
  Separable,
  FractionalPage,
  NonConvexPage,
  ConvexPage
} from "../pages/index"; // Importación desde el index, donde todas las páginas están exportadas

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/simplex" element={<Simplex />} />
      <Route path="/critical-route" element={<CPM />} />
      <Route path="/pert" element={<PERT />} />
      <Route path="/eoq" element={<EOQ />} />
      <Route path="/eoq-discounts" element={<EOQDiscountPage />} />
      <Route path="/ahp" element={<AHPPage />} />
      <Route path="/decision-tree" element={<DecisionTree />} />
      <Route path="/decision-table" element={<TablaDecision />} />
      <Route path="/queue-theory" element={<Queue />} />
      <Route path="/quadratic-programming" element={<QuadraticPage />} />
      <Route path="/geometric-programming" element={<GeometricPage />} />
      <Route path="/separable-programming" element={<Separable />} />
      <Route path="/fractional-programming" element={<FractionalPage />} />
      <Route path="/non-convex-programming" element={<NonConvexPage />} />
      <Route path="/convex-programming" element={<ConvexPage />} />
    </Routes>
  );
};

export default AppRouter;
