'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { parseConfigFile } from '@/services/configParser';
import { Header } from './Header';
import { FileUploadArea } from './FileUploadArea';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from './ErrorBoundary';
import type { ParsedConfig, User, Device } from '@/types/config';

// Dynamic imports with proper typing
const ConfigDetails = dynamic(() =>
  import('./ConfigDetails').then(mod => mod.ConfigDetails),
  { ssr: false }
);

const UserCard = dynamic(() =>
  import('./UserCard').then(mod => mod.default),
  { ssr: false }
);

const UnassignedDevices = dynamic(() =>
  import('./UnassignedDevices').then(mod => mod.UnassignedDevices),
  { ssr: false }
);

const ConfigParserApp: React.FC = () => {
  const [parsedData, setParsedData] = useState<ParsedConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    setIsLoading(true);

    const file = e.dataTransfer.files[0];
    if (!file) {
      setIsLoading(false);
      return;
    }

    console.log('File being processed:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    if (!file.name.endsWith('.gg5')) {
      setError('Please upload a Green-GO .gg5 configuration file');
      setIsLoading(false);
      return;
    }

    setOriginalFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        console.log('File content length:', event.target?.result?.toString().length);
        const parsed = parseConfigFile(event.target?.result as string);
        setParsedData(parsed);
      } catch (err) {
        console.error('Error in file processing:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse file');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      setError('Error reading file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const exportToCSV = useCallback(() => {
    if (!parsedData) return;

    const exportFileName = originalFileName
      ? originalFileName.replace(/\.(gg5|json)$/, '.csv')
      : 'config_export.csv';

    const headers = [
      'User Name',
      'User ID',
      'Device Name',
      'Device Type',
      'Serial Number',
      'Firmware',
      'IP Address',
      'MAC Address'
    ].join(',');

    const linkedDevicesRows = parsedData.users.flatMap((user: User) => {
      const linkedDevices = parsedData.devices.filter((device: Device) => device.linkedToUser === user.id);

      if (linkedDevices.length > 0) {
        return linkedDevices.map((device: Device) => [
          user.name,
          user.id,
          device.name,
          device.typeName,
          device.serialNumber,
          device.firmware,
          device.ipAddress,
          device.macAddress
        ].map(field => `"${field || ''}"`).join(','));
      }

      return [[
        user.name,
        user.id,
        '', '', '', '', '', ''
      ].map(field => `"${field || ''}"`).join(',')];
    });

    const unlinkedDevicesRows = parsedData.devices
      .filter((device: Device) => device.linkedToUser === null)
      .map((device: Device) => [
        '', '',
        device.name,
        device.typeName,
        device.serialNumber,
        device.firmware,
        device.ipAddress,
        device.macAddress
      ].map(field => `"${field || ''}"`).join(','));

    const csvContent = [headers, ...linkedDevicesRows, ...unlinkedDevicesRows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', exportFileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [parsedData, originalFileName]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <div className="min-h-full" role="main">
      <Header
        parsedData={parsedData}
        onExport={exportToCSV}
        onReset={() => {
          setParsedData(null);
          setError(null);
        }}
        theme={theme}
        onThemeChange={handleThemeChange}
        mounted={mounted}
      />
      <ErrorBoundary>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {!parsedData ? (
            <FileUploadArea
              isDragging={isDragging}
              error={error}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              isLoading={isLoading}
            />
          ) : (
            <div className="space-y-6">
              <ConfigDetails configInfo={parsedData.configInfo} />

              {parsedData.users.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  devices={parsedData.devices}
                />
              ))}

              <UnassignedDevices devices={parsedData.devices} />
            </div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default ConfigParserApp; 