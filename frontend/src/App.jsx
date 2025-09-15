import AppRoutes from "./routes/Routes";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

const App = () => {
  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });

  const authUser = authData?.user;
  return (
    <div className="h-screen" data-theme="night">
      <AppRoutes auth={authUser} />
      <Toaster />
    </div>
  );
};

export default App;
