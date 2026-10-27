import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { PlaceRepository, InvalidPlaceError } from '../services/PlaceRepository';

interface PlaceFormProps {
  onSaved: () => void;
}

const repository = new PlaceRepository();

export const PlaceForm: React.FC<PlaceFormProps> = ({ onSaved }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    latitude,
    longitude,
    loading: gpsLoading,
    error: gpsError,
    getLocation,
    resetLocation,
  } = useCurrentLocation();

  const handleTakePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É preciso permitir o uso da câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await repository.create({
        title,
        note,
        photoUri,
        latitude,
        longitude,
      });

      // Reset do formulário
      setTitle('');
      setNote('');
      setPhotoUri(null);
      resetLocation();

      onSaved();
      Alert.alert('Sucesso', 'Achado registrado com sucesso!');
    } catch (error) {
      if (error instanceof InvalidPlaceError) {
        Alert.alert('Validação', error.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro ao salvar o registro.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Novo Achado</Text>

      <TextInput
        style={styles.input}
        placeholder="Título (ex: Grafite Urbano)"
        placeholderTextColor="#666"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Comentário ou detalhes"
        placeholderTextColor="#666"
        multiline
        numberOfLines={3}
        value={note}
        onChangeText={setNote}
      />

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleTakePicture}>
          <Text style={styles.buttonText}>📷 {photoUri ? 'Trocar Foto' : 'Tirar Foto'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, gpsLoading && styles.disabledButton]}
          onPress={getLocation}
          disabled={gpsLoading}
        >
          {gpsLoading ? (
            <ActivityIndicator color="#4F70FF" size="small" />
          ) : (
            <Text style={styles.buttonText}>📍 Obter GPS</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Preview da Foto */}
      {photoUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.imagePreview} />
          <TouchableOpacity onPress={() => setPhotoUri(null)}>
            <Text style={styles.removeText}>Remover Foto</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Indicadores de Status do GPS */}
      {latitude !== null && longitude !== null && (
        <View style={styles.gpsStatusContainer}>
          <Text style={styles.gpsStatusText}>
            ✓ Coordenadas: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </Text>
        </View>
      )}

      {gpsError && <Text style={styles.errorText}>{gpsError}</Text>}

      {/* Botão Salvar */}
      <TouchableOpacity
        style={[styles.primaryButton, isSaving && styles.disabledButton]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Salvar no Álbum</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161922',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#262936',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#0D0E12',
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#2A2E3D',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#1E2330',
    borderColor: '#4F70FF',
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#4F70FF',
    fontWeight: '600',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#4F70FF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  disabledButton: {
    opacity: 0.6,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  removeText: {
    color: '#FF5A5A',
    fontSize: 12,
    marginTop: 6,
  },
  gpsStatusContainer: {
    backgroundColor: '#112217',
    borderColor: '#28A745',
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  gpsStatusText: {
    color: '#28A745',
    fontSize: 12,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF5A5A',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
});