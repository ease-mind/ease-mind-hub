import { ColorsPalette } from '@/shared/classes/constants/Pallete';
import { StyleSheet } from 'react-native';

export default function ThermometerScreen() {
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  greetingHeader: {
    backgroundColor: ColorsPalette.light['lime.900'],
    paddingHorizontal: 30,
    zIndex: 10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  greetingTitle: { fontSize: 30, fontWeight: '500', color: ColorsPalette.light['lime.50'] },
  greetingSubtitle: { fontSize: 16, color: ColorsPalette.light['lime.50'] },
  content: {
    backgroundColor: '#FFF',
    flex: 1,
    gap: 16,
    padding: 20,
    marginBottom: 40,
  },
});