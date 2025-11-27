
import { useTheme } from '@/contexts/ThemeContext';
import { Ad } from '@/types';
import React from 'react';
import { FlatList, View } from 'react-native';
import { ProductCardSmall } from './ProductCardSmall';

export default function MoreFromSellerCarousel({ ads }: { ads: Ad[] }) {
  const { spacing } = useTheme();
  return (
    <View style={{ paddingLeft: spacing.lg, marginTop: spacing.md }}>
      <FlatList
        data={ads}
        horizontal
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => <ProductCardSmall ad={item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
