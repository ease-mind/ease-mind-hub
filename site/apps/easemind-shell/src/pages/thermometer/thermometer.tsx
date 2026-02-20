import { FC, useEffect, useState } from 'react';
import { Box, Typography, Radio, Button, Alert, CircularProgress } from '@mui/material';
import { Warning, Cancel, Lightbulb, TrendingUp, Loop } from '@mui/icons-material';
import { EaseMindCard } from '@repo/ui';
import { useTheme } from '@repo/utils';
import { 
  getAllSymptoms, 
  saveUserSymptoms, 
  Symptom, 
  UserSymptomRecord,
  useUser
} from '@repo/data-access';

interface EaseMindThermometerProps { }

const EaseMindThermometerPage: FC<EaseMindThermometerProps> = () => {
  const { colors } = useTheme();
  const { user } = useUser();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSymptoms();
  }, []);

  useEffect(() => {
    if (selectedSymptoms.length > 5) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [selectedSymptoms]);

  useEffect(() => {
    if (selectedSymptoms.length > 0 && user?.id) {
      const timer = setTimeout(() => {
        handleSaveSymptoms();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedSymptoms, user]);

  const loadSymptoms = async () => {
    try {
      setLoading(true);
      const data = await getAllSymptoms();
      setSymptoms(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar sintomas. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptomId) 
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const getTemperature = () => {
    const count = selectedSymptoms.length;
    if (count === 0) return 0;
    if (count <= 3) return 36;
    if (count <= 7) return 38;
    if (count <= 9) return 40;
    return 40;
  };

  const getTemperatureColor = () => {
    const temp = getTemperature();
    if (temp === 0) return '#E0E0E0';
    if (temp <= 36) return '#4CAF50';
    if (temp <= 38) return '#FFC107';
    if (temp >= 39) return '#FF9800';
    return '#FF4353';
  };

  const getTemperatureLevel = () => {
    const temp = getTemperature();
    if (temp === 0) return '';
    if (temp <= 36) return 'Calmo';
    if (temp <= 38) return 'Alerta';
    if (temp >= 39) return 'Sobrecarga';
  };

  const getCategoryCount = (category: string) => {
    return selectedSymptoms.filter(id => 
      symptoms.find(s => s.id === id)?.category === category
    ).length;
  };

  const handleSaveSymptoms = async () => {
    if (!user?._id || selectedSymptoms.length === 0) return;

    try {
      setSaving(true);
      const data: UserSymptomRecord = {
        userId: user._id,
        selectedSymptoms,
        temperature: getTemperature(),
        level: getTemperatureLevel() || 'Calmo',
        timestamp: new Date(),
        categoryCount: {
          communication: getCategoryCount('communication'),
          physical: getCategoryCount('physical'),
          stereotypies: getCategoryCount('stereotypies'),
        }
      };

      await saveUserSymptoms(data);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setShowAlert(false);
  };

  const temperaturePercentage = symptoms.length > 0 ? (selectedSymptoms.length / symptoms.length) * 100 : 0;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={loadSymptoms}>
            Tentar Novamente
          </Button>
        }>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Box width={'100%'} px={{xs: 2, sm: 3, md: 4}} py={3} display={'flex'} flexDirection={'column'} gap={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
          Termômetro Sensorial
          </Typography>
          <Typography variant="body2" color="text.primary" mt={1}>
            Identifique sinais de sobrecarga antes que ela aconteça (Rumble Stage)
          </Typography>
          {saving && (
            <Typography variant="caption" color="text.primary" mt={1} display="flex" alignItems="center" gap={1}>
              <CircularProgress size={12} /> Salvando automaticamente...
            </Typography>
          )}
        </Box>

        {showAlert && (
          <Alert 
            severity="warning" 
            icon={<Warning />}
            onClose={() => setShowAlert(false)}
            sx={{ 
              backgroundColor: colors['warning.200'],
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Typography fontWeight="bold">Atenção: Sinais de Alerta</Typography>
            <Typography variant="body2">
              Você está entrando na fase de alerta. Considere fazer uma pausa e praticar técnicas de respiração.
            </Typography>
          </Alert>
        )}

        <Box display="grid" gridTemplateColumns="1fr 2fr" gap={3} sx={{ gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 2fr' }}}>
          <Box>
            <EaseMindCard>
              <Box p={3} display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Box position="relative" width="200px" height="450px">
                  <Box
                    position="absolute"
                    left="50%"
                    top="0"
                    sx={{ transform: 'translateX(-50%)' }}
                    width="180px"
                    height="350px"
                    bgcolor={colors['thermometer.background']}
                    borderRadius="90px 90px 90px 90px"
                    border="2px solid #E0E0E0"
                  />
                  
                  <Box
                    position="absolute"
                    left="50%"
                    bottom="100px"
                    sx={{ 
                      transform: 'translateX(-50%)',
                      transition: 'height 0.5s ease, background-color 0.5s ease',
                      overflow: 'hidden'
                    }}
                    width="180px"
                    height={`${Math.min((temperaturePercentage / 100) * 350, 350)}px`}
                    borderRadius="90px 90px 90px 90px"
                  >
                    <Box
                      width="100%"
                      height="100%"
                      bgcolor={getTemperatureColor()}
                      sx={{
                        opacity: 0.85,
                      }}
                    />
                  </Box>

                  <Box
                    position="absolute"
                    left="50%"
                    top="30px"
                    sx={{ 
                      transform: 'translateX(-50%)',
                      zIndex: 2
                    }}
                    textAlign="center"
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      Sobrecarga
                    </Typography>
                  </Box>

                  <Box
                    position="absolute"
                    left="50%"
                    top="50%"
                    sx={{ 
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2
                    }}
                    textAlign="center"
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      Alerta
                    </Typography>
                  </Box>

                  <Box
                    position="absolute"
                    left="50%"
                    bottom="130px"
                    sx={{ 
                      transform: 'translateX(-50%)',
                      zIndex: 2
                    }}
                    textAlign="center"
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      Calmo
                    </Typography>
                  </Box>

                  <Box
                    position="absolute"
                    left="50%"
                    bottom="0"
                    sx={{ 
                      transform: 'translateX(-50%)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box 
                      width="90px" 
                      height="90px" 
                      borderRadius="50%" 
                      bgcolor="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow={3}
                      border={`3px solid ${getTemperatureColor()}`}
                    >
                      <Box
                        fontSize="48px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {selectedSymptoms.length === 0 ? '😊' :
                         getTemperature() <= 36 ? '😊' : 
                         getTemperature() <= 38 ? '😐' : 
                         getTemperature() <= 40 ? '😰' : '😟'}
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box textAlign="center">
                  {getTemperatureLevel() && (
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      color={getTemperatureColor()}
                      sx={{ 
                        mt: 1
                      }}
                    >
                      {getTemperatureLevel()}
                    </Typography>
                  )}
                </Box>

                <Box width="100%" mt={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Comunicação</Typography>
                    <Box 
                      bgcolor={colors['coral.500']} 
                      color="white" 
                      sx={{ px: 2, py: 1 }}
                      borderRadius={1}
                      minWidth="30px"
                      textAlign="center"
                    >
                      {getCategoryCount('communication')}
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">Físicos</Typography>
                    <Box 
                      bgcolor={colors['coral.500']} 
                      color="white" 
                      sx={{ px: 2, py: 1 }}
                      borderRadius={1}
                      minWidth="30px"
                      textAlign="center"
                    >
                      {getCategoryCount('physical')}
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">Estereotipias</Typography>
                    <Box 
                      bgcolor={colors['coral.500']} 
                      color="white" 
                      sx={{ px: 2, py: 1 }}
                      borderRadius={1}
                      minWidth="30px"
                      textAlign="center"
                    >
                      {getCategoryCount('stereotypies')}
                    </Box>
                  </Box>
                </Box>

                <Box width="100%" mt={2}>
                  <Typography variant="body2" fontWeight="bold" mb={1}>
                    Sintomas identificados: {selectedSymptoms.length}
                  </Typography>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    startIcon={<Loop />}
                    sx={{ 
                      bgcolor: colors['coral.500'],
                      '&:hover': { bgcolor: colors['coral.600'] }
                    }}
                    onClick={handleReset}
                  >
                    Resetar
                  </Button>
                </Box>
              </Box>
            </EaseMindCard>
          </Box>

          <Box display="flex" flexDirection="column" gap={2}>
            <EaseMindCard>
              <Box p={3}>
                <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} mb={2}>
                  <Cancel sx={{ color: colors['coral.500'] }} /> Falha na Comunicação
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  {symptoms.filter(s => s.category === 'communication').map((symptom) => (
                    <Box 
                      key={symptom.id}
                      onClick={() => handleSymptomToggle(symptom.id)}
                      sx={{
                        p: 2,
                        border: `2px solid ${selectedSymptoms.includes(symptom.id) ? colors['coral.500'] : colors['grey.200']}`,
                        borderRadius: 2,
                        cursor: 'pointer',
                        bgcolor: selectedSymptoms.includes(symptom.id) ? `${colors['coral.500']}10` : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: colors['coral.500'],
                          bgcolor: `${colors['coral.500']}05`,
                        }
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Radio checked={selectedSymptoms.includes(symptom.id)} />
                        <Typography variant="body2">{symptom.label}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </EaseMindCard>

            <EaseMindCard>
              <Box p={3}>
                <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} mb={2}>
                  <Lightbulb sx={{ color: '#FFC107' }} /> Sintomas Físicos
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  {symptoms.filter(s => s.category === 'physical').map((symptom) => (
                    <Box 
                      key={symptom.id}
                      onClick={() => handleSymptomToggle(symptom.id)}
                      sx={{
                        p: 2,
                        border: `2px solid ${selectedSymptoms.includes(symptom.id) ? colors['coral.500'] : colors['grey.200']}`,
                        borderRadius: 2,
                        cursor: 'pointer',
                        bgcolor: selectedSymptoms.includes(symptom.id) ? `${colors['coral.500']}10` : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: colors['coral.500'],
                          bgcolor: `${colors['coral.500']}05`,
                        }
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Radio checked={selectedSymptoms.includes(symptom.id)} />
                        <Typography variant="body2">{symptom.label}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </EaseMindCard>

            <EaseMindCard>
              <Box p={3}>
                <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} mb={2}>
                  <TrendingUp sx={{ color: '#2196F3' }} /> Aumento de Estereotipias
                </Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  {symptoms.filter(s => s.category === 'stereotypies').map((symptom) => (
                    <Box 
                      key={symptom.id}
                      onClick={() => handleSymptomToggle(symptom.id)}
                      sx={{
                        p: 2,
                        border: `2px solid ${selectedSymptoms.includes(symptom.id) ? colors['coral.500'] : colors['grey.200']}`,
                        borderRadius: 2,
                        cursor: 'pointer',
                        bgcolor: selectedSymptoms.includes(symptom.id) ? `${colors['coral.500']}10` : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: colors['coral.500'],
                          bgcolor: `${colors['coral.500']}05`,
                        }
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Radio checked={selectedSymptoms.includes(symptom.id)} />
                        <Typography variant="body2">{symptom.label}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </EaseMindCard>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default EaseMindThermometerPage;
