import { Timada } from "lib";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "routes/AppRoutes";

const App: React.FC = () => {
  return (
    <Timada>
      <Router>
        <AppRoutes />
      </Router>
    </Timada>
  );
};

export default App;
