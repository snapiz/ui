import { LazyIntlProvider } from "lib";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./constants";
import InputPage from "./InputPage";

const translations = {
  fr: () => import("./elements_fr"),
};

const ElementsRoutes: React.FC = () => {
  return (
    <LazyIntlProvider ckey="app_forms_elements" translations={translations}>
      <Routes>
        <Route path="input" element={<InputPage />} />
        <Route path="*" element={<Navigate to={ROUTES.INPUT} replace />} />
      </Routes>
    </LazyIntlProvider>
  );
};

export default ElementsRoutes;
