import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaCube, FaNetworkWired, FaSpinner } from 'react-icons/fa';
import type { IconType } from 'react-icons';

import SearchBar from '../components/SearchBar';
import { getBlock, getNetworkStatus } from '../utils/web3';

const FaCubeIcon = FaCube as unknown as IconType;

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
  color: #3498db;
`;

const StatTitle = styled.h2`
  font-size: 1.2rem;
  color: #2c3e50;
  margin: 0;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
`;

const StatusIndicator = styled.div<{ isHealthy: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${(props: { isHealthy: boolean }) => props.isHealthy ? '#e8f5e9' : '#ffebee'};
  color: ${(props: { isHealthy: boolean }) => props.isHealthy ? '#2e7d32' : '#c62828'};
  font-weight: 500;
`;

const SpinnerWrapper = styled.div`
  display: inline-block;
  animation: spin 1s linear infinite;
  @keyframes spin {
    100% { transform: rotate(360deg); }
  }
`;

const Home = () => {
  const [blockNum, setBlockNum] = useState<string>('');
  const [networkStatus, setNetworkStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlock = async () => {
    try {
      const latestBlock = await getBlock();
      setBlockNum(latestBlock.number.toString());
    } catch (error) {
      console.error('Error fetching latest block:', error);
    }
  };

  const fetchNetworkStatus = async () => {
    try {
      const networkStatus = await getNetworkStatus();
      setNetworkStatus(networkStatus);
    } catch (error) {
      console.error('Error fetching network status:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBlock(), fetchNetworkStatus()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <HomeContainer>
      <Header>
        <Title>Kaia Chain Explorer</Title>
        <Subtitle>Explore and monitor the Kaia blockchain network</Subtitle>
      </Header>

      <SearchBar />

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatIcon>
              <FaCubeIcon size={24} />
            </StatIcon>
            <StatTitle>Latest Block</StatTitle>
          </StatHeader>
          <StatValue>
            {isLoading ? (
              <SpinnerWrapper>
                <FaSpinner size={24} />
              </SpinnerWrapper>
            ) : (
              blockNum || 'N/A'
            )}
          </StatValue>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatIcon>
              <FaNetworkWired size={24} />
            </StatIcon>
            <StatTitle>Network Status</StatTitle>
          </StatHeader>
          <StatValue>
            {isLoading ? (
              <SpinnerWrapper>
                <FaSpinner size={24} />
              </SpinnerWrapper>
            ) : (
              <StatusIndicator isHealthy={networkStatus}>
                {networkStatus ? 'Healthy' : 'Unhealthy'}
              </StatusIndicator>
            )}
          </StatValue>
        </StatCard>
      </StatsGrid>
    </HomeContainer>
  );
};

export default Home;
