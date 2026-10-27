# AchadosWebDev 📍📸

Um aplicativo mobile minimalista e moderno desenvolvido em React Native / Expo para registrar achados urbanos com fotos e localização GPS. Desenvolvido no estilo de interface da Primolan Web Dev.

## 📋 Canvas do Projeto

### Q1: O que cada registro guarda?
- **title**: Título descritivo do achado.
- **note**: Comentário ou observações adicionais.
- **photoUri**: Caminho/URI da foto capturada ou `null`.
- **latitude / longitude**: Coordenadas obtidas via GPS ou `null`.
- **createdAt**: Data e hora de criação no formato ISO.

### Q2: Quais telas existem?
- Tela única rolável com a união dos componentes `PlaceForm` (captura) e `PlaceList` (exibição de achados persistidos e exclusão).

### Q3: Qual a regra de aceite?
- O registro é considerado válido se possuir **Título** AND pelo menos **uma Foto OU uma Localização** GPS.

### Q4: Estrutura do Projeto
- `src/types/index.ts`: Tipagem dos dados.
- `src/hooks/useCurrentLocation.ts`: Hook com timeout de 20s para captura de coordenadas.
- `src/services/PlaceRepository.ts`: Classe Repository de persistência local com AsyncStorage (chave `@achados-webdev:places`).
- `src/components/PlaceForm.tsx`: Formulário com câmera, GPS e tratamentos de erro.
- `src/components/PlaceList.tsx`: Lista de exibição e botão de exclusão de achados.

---

## 🛠️ Tecnologias e Libs
- React Native / Expo (TypeScript)
- `expo-camera`
- `expo-location`
- `@react-native-async-storage/async-storage`

---

## 🚀 Como Executar
1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd AchadosWebDev