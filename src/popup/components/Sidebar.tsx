import React, { FC } from 'react'
import { Layout as LayoutAnt, Menu } from "antd";
import { useSelector } from 'react-redux';
import { useLocation, NavLink } from 'react-router-dom';
import {
    DashboardOutlined,
    DropboxOutlined,
    NotificationOutlined,
    ReconciliationOutlined,
    RocketOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import {
    CONVERSATION_ROUTE,
    DASHBOARD_ROUTE,
    EMPLOYEE_ROUTE,
    ORDER_ROUTE, TRANSPORT_ROUTE,
    PRODUCT_ROUTE,
} from '../constant';

const { Sider } = LayoutAnt;

export const Sidebar: FC<{ collapsed: boolean }> = ({ collapsed }) => {
    const location = useLocation();
    const auth = useSelector((state: any) => state.authReducer);

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="logo">
            </div>
            <Menu theme="dark" mode="inline" selectedKeys={[`/${location.pathname.split("/")[1]}`]}>
                <Menu.Item key={DASHBOARD_ROUTE} icon={<DashboardOutlined />}>
                    <NavLink to={DASHBOARD_ROUTE}>Thống kê</NavLink>
                </Menu.Item>
                <Menu.Item key={CONVERSATION_ROUTE} icon={<NotificationOutlined />}>
                    <NavLink to={CONVERSATION_ROUTE}>Hội thoại</NavLink>
                </Menu.Item>
                {
                    auth.roles.includes("supplier") && <Menu.Item key={PRODUCT_ROUTE} icon={<DropboxOutlined />}>
                        <NavLink to={PRODUCT_ROUTE}>Sản phẩm</NavLink>
                    </Menu.Item>
                }
                <Menu.Item key={ORDER_ROUTE} icon={<ReconciliationOutlined />}>
                    <NavLink to={ORDER_ROUTE}>Đơn hàng</NavLink>
                </Menu.Item>
                {
                    auth.roles.includes("supplier") &&
                    <>
                        <Menu.Item key={EMPLOYEE_ROUTE} icon={<TeamOutlined />}>
                            <NavLink to={EMPLOYEE_ROUTE}>Nhân viên</NavLink>
                        </Menu.Item>
                        <Menu.Item key={TRANSPORT_ROUTE} icon={<RocketOutlined />}>
                            <NavLink to={TRANSPORT_ROUTE}>Vận chuyển</NavLink>
                        </Menu.Item>
                    </>
                }
            </Menu>
        </Sider >
    )
}


