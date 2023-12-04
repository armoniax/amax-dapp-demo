import { createRoot } from "react-dom/client";
import 'default-passive-events';
import { Provider } from 'react-redux'
import store from '@/store'
import {
  RouterProvider,
} from "react-router-dom";
import './index.css';
import router from "./config/routers";
import vConsole from 'vconsole';

new vConsole();



// document.addEventListener("visibilitychange", function () {
//   if (document.visibilityState === 'visible') {
//     console.log('visible');
//   } else {
//     console.log('not visible');
//   }
// });

// if (document.hasFocus()) {
//   console.log("该页面获得了焦点.");
// }
// else {
//   console.log("该页面没有获得焦点.")
// }

const root = document.getElementById("root");

createRoot(root as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

