import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, message, Space } from 'antd';
import { createProduct, ProductInVO, getProduct, updateProduct } from "../../api";
import { Link, useParams } from 'react-router-dom';
import { } from "../../api";

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
        range: '${label} must be between ${min} and ${max}',
    },
};
export const EditProductPage = () => {
    let { id }: any = useParams();
    const [messsageApi, contextHolder] = message.useMessage();
    const [product, setProduct] = useState({} as {
        productName: string
    });
    const [isLoading, setIsLoading] = useState(false)

    const onFinish = async (values: ProductInVO) => {
        const res = await updateProduct(values, id);
        if (res) {
            messsageApi.open({
                type: 'success',
                content: "Sửa sản phẩm thành công!",
                duration: 5,
            });
        }
    };

    useEffect(() => {
        const initProduct = async () => {
            setIsLoading(true);
            const res = await getProduct(id);
            setProduct(res.data);
            setIsLoading(false);
        }
        initProduct();
    }, [])

    return (
        <Card title="Sửa sản phẩm" extra={<Link to="/product">Thoát</Link>} loading={isLoading}>
            {contextHolder}
            <Form {...layout}
                name="edit-product"
                initialValues={{ ...product }}
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Form.Item name="product_name" label="Tên sản phẩm" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="product_desc" label="Mô tả" rules={[{ required: true }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="price" label="Giá"
                    rules={[{ type: 'number', min: 1, max: 100000000000 }, { required: true }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        formatter={value => `đ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value: any) => value.replace(/\đ\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item name='image' label="Ảnh" rules={[{ required: true, type: "url" }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="weight" label="Khối lượng" rules={[{ type: 'number', min: 1, max: 100000000000 }, { required: true }]}>
                    <InputNumber
                        formatter={value => `${value}g`}
                        parser={(value: any) => value.replace('g', '')}
                    />
                </Form.Item>
                <Form.Item name="length" label="Chều dài" rules={[{ type: 'number', min: 1, max: 100000000000 }, { required: true }]}>
                    <InputNumber
                        formatter={value => `${value}cm`}
                        parser={(value: any) => value.replace('cm', '')}
                    />
                </Form.Item>
                <Form.Item name="width" label="Chều rộng" rules={[{ type: 'number', min: 1, max: 100000000000 }, { required: true }]}>
                    <InputNumber
                        formatter={value => `${value}cm`}
                        parser={(value: any) => value.replace('cm', '')}
                    />
                </Form.Item>
                <Form.Item name="height" label="Chều cao" rules={[{ type: 'number', min: 1, max: 100000000000 }, { required: true }]}>
                    <InputNumber
                        formatter={value => `${value}cm`}
                        parser={(value: any) => value.replace('cm', '')}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">Sửa</Button>
                        <Link to="/product"><Button>Hủy</Button></Link>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    )
}
