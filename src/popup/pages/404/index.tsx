import { Button, Result } from 'antd'
import React from 'react'

export const NotFoundPage = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
        />
    )
}
