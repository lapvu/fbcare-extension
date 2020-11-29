import React from 'react'
import { Menu, Avatar } from 'antd'
import { Link, useLocation } from 'react-router-dom';

const { Item } = Menu;

export const MenuBar: React.FC<{ fbInfo: any }> = ({ fbInfo }) => {
    let location = useLocation<any>();
    return (
        <div>
            <Menu
                mode="horizontal"
                selectedKeys={[location.pathname.split("/")[2]]}
            >
                {
                    fbInfo.map((e: any, i: number) =>
                        <Item
                            key={i}
                        >
                            <Link to={`/conversation/${i}`}>
                                <Avatar src={e.avatar || e.picture.data.url} size={30} />
                                {" "}{e.name}
                            </Link>
                        </Item>)
                }
            </Menu>
        </div >
    )
}
