import React, { FC, useEffect, useState } from "react"
import NumberFormat from 'react-number-format';
import { Table, Modal, Image } from "antd";
import { getProducts } from '../../../api';

const columns = [
    {
        title: '',
        dataIndex: '_id',
        key: '_id',
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: 'Giá tiền',
        key: 'price',
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
]

const SelectProductModal: FC<{
    showModal: any,
    setShowModal: any,
    setShoppingCart: any,
    shoppingCart: any,
}> = ({ showModal, setShowModal, setShoppingCart, shoppingCart }) => {
    const [products, setProducts] = useState([])
    const [productsSelected, setProductsSelected] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(1);
    const [pageSize] = useState(5);

    useEffect(() => {
        const initProducts = async () => {
            setIsLoading(true);
            const res = await getProducts({ limit: 10, offset });
            setProducts(res.data.products);
            setTotal(res.data.total);
            setIsLoading(false)
        }
        initProducts()
    }, [])

    const handlePageChange = (page: number) => {
        setOffset((page - 1) * pageSize);
    }

    const onChange = (_: any, selectedRows: Array<any>) => {
        let copy = [...shoppingCart];
        let listId = copy.map((e: any) => e._id);
        selectedRows.forEach((e: any, i: number) => {
            if (listId.includes(e._id)) {
                copy[i].quantity++;
            } else {
                e.quantity = 1;
                copy.push(e);
            }
        })

        setProductsSelected(copy as any)
    }

    const handleOk = () => {
        setShoppingCart(productsSelected);
        setShowModal(false);
    }

    return (
        <Modal
            title="Sản phẩm"
            cancelText="Hủy"
            okText="Thêm vào giỏ"
            centered
            visible={showModal}
            onOk={handleOk}
            onCancel={() => setShowModal(false)}
            width={1000}
            maskClosable={false}
        >
            <Table
                dataSource={products}
                columns={columns}
                rowKey={(record: any) => record && record._id}
                loading={isLoading}
                rowSelection={{
                    type: "checkbox",
                    onChange
                }}
                pagination={{
                    pageSize,
                    total,
                    onChange: handlePageChange
                }}
            />
        </Modal>
    )
}

export default SelectProductModal;