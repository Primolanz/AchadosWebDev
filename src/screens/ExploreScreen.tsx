import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PlaceRepository } from '../services/PlaceRepository';
import { Place } from '../types';

const repository = new PlaceRepository();
const RADAR_SIZE = 220;

export function ExploreScreen() {
  const [places, setPlaces] = useState<Place[]>([]);
  useFocusEffect(useCallback(() => { void repository.getAll().then(setPlaces); }, []));

  const photos = places.filter((place) => place.photoUri !== null).length;
  const located = places.filter((place) => place.latitude !== null && place.longitude !== null);
  const radarPoints = useMemo(() => {
    if (!located.length) return [];
    const latitudes = located.map((place) => place.latitude as number);
    const longitudes = located.map((place) => place.longitude as number);
    const minLat = Math.min(...latitudes); const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes); const maxLon = Math.max(...longitudes);
    const span = Math.max(maxLat - minLat, maxLon - minLon, 0.002);
    return located.map((place) => ({
      id: place.id,
      x: 18 + (((place.longitude as number) - (minLon + maxLon) / 2) / span + 0.5) * 184,
      y: 18 + (0.5 - ((place.latitude as number) - (minLat + maxLat) / 2) / span) * 184,
    }));
  }, [located]);

  const suggestion = located.length >= 2
    ? `Você já mapeou ${located.length} pontos. Explore uma rua próxima ao seu achado mais recente para ampliar seu mapa.`
    : 'Registre pelo menos dois achados com GPS para receber uma sugestão baseada nas áreas que você já visitou.';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><Text style={styles.headerTitle}>EXPLORAR <Text style={styles.highlight}>RADAR</Text></Text><Text style={styles.subTitle}>Estatísticas dos seus achados</Text></View>
      <View style={styles.statsGrid}>
        <StatCard number={String(places.length)} label="Achados totais" />
        <StatCard number={String(photos)} label="Com foto" detail="▣" />
        <StatCard number={String(located.length)} label="Com GPS" detail="⌖" />
      </View>
      <View style={styles.radarCard}>
        <Text style={styles.sectionTitle}>Radar de coordenadas</Text>
        <Text style={styles.description}>Cada ponto representa um achado com localização salva.</Text>
        <View style={styles.radarWrap}>
          <View style={styles.radar}>
            <View style={styles.ringOuter} /><View style={styles.ringMiddle} /><View style={styles.ringInner} />
            <View style={styles.axisVertical} /><View style={styles.axisHorizontal} />
            {radarPoints.map((point) => <View key={point.id} style={[styles.dot, { left: point.x, top: point.y }]} />)}
            {!radarPoints.length && <Text style={styles.emptyRadar}>AGUARDANDO GPS</Text>}
          </View>
        </View>
        <Text style={styles.radarCaption}>{located.length ? `${located.length} coordenada${located.length === 1 ? '' : 's'} no seu radar` : 'Seu radar aparecerá após salvar um achado com GPS.'}</Text>
      </View>
      <View style={styles.suggestionCard}>
        <Text style={styles.suggestionEyebrow}>SUGESTÃO DE EXPLORAÇÃO</Text>
        <Text style={styles.suggestion}>{suggestion}</Text>
        <Text style={styles.disclaimer}>Sugestão visual baseada apenas nos registros salvos no aparelho.</Text>
      </View>
    </ScrollView>
  );
}

function StatCard({ number, label, detail }: { number: string; label: string; detail?: string }) {
  return <View style={styles.statCard}><Text style={styles.statNumber}>{number}</Text><Text style={styles.statLabel}>{detail ? `${detail}  ` : ''}{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0E12' }, content: { padding: 16, paddingBottom: 28 },
  header: { marginBottom: 18, alignItems: 'center' }, headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', letterSpacing: 1.5 }, highlight: { color: '#4F70FF' }, subTitle: { color: '#8A8F9E', fontSize: 12, marginTop: 3 },
  statsGrid: { flexDirection: 'row', gap: 9, marginBottom: 16 }, statCard: { flex: 1, backgroundColor: '#161922', borderRadius: 10, borderWidth: 1, borderColor: '#262936', paddingVertical: 15, paddingHorizontal: 5, alignItems: 'center' }, statNumber: { color: '#4F70FF', fontSize: 23, fontWeight: '800' }, statLabel: { color: '#A0A5B5', fontSize: 10, marginTop: 4, textAlign: 'center' },
  radarCard: { backgroundColor: '#161922', borderRadius: 12, borderWidth: 1, borderColor: '#262936', padding: 16 }, sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' }, description: { color: '#8A8F9E', fontSize: 12, marginTop: 5, lineHeight: 18 }, radarWrap: { alignItems: 'center', marginTop: 16 }, radar: { width: RADAR_SIZE, height: RADAR_SIZE, borderRadius: RADAR_SIZE / 2, borderWidth: 1, borderColor: '#4F70FF88', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: '#101521' },
  ringOuter: { position: 'absolute', width: 180, height: 180, borderRadius: 90, borderWidth: 1, borderColor: '#4F70FF44' }, ringMiddle: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: '#4F70FF55' }, ringInner: { position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: '#4F70FF66' }, axisVertical: { position: 'absolute', width: 1, height: RADAR_SIZE, backgroundColor: '#4F70FF33' }, axisHorizontal: { position: 'absolute', height: 1, width: RADAR_SIZE, backgroundColor: '#4F70FF33' }, dot: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: '#70A0FF', borderWidth: 1, borderColor: '#FFF', shadowColor: '#4F70FF', shadowOpacity: 0.8, shadowRadius: 6, elevation: 4 }, emptyRadar: { color: '#777D8F', fontSize: 10, letterSpacing: 1.1 }, radarCaption: { color: '#8A8F9E', fontSize: 11, textAlign: 'center', marginTop: 12 },
  suggestionCard: { marginTop: 14, backgroundColor: '#161922', borderRadius: 12, borderWidth: 1, borderColor: '#262936', padding: 16 }, suggestionEyebrow: { color: '#4F70FF', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, suggestion: { color: '#FFF', fontSize: 14, lineHeight: 21, marginTop: 8 }, disclaimer: { color: '#777D8F', fontSize: 10, marginTop: 10, lineHeight: 15 },
});
