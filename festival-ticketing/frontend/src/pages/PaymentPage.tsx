import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Divider,
  Grid,
  Chip,
  IconButton,
  InputAdornment,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Collapse
} from '@mui/material';
import {
  PhoneIphone,
  CheckCircle,
  Error as ErrorIcon,
  Timer,
  Lock,
  Info,
  ContentCopy,
  Refresh,
  Warning,
  QrCode2,
  Receipt,
  ConfirmationNumber
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptPT } from 'date-fns/locale';

import { api } from '../services/api';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useAuth } from '../contexts/AuthContext';

// Validation schema
const paymentSchema = z.object({
  phoneNumber: z.string()
    .regex(/^(9[1236]\d{7}|(\+351)?9[1236]\d{7})$/, 'Número de telefone inválido')
    .transform(val => val.replace(/\s/g, '').replace('+351', '')),
  confirmPhone: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'Deve aceitar os termos')
}).refine(data => {
  const phone1 = data.phoneNumber.replace(/\s/g, '').replace('+351', '');
  const phone2 = data.confirmPhone.replace(/\s/g, '').replace('+351', '');
  return phone1 === phone2;
}, {
  message: 'Os números de telefone não coincidem',
  path: ['confirmPhone']
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentStatus {
  status: 'pending' | 'processing' | 'success' | 'failed' | 'expired';
  message?: string;
  transactionId?: string;
  reference?: string;
}

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribe, unsubscribe } = useWebSocket();
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'pending' });
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [retryCount, setRetryCount] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      phoneNumber: user?.phone || '',
      confirmPhone: '',
      acceptTerms: false
    }
  });

  // Fetch order details
  const { data: order, isLoading: orderLoading, error: orderError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then(res => res.data),
    enabled: !!orderId,
    retry: 3,
    retryDelay: 1000,
    staleTime: 0,
  });

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: async (data: PaymentFormData) => {
      // Double confirmation
      const confirmResponse = await api.post(`/payments/confirm-details`, {
        orderId,
        phoneNumber: data.phoneNumber,
        amount: order?.total
      });

      if (!confirmResponse.data.confirmed) {
        throw new Error('Falha na confirmação dos detalhes do pagamento');
      }

      // Initiate payment
      return api.post(`/payments/mbway/initiate`, {
        orderId,
        phoneNumber: data.phoneNumber,
        amount: order?.total,
        description: `Bilhetes para ${order?.event?.name}`,
        email: user?.email
      });
    },
    onSuccess: (response) => {
      setPaymentStatus({
        status: 'processing',
        transactionId: response.data.transactionId,
        reference: response.data.reference
      });
      
      // Subscribe to real-time updates
      subscribe(`payment:${response.data.transactionId}`, handlePaymentUpdate);
      
      // Start monitoring
      startPaymentMonitoring(response.data.transactionId);
      
      toast.success('Pagamento MB Way iniciado! Verifique o seu telemóvel.');
    },
    onError: (error: any) => {
      console.error('Payment error:', error);
      
      if (error.response?.status === 429) {
        toast.error('Demasiadas tentativas. Por favor aguarde um momento.');
        setRetryCount(prev => prev + 1);
      } else {
        toast.error(error.response?.data?.message || 'Erro ao processar pagamento');
      }
      
      setPaymentStatus({ 
        status: 'failed', 
        message: error.response?.data?.message 
      });
    },
    retry: 2,
    retryDelay: 2000
  });

  // Handle WebSocket payment updates
  const handlePaymentUpdate = useCallback((data: any) => {
    console.log('Payment update received:', data);
    
    if (data.status === 'SUCCESS') {
      setPaymentStatus({ status: 'success', ...data });
      toast.success('Pagamento confirmado com sucesso!');
      
      // Redirect to tickets after delay
      setTimeout(() => {
        navigate('/bilhetes');
      }, 2000);
    } else if (data.status === 'FAILED' || data.status === 'CANCELLED') {
      setPaymentStatus({ 
        status: 'failed', 
        message: data.message || 'Pagamento não foi concluído'
      });
      toast.error('Pagamento falhou. Por favor tente novamente.');
    }
  }, [navigate]);

  // Payment monitoring
  const startPaymentMonitoring = useCallback((transactionId: string) => {
    let checks = 0;
    const maxChecks = 60; // 5 minutes with 5-second intervals
    
    const interval = setInterval(async () => {
      checks++;
      
      try {
        const response = await api.get(`/payments/${transactionId}/status`);
        const status = response.data.status;
        
        if (status === 'SUCCESS') {
          clearInterval(interval);
          handlePaymentUpdate({ status: 'SUCCESS', ...response.data });
        } else if (status === 'FAILED' || status === 'CANCELLED' || checks >= maxChecks) {
          clearInterval(interval);
          handlePaymentUpdate({ 
            status: 'FAILED', 
            message: checks >= maxChecks ? 'Tempo limite excedido' : 'Pagamento cancelado'
          });
        }
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [handlePaymentUpdate]);

  // Timer countdown
  useEffect(() => {
    if (paymentStatus.status === 'processing' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && paymentStatus.status === 'processing') {
      setPaymentStatus({ 
        status: 'expired', 
        message: 'Tempo limite para pagamento excedido' 
      });
    }
  }, [timeRemaining, paymentStatus.status]);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (paymentStatus.transactionId) {
        unsubscribe(`payment:${paymentStatus.transactionId}`);
      }
    };
  }, [paymentStatus.transactionId, unsubscribe]);

  const onSubmit = async (data: PaymentFormData) => {
    setShowConfirmDialog(true);
  };

  const confirmPayment = async () => {
    setShowConfirmDialog(false);
    setIsProcessing(true);
    
    const formData = watch();
    await paymentMutation.mutateAsync(formData);
    
    setIsProcessing(false);
  };

  const retryPayment = () => {
    setPaymentStatus({ status: 'pending' });
    setTimeRemaining(300);
    setRetryCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (orderLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (orderError || !order) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          Pedido não encontrado ou expirado
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 700 }}>
            Pagamento MB Way
          </Typography>

          {/* Order Summary */}
          <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    {order.event.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format(new Date(order.event.startDate), "d 'de' MMMM 'de' yyyy", { locale: ptPT })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.event.venue} - {order.event.city}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    €{order.total.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)} bilhete(s)
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <AnimatePresence mode="wait">
            {paymentStatus.status === 'pending' && (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    <strong>Pagamento 100% Seguro</strong> - Utilizamos encriptação de ponta a ponta e confirmação dupla para garantir a segurança do seu pagamento.
                  </Typography>
                </Alert>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Número de Telemóvel MB Way"
                            placeholder="912345678"
                            error={!!errors.phoneNumber}
                            helperText={errors.phoneNumber?.message || 'Número associado ao MB Way'}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIphone />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  +351
                                </InputAdornment>
                              )
                            }}
                            inputProps={{
                              maxLength: 9,
                              pattern: '[0-9]*'
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="confirmPhone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Confirmar Número de Telemóvel"
                            placeholder="912345678"
                            error={!!errors.confirmPhone}
                            helperText={errors.confirmPhone?.message || 'Digite novamente o número para confirmar'}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Lock />
                                </InputAdornment>
                              )
                            }}
                            inputProps={{
                              maxLength: 9,
                              pattern: '[0-9]*',
                              autoComplete: 'off'
                            }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="acceptTerms"
                        control={control}
                        render={({ field }) => (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              {...field}
                              id="terms"
                              style={{ marginRight: 8 }}
                            />
                            <label htmlFor="terms">
                              <Typography variant="body2">
                                Aceito os termos e condições e autorizo o pagamento
                              </Typography>
                            </label>
                          </Box>
                        )}
                      />
                      {errors.acceptTerms && (
                        <Typography variant="caption" color="error">
                          {errors.acceptTerms.message}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={!isValid || isProcessing || retryCount >= 3}
                        sx={{ py: 1.5 }}
                      >
                        {isProcessing ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Pagar com MB Way'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </form>

                {retryCount >= 3 && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    Atingiu o limite de tentativas. Por favor aguarde 5 minutos antes de tentar novamente.
                  </Alert>
                )}
              </motion.div>
            )}

            {paymentStatus.status === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={80} sx={{ mb: 3 }} />
                  
                  <Typography variant="h5" gutterBottom>
                    A aguardar confirmação no telemóvel
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Abra a app MB Way no seu telemóvel e confirme o pagamento
                  </Typography>

                  <Chip
                    icon={<Timer />}
                    label={`Tempo restante: ${formatTime(timeRemaining)}`}
                    color={timeRemaining < 60 ? 'warning' : 'primary'}
                    sx={{ mb: 3 }}
                  />

                  {paymentStatus.reference && (
                    <Paper sx={{ p: 2, bgcolor: 'grey.100', mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        Referência MB Way
                      </Typography>
                      <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                        {paymentStatus.reference}
                      </Typography>
                    </Paper>
                  )}

                  <LinearProgress 
                    variant="determinate" 
                    value={(300 - timeRemaining) / 3} 
                    sx={{ mb: 2 }}
                  />

                  <Alert severity="info">
                    Não feche esta página enquanto o pagamento está a ser processado
                  </Alert>
                </Box>
              </motion.div>
            )}

            {paymentStatus.status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                  
                  <Typography variant="h4" gutterBottom color="success.main">
                    Pagamento Confirmado!
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    O seu pagamento foi processado com sucesso
                  </Typography>

                  <Stack spacing={2} sx={{ maxWidth: 400, mx: 'auto' }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ConfirmationNumber />}
                      onClick={() => navigate('/bilhetes')}
                    >
                      Ver Meus Bilhetes
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Receipt />}
                      onClick={() => window.print()}
                    >
                      Imprimir Recibo
                    </Button>
                  </Stack>
                </Box>
              </motion.div>
            )}

            {(paymentStatus.status === 'failed' || paymentStatus.status === 'expired') && (
              <motion.div
                key="failed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                  
                  <Typography variant="h5" gutterBottom color="error">
                    {paymentStatus.status === 'expired' ? 'Pagamento Expirado' : 'Pagamento Falhou'}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {paymentStatus.message || 'O pagamento não foi concluído'}
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Refresh />}
                    onClick={retryPayment}
                    sx={{ mt: 2 }}
                  >
                    Tentar Novamente
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Info */}
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Lock fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Pagamento processado de forma segura através da rede MB Way. 
              Os seus dados são encriptados e nunca são armazenados nos nossos servidores.
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Confirmar Pagamento</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Por favor confirme os detalhes do pagamento antes de prosseguir
            </Typography>
          </Alert>
          
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Valor a pagar:
              </Typography>
              <Typography variant="h6">
                €{order?.total.toFixed(2)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="caption" color="text.secondary">
                Número MB Way:
              </Typography>
              <Typography variant="h6">
                +351 {watch('phoneNumber')}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={confirmPayment} autoFocus>
            Confirmar e Pagar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage;