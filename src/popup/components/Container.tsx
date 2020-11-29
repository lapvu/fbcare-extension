import React from 'react'

export const Container = ({ children }: any) => {
    return (
        <div style={{
            margin: "1rem",
            padding: "1rem"
        }}>
            {children}
        </div>
    )
}
