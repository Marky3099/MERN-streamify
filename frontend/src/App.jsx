import AppRoutes from "./routes/Routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="h-screen" data-theme="night">
      <AppRoutes />
      <Toaster />
    </div>
  );
};

export default App;
