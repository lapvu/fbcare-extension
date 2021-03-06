import React, { FC, useState, useEffect, useRef } from "react";
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
    AutoComplete,
} from "antd";
import NumberFormat from 'react-number-format';
import { createOrder, getCommune, getDistrict, getFee, getProvince, Order, searchProducts } from '../../../api';

const validateMessages = {
    required: 'Vui lòng nhập ${label}!',
    types: {
        number: '${label} không đúng định dạng!',
    },
    number: {
        range: '${label} phải nằm trong khoảng ${min} và ${max}',
    },
};

const ShoppingCart: FC<{
    visible: boolean,
    setVisible: any,
    customerId: string,
    customerName: string,
    customerPhone: string,
    setOrders: any,
    orders: any
}> = ({ visible, setVisible, customerId, customerName, customerPhone, setOrders, orders }) => {

    const [form] = Form.useForm();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [options, setOptions] = useState<any>([]);
    const [shoppingCart, setShoppingCart] = useState<any>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormSubmit, setIsFormSubmit] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(0);
    const [products, setProducts] = useState<any>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [discount, setDiscount] = useState<number>(0);
    const [fee, setFee] = useState(0);
    const typingRef = useRef<any>(null);

    useEffect(() => {
        const getProvinces = async () => {
            setIsLoading(true);
            const res = await getProvince();
            setProvinces(res.data.results);
            setIsLoading(false);
        }
        getProvinces()
    }, [])

    useEffect(() => {
        form.setFieldsValue({
            customer_name: customerName,
            customer_phone: customerPhone
        })
    }, [customerName, customerPhone])

    useEffect(() => {
        const getFeeShip = async () => {
            const receiver_province = JSON.parse(form.getFieldValue("province")).name;
            const receiver_district = JSON.parse(form.getFieldValue("district")).name;
            const res = await getFee({
                receiver_province,
                receiver_district,
                weight: 1000
            });
            if (res.data.status === "Success") {
                setFee(+res.data.results[0].fee)
            }
        }
        if (shoppingCart.length > 0 && districts && provinces) {
            getFeeShip();
        }
    }, [shoppingCart, districts, provinces])

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
        setAmount(total);
    }

    useEffect(() => {
        totalPrice();
    }, [shoppingCart])

    const onFinish = async (values: any) => {
        if (shoppingCart.length === 0) {
            message.error('Chưa có sản phẩm nào trong giỏ');
            return;
        }
        if (amount > 20000000) {
            message.warn('Giá trị đơn hàng không được vượt quá 20.000.000 đồng');
            return;
        }
        setIsFormSubmit(true);
        const products = shoppingCart.map((e: any) => ({
            sku: e._id,
            name: e.product_name,
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
            amount,
            commune: JSON.parse(values.commune).name,
            district: JSON.parse(values.district).name,
            province: JSON.parse(values.province).name,
            note: values.note
        }
        try {
            const res = await createOrder(orderInVo);
            if (res) {
                message.success('Tạo đơn hàng thành công!');
                form.setFieldsValue({
                    note: "",
                    address: "",
                    province: null,
                    district: null,
                    commune: null
                });
                setShoppingCart([]);
                let copy = [...orders];
                copy.unshift(res.data);
                setOrders(copy);
                setVisible(false);
                setDiscount(0);
                setFee(0);
            }
            setIsFormSubmit(false);
        } catch (error) {
            console.log(error)
            if (error.error.name === "transport") {
                message.error("Bạn chưa cài đặt vận chuyển!");
            }
            setIsFormSubmit(false);
        }
    };

    const getProducts = async (query: string) => {
        const res = await searchProducts(query);
        if (res.data) {
            const copy = res.data.map((e: any) => ({ value: e._id, label: e.product_name }));
            setProducts(res.data);
            setOptions(copy);
        }
    }

    const onSearch = (searchText: string) => {
        setSearchTerm(searchText);
        if (typingRef.current) {
            clearTimeout(typingRef.current);
        }
        typingRef.current = setTimeout(() => {
            getProducts(searchText);
        }, 300)
    }

    const onSelect = (data: any) => {
        const product = products.filter((e: any) => e._id === data);
        const copy = [...shoppingCart];
        if (shoppingCart.length === 0) {
            copy.push(product[0])
        } else {
            const listId = shoppingCart.map((e: any) => e._id);
            if (listId.includes(data)) {
                copy.forEach((e: any, i: number) => {
                    if (e._id === data && copy[i].quantity < 1000) {
                        copy[i].quantity++;
                    }
                })
            } else {
                copy.push(product[0]);
            }
        }
        setShoppingCart(copy);
        setSearchTerm("");
    };

    const handleDiscountChange = (e: any) => {
        let total = 0;
        shoppingCart.forEach((e: any) => {
            total += (e.quantity * e.price)
        })
        const amountAf = total - total * (+e / 100);
        setAmount(amountAf);
        setDiscount(+e)
    }

    const columns = [
        {
            title: '',
            dataIndex: 'image',
            render: (src: any) => <Image src={src} width={40} />
        },
        {
            title: '',
            dataIndex: 'product_name',
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
                style={{ color: "#ee4d2d" }}
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
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <div>
                            <div>
                                <Typography.Text>Tạm tính: </Typography.Text><NumberFormat
                                    value={amount}
                                    displayType={'text'}
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={"đ"}
                                    style={{
                                        fontSize: "1rem",
                                        color: "#ee4d2d",
                                    }}
                                />
                            </div>
                            <div>
                                <Typography.Text>Phí ship: </Typography.Text><NumberFormat
                                    value={fee}
                                    displayType={'text'}
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    prefix={"đ"}
                                />
                            </div>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <Typography.Text>Thành tiền: </Typography.Text><NumberFormat
                                value={amount + fee}
                                displayType={'text'}
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                prefix={"đ"}
                                style={{
                                    fontSize: "1.5rem",
                                    color: "#ee4d2d",
                                    marginLeft: "0.5rem",
                                    fontWeight: 600
                                }}
                            />
                        </div>
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
                            rules={[{ required: true }]}

                        >
                            <Input placeholder="Tên khách hàng" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="customer_phone"
                            rules={[
                                {
                                    required: true,
                                    validator: (_, value) =>
                                        /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value) ? Promise.resolve() : Promise.reject("Số điện thoại không đúng định dạng!"),
                                },
                            ]}
                        >
                            <Input placeholder="Số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="customer_email"
                        >
                            <Input placeholder="Địa chỉ email" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="province"
                            rules={[{ required: true }]}
                        >
                            <Select loading={isLoading} onChange={handleProvinceChange} placeholder="Tỉnh/Thành Phố">
                                {provinces.map((province: any) => (
                                    <Select.Option key={province.code} value={JSON.stringify(province)}>{province.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="district"
                            rules={[{ required: true }]}
                        >
                            <Select loading={isLoading} onChange={handleDistrictChange} placeholder="Quận/Huyện">
                                {districts.map((district: any) => (
                                    <Select.Option key={district.code} value={JSON.stringify(district)}>{district.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="commune"
                            rules={[{ required: true }]}
                        >
                            <Select loading={isLoading} placeholder="Phường/Xã">
                                {communes.map((commune: any) => (
                                    <Select.Option key={commune.code} value={JSON.stringify(commune)}>{commune.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="address"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Địa chỉ cụ thể" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="note"
                        >
                            <Input placeholder="Ghi chú khi giao hàng" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Table
                dataSource={shoppingCart}
                columns={columns}
                pagination={false}
                showHeader={false}
                size="small"
                style={{
                    overflowX: "auto",
                    maxHeight: 500
                }}
                title={() =>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Typography.Text style={{ marginRight: 10 }}>Giảm giá</Typography.Text>
                            <InputNumber
                                defaultValue={0}
                                min={0}
                                max={100}
                                formatter={value => `${value}%`}
                                parser={(value: any) => value.replace('%', '')}
                                onChange={handleDiscountChange}
                                value={discount}
                            />
                        </div>
                        <AutoComplete
                            style={{ width: 380 }}
                            options={options}
                            onSelect={onSelect}
                            onSearch={onSearch}
                            value={searchTerm}
                        >
                            <Input.Search
                                placeholder="Thêm nhanh sản phẩm"
                                enterButton
                            />
                        </AutoComplete>
                    </div>

                }
            />
        </Drawer>
    )
}

export default ShoppingCart;