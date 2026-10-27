import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place, NewPlace } from '../types';

const STORAGE_KEY = '@achados-webdev:places';

export class InvalidPlaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPlaceError';
  }
}

export class PlaceRepository {
  async getAll(): Promise<Place[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Erro ao ler do AsyncStorage:', e);
      return [];
    }
  }

  async create(data: NewPlace): Promise<Place> {
    if (!data.title || data.title.trim() === '') {
      throw new InvalidPlaceError('O título é obrigatório.');
    }

    // Regra: Deve conter Foto OU Localização (comparando estritamente com null)
    const semFoto = data.photoUri === null;
    const semLocalizacao = data.latitude === null || data.longitude === null;

    if (semFoto && semLocalizacao) {
      throw new InvalidPlaceError('O registro precisa ter ao menos uma FOTO ou LOCALIZAÇÃO.');
    }

    const newEntry: Place = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    const currentPlaces = await this.getAll();
    const updatedPlaces = [newEntry, ...currentPlaces];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));
    return newEntry;
  }

  async delete(id: string): Promise<void> {
    const currentPlaces = await this.getAll();
    const updatedPlaces = currentPlaces.filter((item) => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPlaces));
  }
}