import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PlaceRepository } from '../services/PlaceRepository';
import { Place } from '../types';

const repository = new PlaceRepository();

export function AlbumScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  const loadData = useCallback(async () => setPlaces(await repository.getAll()), []);

  useFocusEffect(useCallback(() => { void loadData(); }, [loadData]));

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Excluir achado', `Deseja apagar “${title}”?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: async () => { await repository.delete(id); await loadData(); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MEU <Text style={styles.highlight}>ÁLBUM</Text></Text>
        <Text style={styles.subTitle}>{places.length} achados registrados</Text>
      </View>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.emptyBox}><Text style={styles.emptyText}>Nenhum achado no seu álbum ainda.</Text><Text style={styles.emptySubText}>Vá para “Novo Achado” para registrar.</Text></View>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.photoUri ? <Image source={{ uri: item.photoUri }} style={styles.cardImage} /> : <View style={styles.placeholderImage}><Text style={styles.placeholderText}>⌖  Apenas localização GPS</Text></View>}
            <View style={styles.cardBody}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Excluir ${item.title}`} onPress={() => handleDelete(item.id, item.title)} style={styles.deleteBtn}><Text style={styles.deleteBtnText}>Excluir</Text></TouchableOpacity>
              </View>
              {item.note ? <Text style={styles.cardNote}>{item.note}</Text> : null}
              <View style={styles.cardFooter}>
                <Text style={styles.coordsText}>{item.latitude !== null && item.longitude !== null ? `⌖ ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}` : '⌖ Sem GPS'}</Text>
                <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0E12', paddingHorizontal: 16, paddingTop: 10 },
  header: { marginBottom: 16, alignItems: 'center' }, headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', letterSpacing: 1.5 },
  highlight: { color: '#4F70FF' }, subTitle: { color: '#8A8F9E', fontSize: 12, marginTop: 2 }, listContainer: { paddingBottom: 20, flexGrow: 1 },
  emptyBox: { padding: 40, alignItems: 'center', marginTop: 48 }, emptyText: { color: '#FFF', fontSize: 15, fontWeight: '600', textAlign: 'center' }, emptySubText: { color: '#777D8F', fontSize: 12, marginTop: 6, textAlign: 'center' },
  card: { backgroundColor: '#161922', borderRadius: 12, borderWidth: 1, borderColor: '#262936', marginBottom: 14, overflow: 'hidden' }, cardImage: { width: '100%', height: 180 },
  placeholderImage: { width: '100%', height: 90, backgroundColor: '#12141C', justifyContent: 'center', alignItems: 'center' }, placeholderText: { color: '#4F70FF', fontSize: 12 }, cardBody: { padding: 12 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }, cardTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', flex: 1, marginRight: 8 },
  deleteBtn: { backgroundColor: '#2B191C', borderColor: '#FF5A5A', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }, deleteBtnText: { color: '#FF5A5A', fontSize: 11, fontWeight: '600' },
  cardNote: { color: '#A0A5B5', fontSize: 13, marginBottom: 10 }, cardFooter: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#222634' },
  coordsText: { color: '#4F70FF', fontSize: 11 }, dateText: { color: '#777D8F', fontSize: 11 },
});
