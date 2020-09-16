import React, { Suspense } from "react";
import { CircularProgress } from "@material-ui/core";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Container, { createRoutes } from "../components/navigator/Container";
import Home from "../screens/Home";

export default () => {
  const routes = createRoutes(() => [
    { route: "/", name: "Home", component: <Home />, show: true },
  ]);

  return (
    <BrowserRouter>
      <Container routes={routes}>
        <Switch>
          <Suspense fallback={<CircularProgress />}>
            {routes.map(({ route, component, exact }) => (
              <Route key={route} path={route} exact={exact || route === "/"}>
                {component}
              </Route>
            ))}
          </Suspense>
        </Switch>
      </Container>
    </BrowserRouter>
  );
};
