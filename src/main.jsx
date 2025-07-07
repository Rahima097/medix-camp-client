import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router";
import { router } from './router/router.jsx';
import ThemeContext from './contexts/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContext>
      <RouterProvider router={router} />
    </ThemeContext>
  </StrictMode>
);
