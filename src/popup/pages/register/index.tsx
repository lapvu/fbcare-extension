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
                        message: 'E-mail không đúng định dạng!',
                    },
                    {
                        required: true,
                        message: 'Vui lòng nhập E-mail!',
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
                        message: 'Vui lòng nhập mật khẩu!',
                    },
                ]}
                hasFeedback
            >
                <Input.Password placeholder="Mật khẩu" />
            </Form.Item>

            <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng Xác nhận mật khẩu!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('Hai mật khẩu không khớp!');
                        },
                    }),
                ]}
            >
                <Input.Password placeholder="Xác nhập mật khẩu" />
            </Form.Item>

            <Form.Item
                name="display_name"
                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!', whitespace: true }]}
            >
                <Input placeholder="Tên hiển thị" />
            </Form.Item>

            <Form.Item
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="Số điện thoại" />
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject('Bạn chưa xác nhận các điều khoản!'),
                    },
                ]}
            >
                <Checkbox>
                    Tôi đồng ý với các <a href="">điều khoản</a>
                </Checkbox>
            </Form.Item>
            <Form.Item >
                <Button type="primary" htmlType="submit" block loading={isLoading}>
                    Đăng ký
          </Button>
            </Form.Item>
        </Form>
    )
}
