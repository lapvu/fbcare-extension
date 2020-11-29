import React from "react"
import { Route, Switch, HashRouter, Redirect } from "react-router-dom";
import { MyLayout } from './components/Layout';
import {
    LoginPage,
    RegisterPage,
    DashBoardPage,
    NotFoundPage,
    EmployeePage,
    ConversationPage,
    TransportPage
} from "./pages";
import {
    LOGIN_ROUTE,
    REGISTER_ROUTE,
    DASHBOARD_ROUTE,
    EMPLOYEE_ROUTE,
    HOME_ROUTE,
    CONVERSATION_ROUTE,
    PRODUCT_ROUTE,
    TRANSPORT_ROUTE
} from "./constant"
import { PrivateRoute } from "./guard";
import "./App.css";
import { ProductPage } from "./pages/product";

export function App() {
    return (
        <HashRouter>
            <Switch>
                <Route path={LOGIN_ROUTE}>
                    <LoginPage />
                </Route>
                <Route path={REGISTER_ROUTE}>
                    <RegisterPage />
                </Route>
                <PrivateRoute path={HOME_ROUTE}>
                    <Route path={HOME_ROUTE} exact>
                        <Redirect to="/dashboard" />
                    </Route>
                    <MyLayout>
                        <Switch>
                            <Route path={DASHBOARD_ROUTE}>
                                <DashBoardPage />
                            </Route>
                            <Route path={CONVERSATION_ROUTE}>
                                <ConversationPage />
                            </Route>
                            <Route path={PRODUCT_ROUTE}>
                                <ProductPage />
                            </Route>
                            <Route path={EMPLOYEE_ROUTE}>
                                <EmployeePage />
                            </Route>
                            <Route path={TRANSPORT_ROUTE}>
                                <TransportPage />
                            </Route>
                            <Route path="*">
                                <NotFoundPage />
                            </Route>
                        </Switch>
                    </MyLayout>
                </PrivateRoute>
            </Switch>
        </HashRouter>
    )
}


