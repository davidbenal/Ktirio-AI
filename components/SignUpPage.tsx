import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const SignUpPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <SignUp
        afterSignUpUrl="/welcome"
        signInUrl="/sign-in"
      />
    </div>
  );
};

export default SignUpPage;