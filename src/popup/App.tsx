import React, { useEffect } from "react"
import { Route, Switch, HashRouter, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { MyLayout } from './components/Layout';
import {
    LoginPage,
    RegisterPage,
    DashBoardPage,
    NotFoundPage,
    EmployeePage,
    ConversationPage,
    TransportPage,
    ProfilePage,
    OrderPage
} from "./pages";
import {
    LOGIN_ROUTE,
    REGISTER_ROUTE,
    DASHBOARD_ROUTE,
    EMPLOYEE_ROUTE,
    HOME_ROUTE,
    CONVERSATION_ROUTE,
    PRODUCT_ROUTE,
    TRANSPORT_ROUTE,
    PROFILE_ROUTE,
    ORDER_ROUTE
} from "./constant"
import { PrivateRoute } from "./guard";
import "./App.css";
import { ProductPage } from "./pages/product";
import { getOrderStatus } from "./api";
import { setStatus } from "./redux/status";

export function App() {
    const state = useSelector((state: any) => state.authReducer);
    const dispatch = useDispatch()

    useEffect(() => {
        const initStatusOrder = async () => {
            const res = await getOrderStatus();
            if (res.data.status === "Success") {
                dispatch(setStatus(res.data.results))
            }
        }
        initStatusOrder();
    }, [])

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
                            <Route path={ORDER_ROUTE}>
                                <OrderPage />
                            </Route>
                            <Route path={PROFILE_ROUTE}>
                                <ProfilePage />
                            </Route>
                            {state.roles.includes("supplier")
                                ? <>
                                    <Route path={PRODUCT_ROUTE}>
                                        <ProductPage />
                                    </Route>
                                    <Route path={EMPLOYEE_ROUTE}>
                                        <EmployeePage />
                                    </Route>
                                    <Route path={TRANSPORT_ROUTE}>
                                        <TransportPage />
                                    </Route>
                                </>
                                : <Redirect to="/dashboard" />
                            }
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


