import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { MoneyCollectOutlined, DollarCircleOutlined, FundOutlined, ExclamationCircleOutlined, StopOutlined, TrophyOutlined, CheckOutlined, NumberOutlined, ThunderboltOutlined } from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import Loader from './Loader';
import LineChart from './LineChart';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoDetails = () => {
  const { coinId } = useParams();
  const [timeperiod, setTimeperiod] = useState('7d');
  const { data, isFetching } = useGetCryptoDetailsQuery(coinId);
  const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timeperiod });
  const cryptoDetails = data?.data?.coin;

  if (isFetching) return <Loader />;

  const time = ['3h', '24h', '7d', '30d', '1y', '3m', '3y', '5y'];

  const stats = [
    { title: 'Price to USD', value: `$ ${cryptoDetails?.price && millify(cryptoDetails?.price)}`, icon: <DollarCircleOutlined /> },
    { title: 'Rank', value: cryptoDetails?.rank, icon: <NumberOutlined /> },
    { title: '24h Volume', value: `$ ${cryptoDetails?.volume && millify(cryptoDetails?.volume)}`, icon: <ThunderboltOutlined /> },
    { title: 'Market Cap', value: `$ ${cryptoDetails?.marketCap && millify(cryptoDetails?.marketCap)}`, icon: <DollarCircleOutlined /> },
    { title: 'All-time-high(daily avg.)', value: `$ ${cryptoDetails?.allTimeHigh?.price && millify(cryptoDetails?.allTimeHigh?.price)}`, icon: <TrophyOutlined /> },
  ];

  const genericStats = [
    { title: 'Number Of Markets', value: cryptoDetails?.numberOfMarkets, icon: <FundOutlined /> },
    { title: 'Number Of Exchanges', value: cryptoDetails?.numberOfExchanges, icon: <MoneyCollectOutlined /> },
    { title: 'Aprroved Supply', value: cryptoDetails?.supply?.confirmed ? <CheckOutlined /> : <StopOutlined />, icon: <ExclamationCircleOutlined /> },
    { title: 'Total Supply', value: `$ ${cryptoDetails?.supply?.total && millify(cryptoDetails?.supply?.total)}`, icon: <ExclamationCircleOutlined /> },
    { title: 'Circulating Supply', value: `$ ${cryptoDetails?.supply?.circulating && millify(cryptoDetails?.supply?.circulating)}`, icon: <ExclamationCircleOutlined /> },
  ];

  return (
    <Col className="coin-detail-container max-w-4xl mx-auto p-4">
      <Col className="coin-heading-container mb-6">
        <Title level={2} className="coin-name text-3xl font-bold text-blue-700 mb-2">
          {data?.data?.coin.name} ({data?.data?.coin.symbol}) Price
        </Title>
        <p className="text-gray-600">{cryptoDetails.name} live price in US Dollar (USD). View value statistics, market cap and supply.</p>
      </Col>
      <Select defaultValue="7d" className="select-timeperiod mb-6 w-40" placeholder="Select Timeperiod" onChange={(value) => setTimeperiod(value)}>
        {time.map((date) => <Option key={date}>{date}</Option>)}
      </Select>
      <div className="mb-8">
        <LineChart coinHistory={coinHistory} currentPrice={millify(cryptoDetails?.price)} coinName={cryptoDetails?.name} />
      </div>
      <Col className="stats-container grid grid-cols-1 md:grid-cols-2 gap-8">
        <Col className="coin-value-statistics bg-white rounded-lg shadow p-6">
          <Col className="coin-value-statistics-heading mb-4">
            <Title level={3} className="coin-details-heading text-xl font-semibold text-gray-800">{cryptoDetails.name} Value Statistics</Title>
            <p className="text-gray-500">An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {stats.map(({ icon, title, value }) => (
            <Col className="coin-stats flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <Col className="coin-stats-name flex items-center space-x-2">
                <Text className="text-blue-500">{icon}</Text>
                <Text className="text-gray-600">{title}</Text>
              </Col>
              <Text className="stats font-semibold text-gray-800">{value}</Text>
            </Col>
          ))}
        </Col>
        <Col className="other-stats-info bg-white rounded-lg shadow p-6">
          <Col className="coin-value-statistics-heading mb-4">
            <Title level={3} className="coin-details-heading text-xl font-semibold text-gray-800">Other Stats Info</Title>
            <p className="text-gray-500">An overview showing the statistics of {cryptoDetails.name}, such as the base and quote currency, the rank, and trading volume.</p>
          </Col>
          {genericStats.map(({ icon, title, value }) => (
            <Col className="coin-stats flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <Col className="coin-stats-name flex items-center space-x-2">
                <Text className="text-blue-500">{icon}</Text>
                <Text className="text-gray-600">{title}</Text>
              </Col>
              <Text className="stats font-semibold text-gray-800">{value}</Text>
            </Col>
          ))}
        </Col>
      </Col>
      <Col className="coin-desc-link mt-8">
        <Row className="coin-desc bg-white rounded-lg shadow p-6 mb-8">
          <Title level={3} className="coin-details-heading text-xl font-semibold text-gray-800 mb-4">What is {cryptoDetails.name}?</Title>
          <div className="prose max-w-none">{HTMLReactParser(cryptoDetails.description)}</div>
        </Row>
        <Col className="coin-links bg-white rounded-lg shadow p-6">
          <Title level={3} className="coin-details-heading text-xl font-semibold text-gray-800 mb-4">{cryptoDetails.name} Links</Title>
          {cryptoDetails.links?.map((link) => (
            <Row className="coin-link flex items-center justify-between py-3 border-b border-gray-100 last:border-0" key={link.name}>
              <Title level={5} className="link-name text-gray-600 m-0">{link.type}</Title>
              <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{link.name}</a>
            </Row>
          ))}
        </Col>
      </Col>
    </Col>
  );
};

export default CryptoDetails;
