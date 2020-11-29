import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { PageHeader, Space, Table, Image, Button, Popconfirm } from 'antd'
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { deleteProduct, getProducts } from "../../api"

const columns = [
    {
        title: 'Id',
        dataIndex: '_id',
        key: '_id',
        render: (id: any) => <Link to={`/product/${id}`}>{id}</Link>,
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: 'Mô tả',
        dataIndex: 'productDesc',
        key: 'productDesc',
    },
    {
        title: 'Giá tiền',
        key: 'price',
        dataIndex: 'price',
    },
    {
        title: 'Số lượng',
        key: 'quantity',
        dataIndex: 'quantity',
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
                <Popconfirm placement="top" title="Bạn có muốn bán sản phẩm này?" onConfirm={() => deleteProduct(record._id)} okText="Xóa" cancelText="Hủy">
                    <Button icon={<DeleteOutlined />} type="primary" danger />
                </Popconfirm>
            </Space>
        ),
    },
];


export const ListProductPage = () => {
    const [total, setTotal] = useState(1);
    const [pageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);
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
                pagination={{
                    pageSize: 5,
                    defaultCurrent: 1,
                    total,
                    showSizeChanger: false,
                    onChange: onchangePage
                }}
                dataSource={products}
                rowKey={record => record && record._id}
                bordered
            />
        </>
    )
}
