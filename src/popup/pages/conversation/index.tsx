import { Button, Result, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { CustomerContainer } from './components/CustomerContainer'
import { MenuBar } from './components/MenuBar';

export const ConversationPage = () => {
    let { path } = useRouteMatch();
    const [fbInfo, setFbInfo] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        chrome.storage.sync.get(['fbInfo'], function (result: any) {
            setFbInfo(result['fbInfo'] ? result['fbInfo'] : []);
            setIsLoading(false);
        });
    }, [])

    if (isLoading) {
        return <div>loading...</div>
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
            {
                fbInfo.length === 0 ?
                    <Result
                        status="warning"
                        title="Bạn chưa kết nối với facebook"
                        extra={
                            <Button type="primary" key="console"><a href="https://www.facebook.com/" target="_blank">Kết nối</a></Button>
                        }
                    /> :
                    <>
                        <MenuBar fbInfo={fbInfo} />
                        <div style={{
                            display: "flex",
                            height: "100%"
                        }}>
                            <Switch>
                                <Route path={`${path}/:id`}>
                                    <MainConversationPage isLoading={isLoading} fbInfo={fbInfo} />
                                </Route>
                            </Switch>
                        </div>
                    </>
            }
        </div>
    )
}


function MainConversationPage({ isLoading, fbInfo }: any) {
    let { id } = useParams<any>();
    return <>
        <div style={{
            width: "75%",
            height: "100%"
        }}>
            {isLoading ? <Spin />
                : <iframe
                    width="100%"
                    height="100%"
                    src={fbInfo[+id].url}
                    frameBorder="0"
                >
                </iframe>}
        </div>
        <CustomerContainer />
    </>
}