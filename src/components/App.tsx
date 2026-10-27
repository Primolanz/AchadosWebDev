import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { PlaceForm } from './PlaceForm';
import { PlaceList } from './PlaceList';
import { PlaceRepository } from '../services/PlaceRepository';
import { Place } from '../types';

const repository = new PlaceRepository();

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaces = useCallback(async () => {
    try {
      const data = await repository.getAll();
      setPlaces(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Primolan Style */}
        <View style={styles.header}>
          <Text style={styles.logoTitle}>
            ACHADOS <Text style={styles.logoHighlight}>WEBDEV</Text>
          </Text>
          <Text style={styles.subtitle}>Álbum de fotos e localizações</Text>
          <View style={styles.divider} />
        </View>

        {/* Formulário de Registro */}
        <PlaceForm onSaved={loadPlaces} />

        {/* Lista de Registros */}
        {loading ? (
          <ActivityIndicator size="large" color="#4F70FF" style={{ marginTop: 20 }} />
        ) : (
          <PlaceList places={places} onRefresh={loadPlaces} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0E12',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginVertical: 16,
  },
  logoTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  logoHighlight: {
    color: '#4F70FF',
  },
  subtitle: {
    color: '#A0A5B5',
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  divider: {
    height: 2,
    width: 60,
    backgroundColor: '#4F70FF',
    marginTop: 10,
    borderRadius: 1,
  },
});
