import { LazyIntlProvider } from "lib";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./constants";
import TablePage from "./TablePage";

const ElementsRoutes = React.lazy(() => import("./elements/ElementsRoutes"));

const translations = {
  fr: () => import("./forms_fr"),
};

const FormsRoutes: React.FC = () => {
  return (
    <LazyIntlProvider ckey="app_forms" translations={translations}>
      <Routes>
        <Route path="elements/*" element={<ElementsRoutes />} />
        <Route path="table" element={<TablePage />} />
        <Route path="*" element={<Navigate to={ROUTES.ELEMENTS} replace />} />
      </Routes>
    </LazyIntlProvider>
  );
};

export default FormsRoutes;
