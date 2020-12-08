import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { Container } from '../../components/Container'
import { CreateEmployeePage } from './create';
import { ListEmployeePage } from './list';

export const EmployeePage = () => {
    let { path } = useRouteMatch();
    return (
        <Container>
            <Switch>
                <Route exact path={path}>
                    <ListEmployeePage />
                </Route>
                <Route path={`${path}/create`}>
                    <CreateEmployeePage />
                </Route>
            </Switch>
        </Container>
    )
}
