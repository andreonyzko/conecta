import { Alert } from 'react-native';

export function notify(message: string) {
  Alert.alert('AgroConecta', message);
}
