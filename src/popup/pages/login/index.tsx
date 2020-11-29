import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, message } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginApi } from '../../api';
import { login } from '../../redux/auth';

export const LoginPage = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const { from }: any = location.state || { from: { pathname: "/" } };
    const [messsageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res = await loginApi(values.identifier, values.password);
            if (res.data.success) {
                dispatch(login(res.data.data.access_token));
                setIsLoading(false);
                history.replace(from);
            }
        } catch (errors) {
            if (errors.error) {
                messsageApi.open({
                    type: 'error',
                    content: errors.error.message,
                    duration: 5,
                });
                setIsLoading(false)
            }
        }
    };
    return (
        <>
            {contextHolder}
            <Form
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{
                    width: "20rem",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)"
                }}
            >
                <Form.Item
                    name="identifier"
                    rules={[{ required: true, message: 'Please input your E-mail or Phone number!' }]}
                >
                    <Input placeholder="E-mail or Phone number" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Link to="forgot-password" style={{ float: "right" }}>Forgot password</Link>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={isLoading}>
                        Log in
          </Button>
          Or <Link to="/register">register now!</Link>
                </Form.Item>
            </Form>
        </>
    )
}
