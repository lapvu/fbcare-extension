import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Input, Row, message, Select } from 'antd'
import { Container } from '../../components/Container';
import { getCommune, getDistrict, getProvince, getSetting, saveSetting, Setting } from "../../api"

const validateMessages = {
    required: 'Vui lòng nhập ${label}!',
};

export const TransportPage = () => {
    const [setting, setSetting] = useState({});
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSelectLoading, setIsSelectLoading] = useState(false);
    const [isFormSetting, setIsFormSetting] = useState(false);

    useEffect(() => {
        const initSetting = async () => {
            setIsLoading(true);
            const res = await getSetting();
            const provResult = await getProvince();
            if (res.data) {
                const districtResult = await getDistrict(JSON.parse(res.data.pickup_province).code);
                const communeResult = await getCommune(JSON.parse(res.data.pickup_district).code);
                setDistricts(districtResult.data.results);
                setCommunes(communeResult.data.results);
                setSetting({
                    ...res.data,
                    pickup_province: JSON.parse(res.data.pickup_province).name,
                    pickup_district: JSON.parse(res.data.pickup_district).name,
                    pickup_commune: JSON.parse(res.data.pickup_commune).name
                });
            }
            setProvinces(provResult.data.results);
            setIsLoading(false);
        }
        initSetting();
    }, [])


    const handleProvinceChange = async (code: any) => {
        setIsSelectLoading(true);
        setDistricts([]);
        const res = await getDistrict(code);
        setDistricts(res.data.results);
        setIsSelectLoading(false);
    };

    const handleDistrictChange = async (code: any) => {
        setIsSelectLoading(true);
        setCommunes([]);
        const res = await getCommune(code);
        setCommunes(res.data.results);
        setIsSelectLoading(false);
    };

    const onFinish = async (values: Setting) => {
        setIsFormSetting(true);
        const res = await saveSetting({
            ...values,
            pickup_province: JSON.stringify(provinces.filter((e: any) => e.code === values.pickup_province)[0]),
            pickup_district: JSON.stringify(districts.filter((e: any) => e.code === values.pickup_district)[0]),
            pickup_commune: JSON.stringify(communes.filter((e: any) => e.code === values.pickup_commune)[0]),
        });
        if (res.data) {
            message.success('Cài đặt thành công!');
        }
        setIsFormSetting(false);
    }

    return (
        <Container>
            <Row>
                <Col span={12} offset={6}>
                    <Card title="Cài đặt vận chuyển SuperShip" loading={isLoading}>
                        <Form layout="vertical" onFinish={onFinish} initialValues={setting} validateMessages={validateMessages}>
                            <Form.Item name="access_token" label="Access Token" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="pickup_phone"
                                label="Số điện thoại"
                                rules={[
                                    {
                                        required: true,
                                        validator: (_, value) =>
                                            /(03|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(value) ? Promise.resolve() : Promise.reject("Số điện thoại không đúng định dạng!"),
                                    },

                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Row gutter={24}>
                                <Col span={8}>
                                    <Form.Item name="pickup_province" label="Tỉnh/Thành Phố" rules={[{ required: true }]}>
                                        <Select loading={isSelectLoading} onChange={handleProvinceChange}>
                                            {provinces.map((province: any) => (
                                                <Select.Option key={province.code} value={province.code}>{province.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="pickup_district" label="Quận/Huyện" rules={[{ required: true }]}>
                                        <Select loading={isSelectLoading} onChange={handleDistrictChange}>
                                            {districts.map((district: any) => (
                                                <Select.Option key={district.code} value={district.code}>{district.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="pickup_commune" label="Phường/Xã" rules={[{ required: true }]}>
                                        <Select loading={isSelectLoading}>
                                            {communes.map((commune: any) => (
                                                <Select.Option key={commune.code} value={commune.code}>{commune.name}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="pickup_address" label="Địa chỉ cụ thể" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" type="primary" block loading={isFormSetting}>Lưu</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container >
    )
}
