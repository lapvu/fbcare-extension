import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { Container } from '../../components/Container'
import { CreateProductPage } from './create';
import { EditProductPage } from "./edit"
import { ListProductPage } from './list';

export const ProductPage = () => {
    let { path } = useRouteMatch();
    return (
        <Container>
            <Switch>
                <Route exact path={path}>
                    <ListProductPage />
                </Route>
                <Route path={`${path}/create`}>
                    <CreateProductPage />
                </Route>
                <Route path={`${path}/:id`}>
                    <EditProductPage />
                </Route>
            </Switch>
        </Container>
    )
}
