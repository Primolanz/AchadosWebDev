import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import type { RootTabParamList } from '../../App';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { InvalidPlaceError, PlaceRepository } from '../services/PlaceRepository';

type Props = BottomTabScreenProps<RootTabParamList, 'NewCapture'>;
const repository = new PlaceRepository();

export function NewCaptureScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { latitude, longitude, loading: gpsLoading, error: gpsError, getLocation, resetLocation } = useCurrentLocation();

  const handleTakePicture = () => {
    Alert.alert(
      'Capturar imagem',
      'Escolha como deseja adicionar a foto do seu achado:',
      [
        { text: '📷 Tirar foto (câmera)', onPress: () => { void takePhotoWithCamera(); } },
        { text: '🖼️ Escolher da galeria', onPress: () => { void choosePhotoFromGallery(); } },
        { text: 'Cancelar', style: 'cancel' },
      ],
    );
  };

  const takePhotoWithCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permita o acesso à câmera para fotografar seus achados.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.7 });
      if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
      else if (!result.canceled) showCameraUnavailableMessage();
    } catch (error) {
      console.warn('Não foi possível abrir a câmera:', error);
      showCameraUnavailableMessage();
    }
  };

  const choosePhotoFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permita o acesso à galeria para escolher uma foto.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.7 });
      if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
    } catch (error) {
      console.warn('Não foi possível abrir a galeria:', error);
      Alert.alert('Galeria indisponível', 'Não foi possível abrir as fotos neste momento. Tente novamente.');
    }
  };

  const showCameraUnavailableMessage = () => {
    Alert.alert(
      'Câmera indisponível',
      'Não foi possível abrir a câmera. Em emuladores Android, configure a câmera como VirtualScene ou escolha uma imagem da galeria.',
      [{ text: 'Entendi' }, { text: 'Abrir galeria', onPress: () => { void choosePhotoFromGallery(); } }],
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await repository.create({ title, note, photoUri, latitude, longitude });
      setTitle(''); setNote(''); setPhotoUri(null); resetLocation();
      Alert.alert('Sucesso', 'Achado guardado com sucesso!');
      navigation.navigate('Album');
    } catch (error) {
      if (error instanceof InvalidPlaceError) Alert.alert('Atenção', error.message);
      else Alert.alert('Erro', 'Ocorreu um erro ao salvar o registro.');
    } finally { setIsSaving(false); }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}><Text style={styles.headerTitle}>NOVO <Text style={styles.highlight}>ACHADO</Text></Text><Text style={styles.subTitle}>Capture uma foto ou registre sua posição</Text></View>
      <View style={styles.formCard}>
        <TextInput style={styles.input} placeholder="Título do achado (ex.: Pintura na praça)" placeholderTextColor="#777D8F" value={title} onChangeText={setTitle} maxLength={80} returnKeyType="next" />
        <TextInput style={[styles.input, styles.textArea]} placeholder="Comentário ou detalhes adicionais" placeholderTextColor="#777D8F" multiline numberOfLines={3} value={note} onChangeText={setNote} maxLength={500} />
        <View style={styles.row}>
          <TouchableOpacity accessibilityRole="button" style={styles.secBtn} onPress={handleTakePicture}><Text style={styles.secBtnText}>▣  {photoUri ? 'Trocar foto' : 'Tirar foto'}</Text></TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" style={[styles.secBtn, gpsLoading && styles.disabled]} onPress={() => { void getLocation(); }} disabled={gpsLoading}>{gpsLoading ? <ActivityIndicator color="#4F70FF" size="small" /> : <Text style={styles.secBtnText}>⌖  Obter GPS</Text>}</TouchableOpacity>
        </View>
        {photoUri && <View style={styles.previewBox}><Image source={{ uri: photoUri }} style={styles.previewImg} /><TouchableOpacity onPress={() => setPhotoUri(null)} accessibilityRole="button"><Text style={styles.removeText}>Remover foto</Text></TouchableOpacity></View>}
        {latitude !== null && longitude !== null && <View style={styles.gpsSuccess}><Text style={styles.gpsSuccessText}>✓ GPS capturado: {latitude.toFixed(4)}, {longitude.toFixed(4)}</Text></View>}
        {gpsError && <Text accessibilityRole="alert" style={styles.errorText}>{gpsError}</Text>}
        <TouchableOpacity accessibilityRole="button" style={[styles.mainBtn, isSaving && styles.disabled]} onPress={() => { void handleSave(); }} disabled={isSaving}>{isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>Guardar no álbum</Text>}</TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0E12' }, content: { padding: 16, paddingBottom: 28 },
  header: { marginBottom: 16, alignItems: 'center' }, headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '800', letterSpacing: 1.5 }, highlight: { color: '#4F70FF' }, subTitle: { color: '#8A8F9E', fontSize: 12, marginTop: 2, textAlign: 'center' },
  formCard: { backgroundColor: '#161922', borderRadius: 12, borderWidth: 1, borderColor: '#262936', padding: 16 }, input: { backgroundColor: '#0D0E12', color: '#FFF', borderWidth: 1, borderColor: '#2A2E3D', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 }, textArea: { minHeight: 88, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10, marginBottom: 12 }, secBtn: { flex: 1, minHeight: 44, backgroundColor: '#1E2330', borderColor: '#4F70FF', borderWidth: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }, secBtnText: { color: '#4F70FF', fontWeight: '600', fontSize: 13 },
  previewBox: { alignItems: 'center', marginVertical: 10 }, previewImg: { width: '100%', height: 180, borderRadius: 8 }, removeText: { color: '#FF5A5A', fontSize: 12, marginTop: 8 }, gpsSuccess: { backgroundColor: '#112217', borderColor: '#28A745', borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 12 }, gpsSuccessText: { color: '#55C878', fontSize: 12, textAlign: 'center', fontWeight: '600' }, errorText: { color: '#FF7777', fontSize: 12, textAlign: 'center', marginBottom: 10 },
  mainBtn: { backgroundColor: '#4F70FF', minHeight: 48, paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 6 }, mainBtnText: { color: '#FFF', fontWeight: '700', fontSize: 15 }, disabled: { opacity: 0.6 },
});
