import { Collapse } from 'antd'
import React from 'react'
import { Container } from '../../components/Container'

const { Panel } = Collapse;

export const DashBoardPage = () => {
    return (
        <Container>
            <Collapse defaultActiveKey={['1']} >
                <Panel header="This is panel header 1" key="1">
                    asdasd
                </Panel>
            </Collapse>
        </Container>
    )
}
