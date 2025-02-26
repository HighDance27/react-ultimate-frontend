import React from "react";
import ReactDOM from 'react-dom/client'
import App from "./App";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import UserPage from "./pages/user";
import BookPage from "./pages/book";
import './styles/global.css'
import TodoApp from "./components/todo/TodoApp";
import ErrorPage from "./pages/error";
import { AuthWrapper } from "./components/context/auth.context";
import PrivateRoute from "./pages/private.route";
import 'nprogress/nprogress.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <TodoApp />
      },
      {
        path: "/users",
        element: <UserPage />
      },
      {
        path: "/books",
        element: (
          <PrivateRoute>
            <BookPage />
          </PrivateRoute>
        )
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  }

]);
ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
  // </React.StrictMode>,
);