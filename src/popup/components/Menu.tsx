import React, { forwardRef } from 'react'
import { Menu } from 'antd'
import { useDispatch } from 'react-redux'
import { LockOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { logout } from "../redux/auth";
import { useHistory } from 'react-router-dom';

export const UserMenu = forwardRef(() => {
    const dispatch = useDispatch();
    const history = useHistory();
    return (
        <Menu style={{ background: "#001529", color: "#fff" }}>
            <Menu.Item icon={<UserOutlined />} onClick={() => history.push("/profile")}>Cá nhân</Menu.Item>
            <Menu.Item icon={<LockOutlined />}>Đổi mật khẩu</Menu.Item>
            <Menu.Item onClick={() => dispatch(logout())} icon={<LogoutOutlined />}>Đăng xuất</Menu.Item>
        </Menu>
    )
})
