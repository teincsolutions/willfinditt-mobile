// components/product/ProductInfoBlock.tsx
import AppText from '@/components/ui/AppText';
import { useTheme } from '@/contexts/ThemeContext';
import { Ad } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import AppView from '../ui/AppView';

export function AdInfoBlock({ ad }: { ad: Ad }) {
  const { spacing, } = useTheme();

  return (
    <AppView style={{ paddingHorizontal: spacing.lg, paddingTop: 12 }}>
      <AppText variant="xxl" style={{ fontWeight: '700' }}>{ad.title}</AppText>
      <AppView style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
        <AppText variant="sm" style={{ opacity: 0.7 }}>{ad.city?.name || 'Unknown'}</AppText>
        <AppText variant="lg" style={{ fontWeight: '700' }}>{ad.currency}{ad.price ?? ''}</AppText>
      </AppView>

      {/* thumbnails */}
      <FlatList
        data={ad.images || []}
        horizontal
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.thumb} />}
        contentContainerStyle={{ marginTop: spacing.md }}
        showsHorizontalScrollIndicator={false}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
});
