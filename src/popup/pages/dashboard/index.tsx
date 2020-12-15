import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import { DropboxOutlined, ReconciliationOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Container } from '../../components/Container'
import { getInfo } from '../../api';

export const DashBoardPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState<any>({});
    useEffect(() => {
        const initInfo = async () => {
            setIsLoading(true);
            const res = await getInfo();
            if (res.data) {
                setInfo(res.data);
            }
            setIsLoading(false);
        }
        initInfo();
    }, [])
    return (
        <Container>
            <Row gutter={24}>
                <Col span={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Nhân viên"
                            value={info.employee}
                            valueStyle={{ color: '#2ecc71' }}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Sản phẩm"
                            value={info.product}
                            valueStyle={{ color: '#e67e22' }}
                            prefix={<DropboxOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Đơn hàng"
                            value={info.order}
                            valueStyle={{ color: '#2980b9' }}
                            prefix={<ReconciliationOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card loading={isLoading}>
                        <Statistic
                            title="Ghi chú"
                            value={info.note}
                            valueStyle={{ color: '#8e44ad' }}
                            prefix={<TeamOutlined />}
                        />
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}
