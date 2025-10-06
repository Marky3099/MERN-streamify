import AppRoutes from "./routes/Routes";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";

const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme="night">
      <AppRoutes auth={isAuthenticated} onBoard={isOnboarded} />
      <Toaster />
    </div>
  );
};

export default App;
