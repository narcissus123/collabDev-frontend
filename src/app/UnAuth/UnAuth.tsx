import { Route, Routes, useLocation } from "react-router";

import Layout from "../../components/Layout/Layout";
import { publicRoutes } from "../../configs/Routes";

export default function UnAuth() {
  const location = useLocation();

  const excludeHeaderFooter = location.pathname === "/login";
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout header={!excludeHeaderFooter} footer={!excludeHeaderFooter} />
        }
      >
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}>
            {route.children && (
              <Route path={route.children.path} element={route.children.path} />
            )}
          </Route>
        ))}
      </Route>
    </Routes>
  );
}
