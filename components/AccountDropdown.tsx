import React, { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

interface MenuItem {
  icon?: string;
  label?: string;
  hasSubmenu?: boolean;
  isDivider?: boolean;
  isDestructive?: boolean;
  onClick?: () => void;
}

interface AccountDropdownProps {
  creditsTotal: number;
  creditsRemaining: number;
  planType?: 'Free' | 'Pro' | 'Enterprise';
  onUpgrade: () => void;
  onProfile?: () => void;
  onSettings?: () => void;
  onSubscription?: () => void;
  onUsageAndCredits?: () => void;
  onTheme?: () => void;
  onDocumentation?: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({
  creditsTotal,
  creditsRemaining,
  planType = 'Free',
  onUpgrade,
  onProfile,
  onSettings,
  onSubscription,
  onUsageAndCredits,
  onTheme,
  onDocumentation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { signOut } = useClerk();

  // Get user initials
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  const menuItems: MenuItem[] = [
    { icon: '👤', label: 'Perfil', onClick: onProfile || (() => console.log('Perfil')) },
    { icon: '⚙️', label: 'Configurações', onClick: onSettings || (() => console.log('Configurações')) },
    { icon: '📝', label: 'Assinatura', onClick: onSubscription || (() => console.log('Assinatura')) },
    { icon: '💳', label: 'Uso e créditos', onClick: onUsageAndCredits || (() => console.log('Uso e créditos')) },
    { icon: '🎨', label: 'Tema', hasSubmenu: true, onClick: onTheme || (() => console.log('Tema')) },
    { icon: '📚', label: 'Documentação e recursos', hasSubmenu: true, onClick: onDocumentation || (() => console.log('Docs')) },
    { isDivider: true },
    { icon: '🚪', label: 'Sair', isDestructive: true, onClick: () => signOut() },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (!item.hasSubmenu) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
          {getInitials()}
        </div>
        <span className="bg-black text-white px-2 py-0.5 rounded text-[11px] font-semibold">
          {planType}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-[280px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
          {/* Header Section */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-base font-semibold flex-shrink-0">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 mb-0.5">Conta</div>
              <div className="text-xs text-gray-500">
                {creditsRemaining.toLocaleString()} de {creditsTotal.toLocaleString()} créditos
              </div>
            </div>
            <span className="bg-black text-white px-2.5 py-1 rounded-md text-[11px] font-semibold">
              {planType}
            </span>
          </div>

          {/* Credits Section */}
          <div className="p-3 bg-gray-50 border-b border-gray-100">
            <div className="text-xs font-semibold text-gray-700 mb-2">Créditos:</div>
            <div className="space-y-1 mb-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Total:</span>
                <span className="font-semibold text-gray-900">{creditsTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Restantes:</span>
                <span className="font-semibold text-gray-900">{creditsRemaining.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onUpgrade();
                setIsOpen(false);
              }}
              className="w-full py-2 bg-black text-white text-xs font-semibold rounded-md hover:bg-gray-800 transition-colors"
            >
              Upgrade
            </button>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => {
              if (item.isDivider) {
                return <div key={`divider-${index}`} className="h-px bg-gray-200 my-1" />;
              }

              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    item.isDestructive
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.hasSubmenu && (
                    <span className="text-xs text-gray-400">▼</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;
