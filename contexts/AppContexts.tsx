import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ProjectsProvider } from './ProjectsContext';
import { FoldersProvider } from './FoldersContext';
import { NavigationProvider } from './NavigationContext';
import { ModalProvider } from './ModalContext';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface AppContextsProps {
  children: ReactNode;
}

export const AppContexts: React.FC<AppContextsProps> = ({ children }) => {
  if (!clerkPubKey) {
    throw new Error(
      "Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env.local file"
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <NavigationProvider>
          <ModalProvider>
            <FoldersProvider>
              <ProjectsProvider>
                {children}
              </ProjectsProvider>
            </FoldersProvider>
          </ModalProvider>
        </NavigationProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
};