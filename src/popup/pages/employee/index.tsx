import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { EmployeeListPage } from './list'

export const EmployeePage = () => {
    return (
        <Switch>
            <Route path="/list">
                <EmployeeListPage />
            </Route>
        </Switch>
    )
}
