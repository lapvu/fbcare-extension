import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Input, Row, message } from 'antd'
import { EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Container } from '../../components/Container';
import { getSetting, saveSetting, Setting } from "../../api"

const validateMessages = {
    required: 'Vui lòng nhập ${label}!',
};

export const TransportPage = () => {
    const [setting, setSetting] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isFormSetting, setIsFormSetting] = useState(false);
    useEffect(() => {
        const initSetting = async () => {
            setIsLoading(true);
            const res = await getSetting();
            if (res.data) {
                setSetting(res.data);
            }
            setIsLoading(false);
        }
        initSetting();
    }, [])

    const onFinish = async (values: Setting) => {
        setIsFormSetting(true);
        const res = await saveSetting(values);
        if (res.data) {
            message.success('Cài đặt thành công!');
        }
        setIsFormSetting(false);
    }

    return (
        <Container>
            <Row>
                <Col span={12} offset={6}>
                    <Card title="Cài đặt vận chuyển SuperShip" loading={isLoading}>
                        <Form layout="vertical" onFinish={onFinish} initialValues={setting} validateMessages={validateMessages}>
                            <Form.Item name="token" label="Token" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" type="primary" block loading={isFormSetting}>Lưu</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container >
    )
}
