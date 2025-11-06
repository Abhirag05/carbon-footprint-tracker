import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Portal,
  Dialog,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { activities } = useActivity();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

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
    setExporting(true);
    try {
      // Calculate statistics
      const totalEmissions = activities.reduce((sum, a) => sum + a.emissionKg, 0);
      const avgEmissions = activities.length > 0 ? totalEmissions / activities.length : 0;

      // Group by type
      const byType = activities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + activity.emissionKg;
        return acc;
      }, {} as Record<string, number>);

      // Sort activities by date (most recent first)
      const sortedActivities = [...activities].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Generate HTML for PDF
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Carbon Footprint Report</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                color: #333;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 3px solid #9b0302;
                padding-bottom: 20px;
              }
              .header h1 {
                color: #9b0302;
                margin: 0;
                font-size: 28px;
              }
              .header p {
                color: #666;
                margin: 5px 0;
              }
              .summary {
                background-color: #f5f5f5;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 30px;
              }
              .summary h2 {
                color: #9b0302;
                margin-top: 0;
                font-size: 20px;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                margin-top: 15px;
              }
              .stat-box {
                background: white;
                padding: 15px;
                border-radius: 6px;
                border-left: 4px solid #9b0302;
              }
              .stat-label {
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
              }
              .stat-value {
                color: #9b0302;
                font-size: 24px;
                font-weight: bold;
                margin-top: 5px;
              }
              .breakdown {
                margin-bottom: 30px;
              }
              .breakdown h2 {
                color: #9b0302;
                font-size: 20px;
              }
              .breakdown-item {
                display: flex;
                justify-content: space-between;
                padding: 10px;
                border-bottom: 1px solid #e0e0e0;
              }
              .breakdown-item:last-child {
                border-bottom: none;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              th {
                background-color: #9b0302;
                color: white;
                padding: 12px;
                text-align: left;
                font-size: 14px;
              }
              td {
                padding: 10px 12px;
                border-bottom: 1px solid #e0e0e0;
                font-size: 13px;
              }
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              .footer {
                margin-top: 40px;
                text-align: center;
                color: #999;
                font-size: 12px;
                border-top: 1px solid #e0e0e0;
                padding-top: 20px;
              }
              .type-badge {
                display: inline-block;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
              }
              .type-transportation { background-color: #0c2d55; color: white; }
              .type-energy { background-color: #FF9800; color: white; }
              .type-food { background-color: #9b0302; color: white; }
              .type-waste { background-color: #9C27B0; color: white; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌍 MarianTrack Carbon Footprint Report</h1>
              <p><strong>User:</strong> ${user?.email || 'N/A'}</p>
              <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
            </div>

            <div class="summary">
              <h2>📊 Summary Statistics</h2>
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-label">Total Activities</div>
                  <div class="stat-value">${activities.length}</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Total Emissions</div>
                  <div class="stat-value">${totalEmissions.toFixed(2)} kg</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Average per Activity</div>
                  <div class="stat-value">${avgEmissions.toFixed(2)} kg</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Member Since</div>
                  <div class="stat-value" style="font-size: 16px;">
                    ${user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div class="breakdown">
              <h2>📈 Emissions by Category</h2>
              ${Object.entries(byType).map(([type, emissions]) => `
                <div class="breakdown-item">
                  <span><strong>${type.charAt(0).toUpperCase() + type.slice(1)}</strong></span>
                  <span><strong>${emissions.toFixed(2)} kg CO₂</strong> (${((emissions / totalEmissions) * 100).toFixed(1)}%)</span>
                </div>
              `).join('')}
            </div>

            <div>
              <h2>📋 Activity Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Emissions (kg CO₂)</th>
                  </tr>
                </thead>
                <tbody>
                  ${sortedActivities.map(activity => `
                    <tr>
                      <td>${new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td><span class="type-badge type-${activity.type}">${activity.type}</span></td>
                      <td>${activity.description}</td>
                      <td><strong>${activity.emissionKg.toFixed(2)}</strong></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="footer">
              <p><strong>MarianTrack</strong> - Carbon Footprint Tracker v1.0.0</p>
              <p>Track your environmental impact and make a difference</p>
            </div>
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html });

      // Share/Download the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Carbon Footprint Report',
          UTI: 'com.adobe.pdf',
        });
        Alert.alert('Success', 'Your report has been generated and is ready to download!');
      } else {
        Alert.alert('Success', 'PDF generated successfully!');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Error', 'Failed to generate PDF report. Please try again.');
    } finally {
      setExporting(false);
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
            <MaterialCommunityIcons name="account-circle" size={80} color="#9b0302" />
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

      {/* Data Management Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Data Management</Title>

          <List.Item
            title="Export Data"
            description="Download PDF report of your activities"
            left={(props) => <List.Icon {...props} icon="file-pdf-box" />}
            right={(props) =>
              exporting ? (
                <MaterialCommunityIcons name="loading" size={24} color="#9b0302" />
              ) : (
                <List.Icon {...props} icon="chevron-right" />
              )
            }
            onPress={handleExportData}
            disabled={exporting || activities.length === 0}
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
    color: '#9b0302',
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
