import React, { useState } from "react"
import { Dropdown, Layout, Avatar } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import { Sidebar } from './Sidebar';
import { UserMenu } from "./Menu";
import "./style.css";

const { Header, Content } = Layout;

export const MyLayout = ({ children }: any) => {
    const [collapsed, setCollapsed] = useState(true);
    const location = useLocation();
    return (
        <Layout className="my-layout">
            {location.pathname !== "/" && <Sidebar collapsed={collapsed} />}
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: location.pathname === "/" ? "flex-end" : "space-between",
                    borderBottom: "1px solid #dfdfdf",
                }}>
                    {
                        location.pathname !== "/" && React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })
                    }
                    <div style={{
                        margin: "0 24px"
                    }}>
                        <Dropdown overlay={<UserMenu />} placement="bottomLeft" arrow>
                            <Avatar
                                style={{
                                    color: '#f56a00',
                                    backgroundColor: '#fde3cf',
                                    cursor: "pointer"
                                }}>U
                                  </Avatar>
                        </Dropdown>
                    </div>
                </Header>
                <Content
                    className="site-layout-background"
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}
