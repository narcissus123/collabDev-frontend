import { Route, Routes } from "react-router";

import Layout from "../../components/Layout/Layout";
import { privateRoutes } from "../../configs/Routes";

export default function Auth() {
  return (
    <Routes>
      <Route path="/" element={<Layout header={true} footer={true} />}>
        {privateRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element}></Route>
        ))}
      </Route>
    </Routes>
  );
}
