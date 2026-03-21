import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAgent = user?.role === 'agent';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Xin chào,</Text>
            <Text style={styles.userName}>{user?.fullName || 'Người dùng'} {isAgent ? '💼' : '👋'}</Text>
          </View>
          <Pressable style={styles.notifBtn} onPress={() => navigation.navigate('SellerAgentMain', { screen: 'Notifications' } as any)}>
            <Ionicons name="notifications-outline" size={24} color="#1e293b" />
          </Pressable>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
            <Text style={[styles.statValue, { color: '#16a34a' }]}>12</Text>
            <Text style={styles.statLabel}>Tin đăng</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
            <Text style={[styles.statValue, { color: '#2563eb' }]}>450</Text>
            <Text style={styles.statLabel}>Lượt xem</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fff7ed' }]}>
            <Text style={[styles.statValue, { color: '#ea580c' }]}>5</Text>
            <Text style={styles.statLabel}>Liên hệ</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Lối tắt</Text>
        <View style={styles.grid}>
          <Pressable 
            style={styles.gridItem}
            onPress={() => navigation.navigate('SellerAgentMain', { screen: 'CreateProperty' } as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="add-circle" size={28} color="#0ea5e9" />
            </View>
            <Text style={styles.gridText}>Đăng tin mới</Text>
          </Pressable>

          <Pressable 
            style={styles.gridItem}
            onPress={() => navigation.navigate('AssignmentList')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="document-text" size={28} color="#d97706" />
            </View>
            <Text style={styles.gridText}>Yêu cầu quản lý</Text>
          </Pressable>

          {isAgent ? (
             <Pressable 
              style={styles.gridItem}
              onPress={() => navigation.navigate('PublicPropertyExplore')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#fae8ff' }]}>
                <Ionicons name="search" size={28} color="#d946ef" />
              </View>
              <Text style={styles.gridText}>Khám phá BĐS</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.gridItem} onPress={() => navigation.navigate('AgentList')}>
              <View style={[styles.iconBox, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="people" size={28} color="#22c55e" />
              </View>
              <Text style={styles.gridText}>Tìm Môi giới</Text>
            </Pressable>
          )}

          <Pressable style={styles.gridItem} onPress={() => navigation.navigate('SellerAgentMain', { screen: 'MyProperties' } as any)}>
            <View style={[styles.iconBox, { backgroundColor: '#fff1f2' }]}>
              <Ionicons name="pricetags" size={28} color="#f43f5e" />
            </View>
            <Text style={styles.gridText}>{isAgent ? 'BĐS đang quản lý' : 'BĐS của tôi'}</Text>
          </Pressable>

          <Pressable style={styles.gridItem}>
            <View style={[styles.iconBox, { backgroundColor: '#faf5ff' }]}>
              <Ionicons name="analytics" size={28} color="#a855f7" />
            </View>
            <Text style={styles.gridText}>Báo cáo</Text>
          </Pressable>
        </View>

        {/* Recent Activity Placeholder */}
        <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
        <View style={styles.emptyActivity}>
          <Ionicons name="list" size={40} color="#e2e8f0" />
          <Text style={styles.emptyText}>Chưa có hoạt động nào mới</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  emptyActivity: {
    height: 120,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
  },
});
