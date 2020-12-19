import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { PageHeader, Space, Table, Image, Button, Popconfirm, message, Typography } from 'antd';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import { format } from 'date-fns'
import { deleteProduct, getProducts } from "../../api";

export const ListProductPage = () => {
    const [total, setTotal] = useState(1);
    const [pageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);

    const deletePro = async (id: string) => {
        const res = await deleteProduct(id);
        if (res.data) {
            message.success("Xóa sản phẩm thành công!");
            const copy = products.filter((e: any) => e._id !== id);
            setProducts(copy);
        }
    }

    const columns = [
        {
            title: 'Mã sản phẩm',
            dataIndex: '_id',
            key: '_id',
            render: (id: any) => <Link to={`/product/${id}`}>{id}</Link>,
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product_name',
            key: 'product_name',
        },
        {
            title: 'Giá tiền',
            key: 'price',
            dataIndex: 'price',
            render: (text: string) => <NumberFormat
                value={text}
                displayType={'text'}
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={"đ "}
            />
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => <Typography.Text>{format(new Date(text), 'MM/dd/yyyy')}</Typography.Text>
        },
        {
            title: 'Ảnh',
            key: 'image',
            dataIndex: 'image',
            render: (text: string) => (
                <Image src={text} width={50} />

            ),
        },
        {
            title: '',
            key: 'action',
            render: (text: string, record: any) => (
                <Space size="middle">
                    <Link to={`/product/${record._id}`}><Button icon={<EyeOutlined />} /></Link>
                    <Popconfirm
                        placement="top"
                        title="Bạn có muốn xóa sản phẩm này?"
                        onConfirm={() => deletePro(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button icon={<DeleteOutlined />} type="primary" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const getProductsApi = async () => {
            setIsLoading(true);
            const res = await getProducts({ limit: pageSize, offset });
            setProducts(res.data.products);
            setTotal(res.data.total);
            setIsLoading(false);
        }
        getProductsApi();
    }, [offset])

    const onchangePage = (page: number) => {
        setOffset((page - 1) * pageSize);
    }

    return (
        <>
            <PageHeader
                className="site-page-header"
                title="Danh sách sản phẩm"
                ghost={false}
                extra={[
                    <Link to="/product/create" key={1}><Button type="primary">Thêm sản phẩm</Button></Link>
                ]}
            />
            <Table
                loading={isLoading}
                columns={columns}
                size="small"
                pagination={{
                    pageSize: 5,
                    defaultCurrent: 1,
                    total,
                    showSizeChanger: false,
                    onChange: onchangePage
                }}
                dataSource={products}
                rowKey={record => record && record._id}
            />
        </>
    )
}
