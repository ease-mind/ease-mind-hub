import {
  getCognitiveSettings,
  updateCognitiveSettings,
  resetCognitiveSettings,
  CognitiveSettingsData,
} from './cognitiveSettingsService';
import { api } from '@/shared/config/api';

jest.mock('@/shared/config/api', () => ({
  api: {
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('cognitiveSettingsService', () => {
  const sampleSettings: CognitiveSettingsData = {
    complexity: 'simple',
    contrast: 'normal',
    spacing: 18,
    fontSize: 18,
    alertsEnabled: true,
    alertIntervalMinutes: 30,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getCognitiveSettings deve buscar configuracoes', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: sampleSettings });

    const result = await getCognitiveSettings();

    expect(mockedApi.get).toHaveBeenCalledWith('/cognitive-settings');
    expect(result).toEqual(sampleSettings);
  });

  it('updateCognitiveSettings deve enviar payload parcial e retornar dados atualizados', async () => {
    const patch: Partial<CognitiveSettingsData> = { contrast: 'high' };
    const updated: CognitiveSettingsData = { ...sampleSettings, ...patch };

    mockedApi.put.mockResolvedValueOnce({ data: updated });

    const result = await updateCognitiveSettings(patch);

    expect(mockedApi.put).toHaveBeenCalledWith('/cognitive-settings', patch);
    expect(result).toEqual(updated);
  });

  it('resetCognitiveSettings deve chamar endpoint de reset', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: sampleSettings });

    const result = await resetCognitiveSettings();

    expect(mockedApi.post).toHaveBeenCalledWith('/cognitive-settings/reset');
    expect(result).toEqual(sampleSettings);
  });
});

