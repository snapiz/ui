import { Timada } from "lib";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "react-query";
import AppRoutes from "routes/AppRoutes";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <Timada>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
        </Router>
      </QueryClientProvider>
    </Timada>
  );
};

export default App;
