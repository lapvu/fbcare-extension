import React, { forwardRef } from 'react'
import { Menu } from 'antd'
import { useDispatch } from 'react-redux'
import { LogoutOutlined } from '@ant-design/icons';
import { logout } from "../redux/auth";

export const UserMenu = forwardRef(() => {
    const dispatch = useDispatch();
    return (
        <Menu>
            <Menu.Item onClick={() => dispatch(logout())} icon={<LogoutOutlined />}>Logout</Menu.Item>
        </Menu>
    )
})
