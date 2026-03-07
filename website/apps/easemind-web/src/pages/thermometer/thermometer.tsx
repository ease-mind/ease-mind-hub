import { FC, useEffect, useState } from 'react';
import { Box, Typography, Radio, Button, Alert, CircularProgress, Chip } from '@mui/material';
import { Warning, Cancel, Lightbulb, TrendingUp, Loop, ArrowBack, ArrowForward } from '@mui/icons-material';
import { EasemindCard, EasemindText } from '@repo/ui';
import { useTheme } from '@repo/utils';
import { 
  getAllSymptoms, 
  saveUserSymptoms,
  getLatestUserSymptoms,
  Symptom, 
  UserSymptomRecord,
  useUser,
  useCognitiveSettings
} from '@repo/data-access';
import './thermometer.scss';

interface EasemindThermometerProps { }

const EasemindThermometerPage: FC<EasemindThermometerProps> = () => {
  const { colors, isDarkMode } = useTheme();
  const { user } = useUser();
  const { settings } = useCognitiveSettings();
  const isSimple = settings.complexity === 'simple';
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Define o background igual ao da página de tasks
  const pageBg = isDarkMode ? colors.background : "#fef3f1";

  useEffect(() => {
    loadSymptoms();
  }, []);

  useEffect(() => {
    if (user?._id) {
      handleSelectedSymptoms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedSymptoms.length > 4) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [selectedSymptoms]);

  useEffect(() => {
    if (selectedSymptoms.length > 0 && user?._id) {
      const timer = setTimeout(() => {
        handleSaveSymptoms();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedSymptoms, user]);

  const handleSelectedSymptoms = async () => {
    if (!user?._id) return;
    
    const result = await getLatestUserSymptoms(user._id);
    
    if (result?.selectedSymptoms) {
      setSelectedSymptoms(result.selectedSymptoms);
    }
  };

  const loadSymptoms = async () => {
    setLoading(true);
    try {
      const data = await getAllSymptoms();
      setSymptoms(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar sintomas. Por favor, tente novamente.');
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
    if (temp === 0) return 'rgb(16, 185, 129)';
    if (temp <= 36) return 'rgb(16, 185, 129)';
    if (temp <= 38) return '#FFC107';
    if (temp >= 39) return '#F44336';
    return '#F44336';
  };

  const getTemperatureLevel = () => {
    const temp = getTemperature();
    if (temp === 0) return '';
    if (temp <= 36) return 'Calmo';
    if (temp <= 38) return 'Alerta';
    if (temp >= 39) return 'Sobrecarga';
  };

  const getThermometerIcon = () => {
    const temp = getTemperature();
    if (temp === 0 || temp <= 36) return '/images/icone-calmo.svg';
    if (temp <= 38) return '/images/icone-alerta.svg';
    return '/images/icone-sobrecarregado.svg';
  };

  const getCategoryCount = (category: string) => {
    return selectedSymptoms.filter(id => 
      symptoms.find(s => s.id === id)?.category === category
    ).length;
  };

  const handleSaveSymptoms = async () => {
    if (!user?._id || selectedSymptoms.length === 0) return;

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
    setSaving(false);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setShowAlert(false);
    setCurrentStep(0);
  };

  const temperaturePercentage = symptoms.length > 0 ? (selectedSymptoms.length / symptoms.length) * 100 : 0;

  const categories = [
    { 
      key: 'communication', 
      title: 'Falha na Comunicação', 
      icon: <Cancel sx={{ color: colors['coral.500'] }} />
    },
    { 
      key: 'physical', 
      title: 'Sintomas Físicos', 
      icon: <Lightbulb sx={{ color: '#FFC107' }} />
    },
    { 
      key: 'stereotypies', 
      title: 'Aumento de Estereotipias', 
      icon: <TrendingUp sx={{ color: '#2196F3' }} />
    }
  ];

  const handleNextStep = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const spacing = {
    card: settings.spacing === 24 ? 4 : settings.spacing === 18 ? 3 : 2,
    gap: settings.spacing === 24 ? 3 : settings.spacing === 18 ? 2 : 1,
    small: settings.spacing === 24 ? 2 : settings.spacing === 18 ? 1 : 1
  };

  const renderSimpleStepContent = () => {
    const category = categories[currentStep];
    const categorySymptoms = symptoms.filter(s => s.category === category.key);

    return (
      <EasemindCard>
        <Box p={spacing.card}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={spacing.gap}>
            <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1}>
              {category.icon} {category.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Etapa {currentStep + 1} de {categories.length}
            </Typography>
          </Box>
          
          <Box display="flex" flexDirection="column" gap={spacing.gap}>
            {categorySymptoms.map((symptom) => (
              <Box 
                key={symptom.id}
                onClick={() => handleSymptomToggle(symptom.id)}
                sx={{
                  p: spacing.gap,
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

          <Box display="flex" justifyContent="space-between" mt={spacing.gap} gap={spacing.gap}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              sx={{ 
                borderColor: colors['coral.500'],
                color: colors['coral.500'],
                '&:hover': { 
                  borderColor: colors['coral.600'],
                  bgcolor: `${colors['coral.500']}05`
                }
              }}
            >
              Anterior
            </Button>
            {currentStep < categories.length - 1 ? (
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNextStep}
                sx={{ 
                  bgcolor: colors['coral.500'],
                  '&:hover': { bgcolor: colors['coral.600'] }
                }}
              >
                Próximo
              </Button>
            ) : null}
          </Box>

          <Box display="flex" justifyContent="center" gap={1} mt={spacing.gap}>
            {categories.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: index === currentStep ? colors['coral.500'] : colors['grey.200'],
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
        </Box>
      </EasemindCard>
    );
  };

  const renderComplexContent = () => {
    return (
      <>
        <EasemindCard>
          <Box p={spacing.card}>
            <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} mb={spacing.gap}>
              <Cancel sx={{ color: colors['coral.500'] }} /> Falha na Comunicação
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={spacing.gap}>
              {symptoms.filter(s => s.category === 'communication').map((symptom) => (
                <Box 
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                  sx={{
                    p: spacing.gap,
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
        </EasemindCard>

        <EasemindCard>
          <Box p={spacing.card}>
            <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} mb={spacing.gap}>
              <Lightbulb sx={{ color: '#FFC107' }} /> Sintomas Físicos
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={spacing.gap}>
              {symptoms.filter(s => s.category === 'physical').map((symptom) => (
                <Box 
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                  sx={{
                    p: spacing.gap,
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
        </EasemindCard>

        <EasemindCard>
          <Box p={spacing.card}>
            <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center" gap={1} mb={spacing.gap}>
              <TrendingUp sx={{ color: '#2196F3' }} /> Aumento de Estereotipias
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={spacing.gap}>
              {symptoms.filter(s => s.category === 'stereotypies').map((symptom) => (
                <Box 
                  key={symptom.id}
                  onClick={() => handleSymptomToggle(symptom.id)}
                  sx={{
                    p: spacing.gap,
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
        </EasemindCard>
      </>
    );
  };

  if (error) {
    return (
      <Box p={spacing.card} sx={{ background: pageBg, minHeight: '100vh' }}>
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
    <Box className="thermometer-page" width={'100%'} sx={{ background: pageBg, minHeight: '100vh' }}>
      <Box width={'100%'} px={{xs: 2, sm: 3, md: 4}} py={spacing.card} display={'flex'} flexDirection={'column'} gap={spacing.gap}>
        <Box>
          <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
          Termômetro Sensorial
          </Typography>
          <Typography variant="body2" mt={1}>
            Identifique sinais de sobrecarga antes que ela aconteça (Rumble Stage)
          </Typography>
          {saving && (
            <Typography variant="caption" mt={1} display="flex" alignItems="center" gap={1}>
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
              Você está na fase de alerta. Considere fazer uma pausa e praticar técnicas de respiração.
            </Typography>
          </Alert>
        )}

        <Box display="grid" gridTemplateColumns="1fr 2fr" gap={spacing.gap} sx={{ gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 2fr' }}}>
          <Box>
            <EasemindCard>
              <Box p={spacing.card} display="flex" flexDirection="column" alignItems="center" gap={spacing.gap}>
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
                        component="img"
                        src={getThermometerIcon()}
                        alt={getTemperatureLevel() || 'Termômetro'}
                        sx={{
                          width: '60px',
                          height: '60px',
                        }}
                      />
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

                {!isSimple && (
                  <Box width="100%" mt={spacing.gap}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={spacing.small} pb={2}>
                      <Typography variant="body2">Comunicação</Typography>
                      <Box 
                        bgcolor={colors['coral.500']} 
                        color="white" 
                        sx={{ px: 2, py: 1 }}
                        borderRadius={1}
                        minWidth="30px"
                        textAlign="center"
                      >
                        <EasemindText color={colors['coral.100']}>{getCategoryCount('communication')}</EasemindText>
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={spacing.small} pb={2}>
                      <Typography variant="body2">Físicos</Typography>
                      <Box 
                        bgcolor={colors['coral.500']} 
                        color="white" 
                        sx={{ px: 2, py: 1 }}
                        borderRadius={1}
                        minWidth="30px"
                        textAlign="center"
                      >
                        <EasemindText color={colors['coral.100']}>{getCategoryCount('physical')}</EasemindText>
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" pb={2}>
                      <Typography variant="body2">Estereotipias</Typography>
                      <Box 
                        bgcolor={colors['coral.500']} 
                        sx={{ px: 2, py: 1 }}
                        borderRadius={1}
                        minWidth="30px"
                        textAlign="center"
                      >
                        <EasemindText color={colors['coral.100']}>{getCategoryCount('stereotypies')}</EasemindText>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box width="100%" mt={spacing.gap}>
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
            </EasemindCard>
          </Box>

          <Box display="flex" flexDirection="column" gap={spacing.gap}>
            {isSimple ? renderSimpleStepContent() : renderComplexContent()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EasemindThermometerPage;