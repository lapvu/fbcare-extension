import React from 'react'
import { Card, Col, Descriptions, Row } from 'antd'


export const ProfilePage = () => {
    return (
        <Row>
            <Col span={16} offset={4}>
                <Card style={{ marginTop: 100 }}>
                    <Descriptions title="Thông tin người dùng">
                        <Descriptions.Item label="Tên hiển thị">Zhou Maomao</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">1810000000</Descriptions.Item>
                        <Descriptions.Item label="Email">empty</Descriptions.Item>
                        <Descriptions.Item label="Fb id">1810000000</Descriptions.Item>
                        <Descriptions.Item label="Loại tài khoản">1810000000</Descriptions.Item>
                        <Descriptions.Item label="Ngày tham gia">1810000000</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>
    )
}
