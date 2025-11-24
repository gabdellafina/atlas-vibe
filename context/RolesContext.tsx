import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  description: string;
}

export type UserRole = 'admin' | 'moderator' | 'user' | 'guest';

interface RolesContextData {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  hasPermission: (permission: string) => boolean;
  availableRoles: Role[];
  getUserRole: (userId?: string) => UserRole;
}

const RolesContext = createContext<RolesContextData | undefined>(undefined);

interface RolesProviderProps {
  children: ReactNode;
}


const ROLES_CONFIG: Record<UserRole, Role> = {
  admin: {
    id: '1',
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: [
      'read',
      'write',
      'delete',
      'manage_users',
      'manage_roles',
      'view_reports',
      'manage_content'
    ]
  },
  moderator: {
    id: '2',
    name: 'Moderador',
    description: 'Pode moderar conteúdo e usuários',
    permissions: [
      'read',
      'write',
      'delete',
      'manage_content',
      'view_reports'
    ]
  },
  user: {
    id: '3',
    name: 'Usuário',
    description: 'Usuário padrão do sistema',
    permissions: [
      'read',
      'write'
    ]
  },
  guest: {
    id: '4',
    name: 'Visitante',
    description: 'Acesso limitado',
    permissions: [
      'read'
    ]
  }
};

export const RolesProvider: React.FC<RolesProviderProps> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('user');

  const hasPermission = (permission: string): boolean => {
    const role = ROLES_CONFIG[currentRole];
    return role.permissions.includes(permission);
  };

  const availableRoles = Object.values(ROLES_CONFIG);

  const getUserRole = (userId?: string): UserRole => {
    return currentRole;
  };

  return (
    <RolesContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        hasPermission,
        availableRoles,
        getUserRole,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = (): RolesContextData => {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
};