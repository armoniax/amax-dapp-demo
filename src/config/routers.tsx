import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import RPC from "@/pages/rpc";
import Layouts from "@/layouts";

export default createBrowserRouter([
  {
    path: '/',
    element: <Layouts />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/rpc",
        element: <RPC />,
      },
    ]
  },
]);
