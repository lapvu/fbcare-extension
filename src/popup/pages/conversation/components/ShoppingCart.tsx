import React, { FC, useState, useEffect, Suspense, lazy } from "react";
import {
    Drawer,
    Row,
    Col,
    Select,
    Table,
    Button,
    Form,
    Input,
    Image,
    InputNumber,
    Popconfirm,
    Divider,
    Typography,
    message,
} from "antd";
import NumberFormat from 'react-number-format';
import { createOrder, getCommune, getDistrict, getProvince, Order } from '../../../api';

const SelectProductModal = lazy(() => import("./SelectProductModal"));

const validateMessages = {
    required: 'Vui lòng nhập ${label}!',
    types: {
        number: '${label} không đúng định dạng!',
    },
    number: {
        range: '${label} phải nằm trong khoảng ${min} và ${max}',
    },
};

const ShoppingCart: FC<{ visible: boolean, setVisible: any, customerId: string }> = ({ visible, setVisible, customerId }) => {
    const [form] = Form.useForm();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [shoppingCart, setShoppingCart] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isFormSubmit, setIsFormSubmit] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const getProvinces = async () => {
            setIsLoading(true);
            const res = await getProvince();
            setProvinces(res.data.results);
            setIsLoading(false);
        }
        getProvinces()
    }, [])

    const handleProvinceChange = async (province: any) => {
        setIsLoading(true);
        const res = await getDistrict(JSON.parse(province).code);
        setDistricts(res.data.results);
        setIsLoading(false);
    };

    const handleDistrictChange = async (district: any) => {
        setIsLoading(true);
        const res = await getCommune(JSON.parse(district).code);
        setCommunes(res.data.results);
        setIsLoading(false);
    };

    const handleChangeQuantity = (value: any, _id: any) => {
        const copy = shoppingCart.map((e: any) => {
            if (e._id === _id) {
                return {
                    ...e,
                    quantity: value
                }
            } else {
                return e;
            }
        })
        setShoppingCart(copy as any);
    }

    const deleteProduct = (_id: any) => {
        const copy = shoppingCart.filter((e: any) => {
            return e._id !== _id
        })
        setShoppingCart(copy);
    }

    const totalPrice = () => {
        let total = 0;
        shoppingCart.forEach((e: any) => {
            total += (e.quantity * e.price)
        })
        return total;
    }

    const onFinish = async (values: any) => {
        if (shoppingCart.length === 0) {
            message.error('Chưa có sản phẩm nào trong giỏ');
        } else {
            setIsFormSubmit(true);
            const products = shoppingCart.map((e: any) => ({
                sku: e._id,
                name: e.productName,
                price: e.price,
                weight: e.weight,
                quantity: e.quantity
            }))
            const orderInVo: Order = {
                customer_name: values.customer_name,
                customer_phone: values.customer_phone,
                customer_id: customerId,
                customer_email: values.email,
                products: [...products] as any,
                weight: 1000,
                address: values.address,
                commune: JSON.parse(values.commune).name,
                district: JSON.parse(values.district).name,
                province: JSON.parse(values.province).name
            }
            const order = await createOrder(orderInVo);
            if (order) {
                message.success('Tạo đơn hàng thành công!');
                form.resetFields();
                setShoppingCart([]);
            }
            setIsFormSubmit(false);
        }
    };

    const columns = [
        {
            title: '',
            dataIndex: 'image',
            render: (src: any) => <Image src={src} width={40} />
        },
        {
            title: '',
            dataIndex: 'productName',
        },
        {
            title: '',
            dataIndex: 'price',
            render: (price: any) => <NumberFormat
                value={price}
                displayType={'text'}
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={"đ "}
            />
        },
        {
            title: '',
            dataIndex: 'quantity',
            render: (quantity: number, record: any) => <InputNumber
                min={1} max={1000}
                onChange={(value) => handleChangeQuantity(value, record._id)}
                value={quantity}
            />
        },
        {
            title: '',
            dataIndex: 'total',
            render: (text: any, record: any) => <NumberFormat
                value={record.quantity * record.price}
                displayType={'text'}
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={"đ "}
            />
        },
        {
            title: '',
            dataIndex: 'actions',
            render: (_: any, record: any) => <Popconfirm
                placement="top"
                title="Xóa khỏi giỏ"
                onConfirm={() => deleteProduct(record._id)}
                okText="Có"
                cancelText="Không"
            >
                <Button type="link">Xóa</Button>
            </Popconfirm>
        },
    ]



    return (
        <Drawer
            title="Tạo đơn hàng"
            visible={visible}
            onClose={() => setVisible(false)}
            width={1000}
            footer={
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center"
                    }}>
                        <Typography.Text>Tổng tiền: </Typography.Text><NumberFormat
                            value={totalPrice()}
                            displayType={'text'}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            prefix={"đ"}
                            style={{
                                fontSize: "1.5rem",
                                color: "#ee4d2d",
                                marginLeft: "1rem"
                            }}
                        />
                    </div>
                    <Divider />
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
                            Hủy
                          </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            form="shopping-cart"
                            loading={isFormSubmit}
                        >
                            Hoàn tất
                          </Button>
                    </div>

                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                id="shopping-cart"
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="customer_name"
                            label="Tên khách hàng"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="customer_phone"
                            label="Số điện thoại"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="customer_email"
                            label="Email"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="province"
                            label="Tỉnh/Thành Phố"
                            rules={[{ required: true }]}
                        >
                            <Select loading={isLoading} onChange={handleProvinceChange}>
                                {provinces.map((province: any) => (
                                    <Select.Option key={province.code} value={JSON.stringify(province)}>{province.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="district"
                            label="Quận/Huyện"
                            rules={[{ required: true }]}
                        >
                            <Select loading={isLoading} onChange={handleDistrictChange}>
                                {districts.map((district: any) => (
                                    <Select.Option key={district.code} value={JSON.stringify(district)}>{district.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="commune"
                            label="Phường/Xã"
                            rules={[{ required: true }]}
                        >
                            <Select loading={isLoading}>
                                {communes.map((commune: any) => (
                                    <Select.Option key={commune.code} value={JSON.stringify(commune)}>{commune.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    name="address"
                    label="Địa chỉ cụ thể"
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => setShowModal(true)}>Thêm sản phẩm vào giỏ</Button>
                </Form.Item>
            </Form>
            <Table
                dataSource={shoppingCart}
                columns={columns}
                pagination={false}
            />
            <Suspense fallback={<div>loading</div>}>
                <SelectProductModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    shoppingCart={shoppingCart}
                    setShoppingCart={setShoppingCart}
                />
            </Suspense>
        </Drawer>
    )
}

export default ShoppingCart;