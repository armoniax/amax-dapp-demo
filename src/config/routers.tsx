import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/home";
import Search from "@/pages/search";
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
        path: "/search",
        element: <Search />,
      },
    ]
  },
]);
