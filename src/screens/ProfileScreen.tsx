import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Switch,
  Divider,
  Portal,
  Dialog,
  RadioButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SyncStatusIndicator from '../components/SyncStatusIndicator';
import { getPendingActivityCount } from '../services/syncService';

interface UserPreferences {
  units: 'metric' | 'imperial';
  notifications: boolean;
}

const PREFERENCES_KEY = '@carbon_tracker_preferences';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { activities, syncStatus, syncPendingActivities, isConnected } = useActivity();
  const [preferences, setPreferences] = useState<UserPreferences>({
    units: 'metric',
    notifications: false,
  });
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [unitsDialogVisible, setUnitsDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  // Save preferences whenever they change
  useEffect(() => {
    savePreferences();
  }, [preferences]);

  // Update pending count periodically
  useEffect(() => {
    const updatePendingCount = async () => {
      const count = await getPendingActivityCount();
      setPendingCount(count);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleLogout = async () => {
    setLogoutDialogVisible(false);
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Convert activities to CSV format
      const csvHeader = 'Date,Type,Description,Emissions (kg CO2),Synced\n';
      const csvRows = activities.map((activity) => {
        const date = new Date(activity.date).toISOString().split('T')[0];
        const type = activity.type;
        const description = activity.description.replace(/,/g, ';'); // Replace commas to avoid CSV issues
        const emissions = activity.emissionKg.toFixed(2);
        const synced = activity.synced ? 'Yes' : 'No';
        return `${date},${type},${description},${emissions},${synced}`;
      }).join('\n');

      const csvContent = csvHeader + csvRows;

      // Create a summary
      const totalEmissions = activities.reduce((sum, a) => sum + a.emissionKg, 0);
      const summary = `Carbon Footprint Data Export\n` +
        `User: ${user?.email}\n` +
        `Export Date: ${new Date().toLocaleDateString()}\n` +
        `Total Activities: ${activities.length}\n` +
        `Total Emissions: ${totalEmissions.toFixed(2)} kg CO2\n\n` +
        `${csvContent}`;

      // Share the data
      await Share.share({
        message: summary,
        title: 'Carbon Footprint Data',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  const toggleNotifications = () => {
    setPreferences((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  const handleUnitsChange = (newUnits: 'metric' | 'imperial') => {
    setPreferences((prev) => ({
      ...prev,
      units: newUnits,
    }));
    setUnitsDialogVisible(false);
  };

  const handleManualSync = async () => {
    if (!isConnected) {
      Alert.alert('No Connection', 'Please connect to the internet to sync your data.');
      return;
    }

    if (pendingCount === 0) {
      Alert.alert('Already Synced', 'All your activities are already synced.');
      return;
    }

    setSyncing(true);
    try {
      await syncPendingActivities();
      Alert.alert('Success', 'Your activities have been synced successfully.');
    } catch (error) {
      Alert.alert('Sync Failed', 'Failed to sync activities. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Information Card */}
      <Card style={styles.card}>
        <Card.Content style={styles.userInfoContent}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account-circle" size={80} color="#4CAF50" />
          </View>
          <Title style={styles.userName}>{user?.email}</Title>
          <Paragraph style={styles.userDetail}>
            Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Statistics Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Statistics</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activities.length}</Text>
              <Text style={styles.statLabel}>Activities Logged</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {activities.reduce((sum, a) => sum + a.emissionKg, 0).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Total kg CO₂</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Settings Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Settings</Title>

          <List.Item
            title="Units"
            description={preferences.units === 'metric' ? 'Metric (kg, km)' : 'Imperial (lbs, miles)'}
            left={(props) => <List.Icon {...props} icon="ruler" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setUnitsDialogVisible(true)}
            style={styles.listItem}
          />

          <Divider />

          <List.Item
            title="Notifications"
            description="Receive reminders and insights"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={preferences.notifications}
                onValueChange={toggleNotifications}
                color="#4CAF50"
              />
            )}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Sync Status Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Sync Status</Title>

          <View style={styles.syncStatusContainer}>
            <View style={styles.syncStatusRow}>
              <Text style={styles.syncStatusLabel}>Current Status:</Text>
              <SyncStatusIndicator status={syncStatus} pendingCount={pendingCount} />
            </View>

            {pendingCount > 0 && (
              <View style={styles.syncInfoContainer}>
                <MaterialCommunityIcons name="information" size={16} color="#FF9800" />
                <Text style={styles.syncInfoText}>
                  {pendingCount} {pendingCount === 1 ? 'activity' : 'activities'} waiting to sync
                </Text>
              </View>
            )}

            <Button
              mode="outlined"
              onPress={handleManualSync}
              icon="sync"
              style={styles.syncButton}
              disabled={!isConnected || syncing || pendingCount === 0}
              loading={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Data Management Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Data Management</Title>

          <List.Item
            title="Export Data"
            description="Download your activity data"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={handleExportData}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={() => setLogoutDialogVisible(true)}
          icon="logout"
          style={styles.logoutButton}
          buttonColor="#d32f2f"
          loading={loading}
          disabled={loading}
        >
          Logout
        </Button>
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>Carbon Footprint Tracker</Text>
        <Text style={styles.appInfoText}>Version 1.0.0</Text>
      </View>

      {/* Logout Confirmation Dialog */}
      <Portal>
        <Dialog visible={logoutDialogVisible} onDismiss={() => setLogoutDialogVisible(false)}>
          <Dialog.Title>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to logout?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLogoutDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleLogout} textColor="#d32f2f">
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Units Selection Dialog */}
      <Portal>
        <Dialog visible={unitsDialogVisible} onDismiss={() => setUnitsDialogVisible(false)}>
          <Dialog.Title>Select Units</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => handleUnitsChange(value as 'metric' | 'imperial')}
              value={preferences.units}
            >
              <RadioButton.Item label="Metric (kg, km)" value="metric" />
              <RadioButton.Item label="Imperial (lbs, miles)" value="imperial" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setUnitsDialogVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  userInfoContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  listItem: {
    paddingVertical: 4,
  },
  syncStatusContainer: {
    paddingVertical: 8,
  },
  syncStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  syncStatusLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  syncInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  syncInfoText: {
    fontSize: 13,
    color: '#E65100',
    flex: 1,
  },
  syncButton: {
    borderRadius: 8,
    marginTop: 4,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  logoutButton: {
    borderRadius: 8,
    paddingVertical: 4,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 32,
  },
  appInfoText: {
    fontSize: 12,
    color: '#999',
    marginVertical: 2,
  },
});

export default ProfileScreen;
