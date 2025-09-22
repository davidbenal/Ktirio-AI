import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <SignIn
        afterSignInUrl="/welcome"
        signUpUrl="/sign-up"
      />
    </div>
  );
};

export default SignInPage;