import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { store } from "./redux/store";
import { App } from "./App";

import "antd/dist/antd.css";

const queryCache = new QueryCache();

ReactDOM.render(
    <Provider store={store}>
        <ReactQueryCacheProvider queryCache={queryCache}>
            <App />
        </ReactQueryCacheProvider>
    </Provider>, document.getElementById("root"))