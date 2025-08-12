/**
 * Componente SystemStatus
 * Exibe informações de versão e status do sistema
 */

import React, { useState, useEffect } from 'react';
import { config } from '../../utils/config';
import { useAuth } from '../../contexts/AuthContext';

const SystemStatus = ({ className = '' }) => {
  const [systemStatus, setSystemStatus] = useState({
    isOnline: true,
    apiConnected: null, // null = não verificado ainda, true/false = resultado
    lastCheck: null,
    healthData: null
  });

  const { isAuthenticated } = useAuth();

  // Verificar status da API usando endpoint health
  const checkApiStatus = async () => {
    console.log('🏥 Verificando status da API...');
    
    try {
      // Usar endpoint health na estrutura correta /api/v1/health
      const healthResponse = await fetch(`${config.api.baseUrl}/api/${config.api.version}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('🏥 Health response status:', healthResponse.status);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('🏥 Health check response:', healthData);
        
        const isUp = healthData.status === 'UP';
        console.log('🏥 API Status:', isUp ? 'UP' : 'DOWN');
        
        setSystemStatus(prev => ({
          ...prev,
          apiConnected: isUp,
          lastCheck: new Date(),
          healthData: healthData
        }));
        return;
      } else {
        console.log('⚠️ Health endpoint retornou erro:', healthResponse.status);
        // Se health endpoint existe mas retorna erro, API tem problema
        setSystemStatus(prev => ({
          ...prev,
          apiConnected: false,
          lastCheck: new Date()
        }));
        return;
      }
    } catch (healthError) {
      console.log('⚠️ Health endpoint não disponível:', healthError.message);
    }

    // Fallback: testar endpoint de categorias
    try {
      console.log('🔄 Testando endpoint de categorias como fallback...');
      const response = await fetch(`${config.api.baseUrl}/api/${config.api.version}/categorias`, {
        method: 'GET'
      });
      
      console.log('🔄 Categorias response status:', response.status);
      
      const isConnected = response.ok || response.status === 401; // 401 = API funciona mas não autorizado
      console.log('🔄 API Status (fallback):', isConnected ? 'CONNECTED' : 'OFFLINE');
      
      setSystemStatus(prev => ({
        ...prev,
        apiConnected: isConnected,
        lastCheck: new Date()
      }));
    } catch (error) {
      console.log('❌ Endpoint de categorias também falhou:', error.message);
      setSystemStatus(prev => ({
        ...prev,
        apiConnected: false,
        lastCheck: new Date()
      }));
    }
  };

  // Verificar status a cada 60 segundos quando autenticado
  useEffect(() => {
    if (isAuthenticated) {
      checkApiStatus();
      
      const interval = setInterval(checkApiStatus, 60000); // 60 segundos
      return () => clearInterval(interval);
    } else {
      // Se não autenticado, considerar API disponível (não sabemos ao certo)
      setSystemStatus(prev => ({
        ...prev,
        apiConnected: true,
        lastCheck: new Date()
      }));
    }
  }, [isAuthenticated]);

  // Formatação da versão
  const formatVersion = (version) => {
    return `v${version}`;
  };

  // Status da API
  const getApiStatus = () => {
    if (systemStatus.apiConnected === null) return 'verificando';
    return systemStatus.apiConnected ? 'conectada' : 'offline';
  };

  // Status visual da API
  const getApiStatusColor = () => {
    if (systemStatus.apiConnected === null) return 'text-yellow-500';
    return systemStatus.apiConnected ? 'text-green-500' : 'text-red-500';
  };

  // Status do sistema
  const getSystemStatusText = () => {
    if (systemStatus.apiConnected === null) {
      return 'Sistema inicializando';
    }
    return systemStatus.apiConnected 
      ? 'Sistema funcionando perfeitamente' 
      : 'Sistema funcionando (API offline)';
  };

  // Indicador visual
  const getIndicatorColor = () => {
    if (systemStatus.apiConnected === null) return 'bg-yellow-500';
    return systemStatus.apiConnected ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 text-center ${className}`}>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-500">
        {/* Status do Sistema */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getIndicatorColor()} animate-pulse`}></div>
          <span>{getSystemStatusText()}</span>
        </div>

        <span className="hidden sm:inline">•</span>

        {/* Versão do Dashboard */}
        <span>
          Dashboard {formatVersion(config.dashboard.version)}
        </span>

        <span className="hidden sm:inline">•</span>

        {/* Status da API */}
        <span className={getApiStatusColor()}>
          API {config.api.version} {getApiStatus()}
        </span>
      </div>
    </div>
  );
};

// Componente simplificado apenas com versão
export const SimpleSystemStatus = ({ showVersion = true, showApi = true, className = '' }) => {
  return (
    <div className={`text-center text-sm text-gray-500 ${className}`}>
      <div className="flex items-center justify-center gap-4">
        {showVersion && (
          <span>Dashboard v{config.dashboard.version}</span>
        )}
        
        {showVersion && showApi && <span>•</span>}
        
        {showApi && (
          <span>API {config.api.version}</span>
        )}
      </div>
    </div>
  );
};

// Hook para usar informações do sistema
export const useSystemInfo = () => {
  return {
    version: config.dashboard.version,
    apiVersion: config.api.version,
    releaseDate: config.dashboard.releaseDate,
    buildTime: config.dashboard.build,
    environment: process.env.NODE_ENV,
    apiUrl: config.api.baseUrl
  };
};

export default SystemStatus;