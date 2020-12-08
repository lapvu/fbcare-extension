import React from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import { DropboxOutlined, ReconciliationOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Container } from '../../components/Container'

export const DashBoardPage = () => {
    return (
        <Container>
            <Row gutter={24}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Nhân viên"
                            value={11}
                            valueStyle={{ color: '#2ecc71' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Sản phẩm"
                            value={11}
                            valueStyle={{ color: '#e67e22' }}
                            prefix={<DropboxOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Đơn hàng"
                            value={11}
                            valueStyle={{ color: '#2980b9' }}
                            prefix={<ReconciliationOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Khách hàng"
                            value={100}
                            valueStyle={{ color: '#8e44ad' }}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
