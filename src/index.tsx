import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux'
import store from '@/store'
import {
  RouterProvider,
} from "react-router-dom";
import './index.css';
import router from "./config/routers";
import vConsole from 'vconsole';

new vConsole();


const root = document.getElementById("root");

createRoot(root as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

