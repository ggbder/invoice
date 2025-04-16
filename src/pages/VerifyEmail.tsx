
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { verifyEmail } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setVerifying(false);
        return;
      }

      try {
        const success = await verifyEmail(token);
        setVerified(success);
      } catch (error) {
        console.error('Email verification failed:', error);
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Helmet>
        <title>Verify Email | RapproInvoice</title>
      </Helmet>

      <Card className="w-[400px] max-w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {verifying ? (
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Verifying your email...</p>
              <p className="text-muted-foreground mt-2">This will just take a moment.</p>
            </div>
          ) : !token ? (
            <div className="text-center">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-lg font-medium">Invalid Verification Link</p>
              <p className="text-muted-foreground mt-2">
                The verification link is missing a token. Please check your email for a valid link.
              </p>
            </div>
          ) : verified ? (
            <div className="text-center">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <p className="text-lg font-medium">Email Verified!</p>
              <p className="text-muted-foreground mt-2">
                Your email address has been successfully verified.
              </p>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <p className="text-lg font-medium">Verification Failed</p>
              <p className="text-muted-foreground mt-2">
                We couldn't verify your email. The token may be invalid or expired.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {!verifying && (
            <Button asChild>
              <Link to="/login">
                {verified ? "Proceed to Login" : "Back to Login"}
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
