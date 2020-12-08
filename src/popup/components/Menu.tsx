import React, { forwardRef } from 'react'
import { Menu } from 'antd'
import { useDispatch } from 'react-redux'
import { LockOutlined, LogoutOutlined } from '@ant-design/icons';
import { logout } from "../redux/auth";

export const UserMenu = forwardRef(() => {
    const dispatch = useDispatch();
    return (
        <Menu style={{ background: "#001529", color: "#fff" }}>
            <Menu.Item icon={<LockOutlined />}>Đổi mật khẩu</Menu.Item>
            <Menu.Item onClick={() => dispatch(logout())} icon={<LogoutOutlined />}>Đăng xuất</Menu.Item>
        </Menu>
    )
})
