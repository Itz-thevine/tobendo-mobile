import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/query-core';

const HomeScreen = () => {
  
  return (
    <SafeAreaView>
      <Text>Home</Text>
    </SafeAreaView>
  );
};


const Home = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <HomeScreen />
    </QueryClientProvider>
  );
};

export default Home;
