import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Mail, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OTPVerificationProps {
  onVerified: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ onVerified }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('raunakkumarpandit0011@gmail.com');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    // Resend sandbox: only the verified test recipient works
    const allowedEmail = 'raunakkumarpandit0011@gmail.com';
    if (email !== allowedEmail) {
      toast.error(`In test mode, OTP can only be sent to ${allowedEmail}.`);
      return;
    }
    setLoading(true);
    try {
      console.log('Attempting to send OTP via edge function...')
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { action: 'send', email }
      });

      if (error) {
        console.error('Edge function OTP error:', error)
        toast.error(error.message || 'Failed to send OTP. Use the sandbox email or verify a domain in Resend.');
      } else {
        console.log('OTP sent successfully via edge function')
        if (data && typeof data === 'object' && 'token' in data) {
          setToken((data as any).token || '');
        }
        setStep('otp');
        toast.success('OTP sent to your email');
      }
    } catch (error) {
      console.error('Network error:', error)
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
  if (otp.length !== 5) {
      toast.error('Please enter a 5-digit OTP');
      return;
    }


    setLoading(true);
    try {
      console.log('Attempting to verify OTP via edge function...')
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { action: 'verify', email, otp, token }
      });

      if (error) {
        console.error('OTP verification error (edge):', error)
        toast.error(error.message || 'Failed to verify OTP');
      } else if (data && (data as any).success) {
        console.log('OTP verified successfully via edge function')
        toast.success('Access granted!');
        onVerified();
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      console.error('Verification network error:', error)
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Private Access</CardTitle>
          <CardDescription>
            Enter your email to receive a 5-digit OTP code. In sandbox, use raunakkumarpandit0011@gmail.com.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'email' ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter email (sandbox: raunakkumarpandit0011@gmail.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                onClick={sendOTP} 
                disabled={!email || loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter 5-Digit OTP</label>
                <Input
                  type="text"
                  placeholder="12345"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="text-center text-lg font-mono tracking-widest"
                  maxLength={5}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Code sent to {email}
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={verifyOTP} 
                  disabled={otp.length !== 5 || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setStep('email')}
                  className="w-full"
                  disabled={loading}
                >
                  Change Email
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;