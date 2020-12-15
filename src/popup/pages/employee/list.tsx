import React, { useEffect, useState } from 'react'
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { PageHeader, Space, Table, Button, Popconfirm, message } from 'antd';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee } from "../../api";

export const ListEmployeePage = () => {
    const [total, setTotal] = useState(1);
    const [pageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [offset, setOffset] = useState(0);

    const deleteEmpl = async (id: string) => {
        const res = await deleteEmployee(id);
        if (res.data) {
            message.success("Xóa nhân viên thành công!");
            const copy = employees.filter((e: any) => e._id !== id);
            setEmployees(copy);
        }
    }

    const columns = [
        {
            title: 'Mã số nhân viên',
            dataIndex: '_id',
            key: '_id',
            render: (id: any) => <Link to={`/employee/${id}`}>{id}</Link>,
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'display_name',
            key: 'display_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            key: 'phone',
            dataIndex: 'phone',
        },
        {
            title: '',
            key: 'action',
            render: (text: string, record: any) => (
                <Space size="middle">
                    <Popconfirm
                        placement="top"
                        title="Bạn có muốn xóa nhân viên này?"
                        onConfirm={() => deleteEmpl(record._id)}
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
        const getEmployeesApi = async () => {
            setIsLoading(true);
            const res = await getEmployees({ limit: pageSize, offset });
            setEmployees(res.data.employees);
            setTotal(res.data.total);
            setIsLoading(false);
        }
        getEmployeesApi();
    }, [offset])

    const onchangePage = (page: number) => {
        setOffset((page - 1) * pageSize);
    }

    return (
        <>
            <PageHeader
                title="Danh sách nhân viên"
                ghost={false}
                extra={[
                    <Link to="/employee/create" key={1}><Button type="primary">Thêm nhân viên</Button></Link>
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
                dataSource={employees}
                rowKey={record => record && record._id}
            />
        </>
    )
}
