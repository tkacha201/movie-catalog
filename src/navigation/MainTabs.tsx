import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import BrowseScreen from '../screens/BrowseScreen';
import MyMoviesScreen from '../screens/MyMoviesScreen';
import UpcomingScreen from '../screens/UpcomingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors } from '../theme/colors';
import type { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

const TAB_ICONS: Record<keyof MainTabsParamList, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
  Browse: { focused: 'film', default: 'film-outline' },
  MyMovies: { focused: 'heart', default: 'heart-outline' },
  Upcoming: { focused: 'calendar', default: 'calendar-outline' },
  Profile: { focused: 'person', default: 'person-outline' },
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.default;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
        },
      })}
    >
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen
        name="MyMovies"
        component={MyMoviesScreen}
        options={{ tabBarLabel: 'My Movies' }}
      />
      <Tab.Screen name="Upcoming" component={UpcomingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
