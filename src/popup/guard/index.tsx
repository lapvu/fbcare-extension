import React, { useEffect, useState } from "react"
import { Redirect, Route } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from "antd";
import { login } from "../redux/auth";

export function PrivateRoute({ children, ...rest }: any) {
    const state = useSelector((state: any) => state.authReducer);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            dispatch(login(token));
            setIsLoading(false);
        }
        setIsLoading(false)
    }, [])

    if (isLoading) {
        return <div style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Spin tip="Loading..."></Spin>
        </div>;
    }

    return (
        <Route
            {...rest}
            render={({ location }) =>
                state.isAuthenticated ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }
                            }
                        />
                    )
            }
        />
    );
}