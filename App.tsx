import React from 'react';
import { StatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlbumScreen } from './src/screens/AlbumScreen';
import { NewCaptureScreen } from './src/screens/NewCaptureScreen';
import { ExploreScreen } from './src/screens/ExploreScreen';

export type RootTabParamList = {
  Album: undefined;
  NewCapture: undefined;
  Explore: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" />
        <Tab.Navigator
          initialRouteName="Album"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#161922',
              borderTopColor: '#262936',
              minHeight: 60,
              paddingTop: 7,
              paddingBottom: 8,
            },
            tabBarActiveTintColor: '#4F70FF',
            tabBarInactiveTintColor: '#777D8F',
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
          }}
        >
          <Tab.Screen name="Album" component={AlbumScreen} options={{ title: 'Álbum', tabBarIcon: ({ color }: { color: string }) => <TabIcon symbol="▧" color={color} /> }} />
          <Tab.Screen name="NewCapture" component={NewCaptureScreen} options={{ title: 'Novo Achado', tabBarIcon: ({ color }: { color: string }) => <TabIcon symbol="＋" color={color} /> }} />
          <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: 'Explorar', tabBarIcon: ({ color }: { color: string }) => <TabIcon symbol="⌖" color={color} /> }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function TabIcon({ symbol, color }: { symbol: string; color: string }) {
  return <Text style={{ color, fontSize: 21, lineHeight: 24 }}>{symbol}</Text>;
}
