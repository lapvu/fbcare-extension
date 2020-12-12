import React, { useEffect, useState } from 'react'
import { PageHeader, Table, Typography } from 'antd';
import { format } from 'date-fns'
import NumberFormat from 'react-number-format';
import { useSelector } from "react-redux";
import { getOrders } from '../../api';
import { Container } from '../../components/Container';

export const OrderPage = () => {
    const state = useSelector((state: any) => state.statusReducer);

    const [total, setTotal] = useState(1);
    const [pageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const getOrdersApi = async () => {
            setIsLoading(true);
            const res = await getOrders(pageSize, offset);
            setOrders(res.data.orders);
            setTotal(res.data.total);
            setIsLoading(false);
        }
        getOrdersApi();
    }, [offset])

    const onchangePage = (page: number) => {
        setOffset((page - 1) * pageSize);
    }

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: '_id',
            key: '_id',
            render: (id: any) => <b>{id}</b>,
        },
        {
            title: 'Tổng tiền',
            key: 'amount',
            dataIndex: 'amount',
            render: (text: string) => <NumberFormat
                value={text}
                displayType={'text'}
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={"đ"}
            />
        },
        {
            title: 'Số lượng',
            dataIndex: 'total_quantity',
            key: 'total_quantity',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => <Typography.Text>
                {state.status.length !== 0 ? state.status.find((e: any) => e.key == text).value : ""}
            </Typography.Text>
        },
        {
            title: 'Tạo bởi',
            dataIndex: 'create_by',
            key: 'create_by',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => <Typography.Text>{format(new Date(text), 'MM/dd/yyyy')}</Typography.Text>
        },
    ]

    return (
        <Container>
            <PageHeader
                title="Danh sách đơn hàng"
                ghost={false}
            />
            <Table
                loading={isLoading || state.status.length === 0}
                columns={columns}
                pagination={{
                    pageSize: 5,
                    defaultCurrent: 1,
                    total,
                    showSizeChanger: false,
                    onChange: onchangePage
                }}
                dataSource={orders}
                rowKey={(record: any) => record && record._id}
            />
        </Container>
    )
}