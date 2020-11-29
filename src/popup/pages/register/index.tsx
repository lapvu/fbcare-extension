import React, { useState } from 'react'
import {
    Form,
    Input,
    Select,
    Checkbox,
    Button,
} from 'antd';
import { register as registerApi } from '../../api';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/auth';
import { useHistory, useLocation } from 'react-router-dom';

const { Option } = Select;

export const RegisterPage = () => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const { from }: any = location.state || { from: { pathname: "/" } };

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res = await registerApi(values);
            if (res.data.success) {
                dispatch(login(res.data.data.access_token));
                setIsLoading(false);
                history.push(from);
            }
        } catch (errors) {
            form.setFields([
                {
                    name: errors.error.name,
                    errors: [errors.error.message]
                }
            ])
            setIsLoading(false);
        }
    };

    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option value="84">+84</Option>
            </Select>
        </Form.Item>
    );

    return (
        <Form
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '84',
            }}
            scrollToFirstError
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "22rem"
            }}
        >
            <Form.Item
                name="email"
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input placeholder="E-mail" />
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('The two passwords that you entered do not match!');
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item
                name="displayName"
                rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
            >
                <Input placeholder="Display Name" />
            </Form.Item>

            <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject('Should accept agreement'),
                    },
                ]}
            >
                <Checkbox>
                    I have read the <a href="">agreement</a>
                </Checkbox>
            </Form.Item>
            <Form.Item >
                <Button type="primary" htmlType="submit" block loading={isLoading}>
                    Register
          </Button>
            </Form.Item>
        </Form>
    )
}
