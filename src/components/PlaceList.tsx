import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Place } from '../types';
import { PlaceRepository } from '../services/PlaceRepository';

interface PlaceListProps {
  places: Place[];
  onRefresh: () => void;
}

const repository = new PlaceRepository();

export const PlaceList: React.FC<PlaceListProps> = ({ places, onRefresh }) => {
  const handleDelete = (id: string, title: string) => {
    Alert.alert('Confirmar Exclusão', `Deseja remover "${title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await repository.delete(id);
          onRefresh();
        },
      },
    ]);
  };

  if (places.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Nenhum achado registrado ainda.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Meu Álbum ({places.length})</Text>
      {places.map((item) => (
        <View key={item.id} style={styles.card}>
          {item.photoUri ? (
            <Image source={{ uri: item.photoUri }} style={styles.cardImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>Sem Foto</Text>
            </View>
          )}

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>

            {item.note ? <Text style={styles.cardNote}>{item.note}</Text> : null}

            <View style={styles.metaRow}>
              {item.latitude !== null && item.longitude !== null ? (
                <Text style={styles.coordsText}>
                  📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                </Text>
              ) : (
                <Text style={styles.coordsText}>📍 Sem GPS</Text>
              )}
              <Text style={styles.dateText}>
                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#161922',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262936',
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  placeholderImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#0D0E12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#555',
    fontSize: 12,
  },
  cardContent: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  cardNote: {
    color: '#CCC',
    fontSize: 13,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#2A1A1D',
    borderColor: '#FF5A5A',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FF5A5A',
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#222634',
  },
  coordsText: {
    color: '#4F70FF',
    fontSize: 11,
  },
  dateText: {
    color: '#777',
    fontSize: 11,
  },
});