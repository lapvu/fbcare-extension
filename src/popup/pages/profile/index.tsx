import React, { useEffect, useState } from 'react'
import { Card, Col, Descriptions, Row } from 'antd'
import { format } from 'date-fns'
import { me } from '../../api/user.api'

export const ProfilePage = () => {
    const [data, setData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            const res = await me();
            setData(res.data)
            setIsLoading(false);
        }
        init();
    }, [])
    return (
        <Row>
            <Col span={16} offset={4}>
                <Card style={{ marginTop: 100 }} loading={isLoading}>
                    <Descriptions title="Thông tin người dùng">
                        <Descriptions.Item label="Tên hiển thị">{data.display_name}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">{data.phone}</Descriptions.Item>
                        <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
                        <Descriptions.Item label="Loại tài khoản">{data.roles?.includes("supplier") ? "Nhà kinh doanh" : "Nhân viên"}</Descriptions.Item>
                        <Descriptions.Item label="Ngày tham gia">{format(new Date(data.createdAt || null), 'MM/dd/yyyy')}</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>
    )
}
