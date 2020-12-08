import React, { useState } from 'react';
import { Button, Card, Form, Input, InputNumber, message, Space } from 'antd';
import { createEmployee, EmployeeInVO } from "../../api";
import { Link, useHistory } from 'react-router-dom';

const layout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 },
};

const validateMessages = {
    required: 'Vui lòng nhập ${label}!',
    types: {
        number: '${label} không đúng định dạng!',
        url: "${label} không đúng định dạng!"
    },
    number: {
        range: '${label} phải nằm trong khoảng ${min} và ${max}',
    },
};
export const CreateEmployeePage = () => {
    const [messsageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const history = useHistory();
    const onFinish = async (values: EmployeeInVO) => {
        try {
            const res = await createEmployee(values);
            if (res) {
                messsageApi.open({
                    type: 'success',
                    content: "Thêm nhân viên thành công!",
                    duration: 5,
                });
                history.push("/employee");
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

    return (
        <Card title="Thêm nhân viên" extra={<Link to="/employee">Thoát</Link>}>
            {contextHolder}
            <Form {...layout} onFinish={onFinish} validateMessages={validateMessages} form={form}>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="display_name" label="Tên hiển thị" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    hasFeedback
                    label="Mật khẩu"
                    rules={[{ required: true }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    dependencies={['password']}
                    hasFeedback
                    label="Xác nhập mật khẩu"
                    rules={[
                        { required: true },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Mật khẩu không khớp!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={isLoading}>Thêm</Button>
                        <Link to="/employee"><Button>Hủy</Button></Link>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}
