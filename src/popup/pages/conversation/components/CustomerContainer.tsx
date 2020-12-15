import React, { useEffect, useState } from 'react';
import { Button, Tabs, Form, Input, Table, List, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import NumberFormat from 'react-number-format';
import { useSelector } from "react-redux";
import { getOrdersByCustomer, getNotes, addNote, deleteNote } from "../../../api"
import ShoppingCart from "./ShoppingCart";

const { TabPane } = Tabs;

export const CustomerContainer = () => {

    const state = useSelector((state: any) => state.statusReducer);

    const [visible, setVisible] = useState(false);
    const [customerId, setCustomerId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [orders, setOrders] = useState([]);
    const [notes, setNotes] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [form] = Form.useForm();

    useEffect(() => {
        setIsLoading(true);
        chrome.runtime.sendMessage({ type: "CONVERSATION_INIT" });
        const listener = function (request: any) {
            if (request.type === "CUSTOMER_CHANGE_BG") {
                setCustomerId(request.customer_id);
                setCustomerName(request.customer_name)
                setIsLoading(false);
            }
            if (request.type === "NO_CUSTOMER_ID") {
                setCustomerId("");
                setNotes([]);
                setIsLoading(false);
            }
            if (request.type === "CREATE_ORDER_PHONE") {
                setCustomerPhone(request.phone);
                setVisible(true);
            }
        }
        chrome.runtime.onMessage.addListener(listener);
        return () => chrome.runtime.onMessage.removeListener(listener);
    }, [])

    useEffect(() => {
        const initOrders = async () => {
            const res = await getOrdersByCustomer(customerId);
            if (res.data) {
                setOrders(res.data);
            }
        }
        const initNotes = async () => {
            const res = await getNotes(customerId);
            setNotes(res.data);
        }
        if (customerId) {
            initNotes();
            initOrders();
        }
    }, [customerId])

    const onFinish = async (values: any) => {
        const res = await addNote({
            customer_id: customerId,
            note: values.note
        });
        const data = res.data;
        if (data) {
            setNotes([data, ...notes]);
            form.resetFields();
        }
    }

    const removeNote = async (note_id: string) => {
        const res = await deleteNote(note_id);
        if (res.data && res.data.ok === 1) {
            const copy = notes.filter((e: any) => e._id !== note_id);
            setNotes(copy);
        } else {
            message.warn("Bạn không thể xóa ghi chú này!")
        }
    }

    const columns = [
        {
            title: '#',
            dataIndex: '_id',
            key: '_id',
            render: (text: string) => <b>{text}</b>
        },
        {
            title: 'Đơn giá',
            dataIndex: 'amount',
            key: 'amount',
            render: (text: string) => <NumberFormat
                value={text}
                displayType={'text'}
                thousandSeparator={'.'}
                decimalSeparator={','}
                prefix={"đ"}
            />
        },
        {
            title: 'Sl',
            dataIndex: 'total_quantity',
            key: 'total_quantity',
        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
            key: "status",
            render: (text: string) => <Typography.Text>
                {state.status.length !== 0 ? state.status.find((e: any) => e.key == text).value : ""}
            </Typography.Text>
        }
    ]

    return (
        <div style={{
            borderLeft: "1px solid #dadde1",
            width: "25%"
        }}>
            <div style={{
                height: "85%",
                width: "100%"
            }}>
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="Thông tin" key="1" style={{ padding: "1rem" }}>
                        <Form name="note-form" onFinish={onFinish} form={form}>
                            <Form.Item name="note">
                                <Input.TextArea
                                    placeholder="Ghi chú"
                                ></Input.TextArea>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    disabled={isLoading || customerId === "" ? true : false}
                                >
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Form>
                        <div style={{ maxHeight: 350, overflowY: "auto" }}>
                            <List
                                size="small"
                                itemLayout="horizontal"
                                dataSource={notes}
                                loading={isLoading}
                                renderItem={(item: any) => (
                                    <List.Item
                                        actions={[<Popconfirm
                                            placement="left"
                                            title="Bạn có muốn xóa ghi chú này?"
                                            key="list-remove"
                                            onConfirm={() => removeNote(item._id)}
                                            okText="Có"
                                            cancelText="Không"
                                        >
                                            <Button type="link">Xóa</Button>
                                        </Popconfirm>]}
                                    >
                                        {item.note}
                                    </List.Item>
                                )}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab="Đơn hàng" key="2">
                        <Table
                            dataSource={orders}
                            columns={columns}
                            loading={isLoading}
                            pagination={false}
                            size="small"
                        />
                    </TabPane>
                </Tabs>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "15%"
            }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setVisible(true)}
                    disabled={customerId === "" ? true : false}
                >
                    Tạo đơn hàng mới
                 </Button>
                <ShoppingCart
                    visible={visible}
                    setVisible={setVisible}
                    customerId={customerId}
                    customerName={customerName}
                    customerPhone={customerPhone}
                    setOrders={setOrders}
                    orders={orders}
                />
            </div>
        </div>
    )
}


