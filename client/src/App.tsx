import { Link, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import FibPage from "./pages/fib";
import OtherPage from "./pages/other";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <FibPage /> },
      { path: "/other", element: <OtherPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

function Layout() {
  return (
    <>
      <header style={{ padding: "10px 0", width: "100%", background: "#000" }}>
        <h1 style={{ marginBottom: "10px" }}>Fib calculator</h1>
        <Link style={{ fontSize: "20px" }} to="/">
          Home
        </Link>
        <Link style={{ fontSize: "20px", marginLeft: "10px" }} to="/other">
          Other page
        </Link>
      </header>
      <Outlet />
    </>
  );
}
