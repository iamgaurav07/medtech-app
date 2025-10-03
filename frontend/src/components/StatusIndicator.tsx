import React, { useState, useEffect } from 'react';
import { Server, Wifi, WifiOff } from 'lucide-react';
import { apiService } from '../services/api';
import { PythonServerStatus } from '../types';

export const StatusIndicator: React.FC = () => {
  const [nodeStatus, setNodeStatus] = useState<'online' | 'offline'>('offline');
  const [pythonStatus, setPythonStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async (): Promise<void> => {
      try {
        // Check Node.js server status
        await apiService.healthCheck();
        setNodeStatus('online');

        // Check Python server status
        const pythonStatus = await apiService.getPythonServerStatus();
        setPythonStatus(pythonStatus.status);
      } catch (error) {
        setNodeStatus('offline');
        setPythonStatus('disconnected');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="animate-pulse bg-gray-300 rounded-full h-3 w-3"></div>
          <span className="text-gray-600">Checking status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      {/* Node.js Server Status */}
      <div className="flex items-center gap-2">
        <Server className={`h-4 w-4 ${
          nodeStatus === 'online' ? 'text-green-500' : 'text-red-500'
        }`} />
        <span className={nodeStatus === 'online' ? 'text-green-600' : 'text-red-600'}>
          Backend: {nodeStatus === 'online' ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Python Server Status */}
      <div className="flex items-center gap-2">
        {pythonStatus === 'connected' ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <span className={pythonStatus === 'connected' ? 'text-green-600' : 'text-red-600'}>
          Python: {pythonStatus === 'connected' ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
};