'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, RotateCcw, FileDown, Sun, Moon, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const ConfigParserApp = () => {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [originalFileName, setOriginalFileName] = useState(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Device type mapping
  const deviceTypes = {
    258: "BPX Beltpack",
    259: "BPXSP Sports Beltpack",
    322: "WBPXSP Sports Beltpack",
    325: "WBPRVCBRS Beltpack",
    326: "WBPRVCBRSSP Beltpack",
    384: "Wallpanels Group",
    385: "WPSP Wallpanel",
    386: "WPHS Wallpanel",
    387: "WPNA Wallpanel",
    388: "WPX Wallpanel",
    513: "MCD08 Desk Station",
    514: "MCR12 Desk Station",
    515: "MCD16 Desk Station",
    516: "MCD24 Desk Station",
    517: "MCD32 Desk Station",
    518: "MCX Rack Station",
    519: "MCXEXT Rack Channel Extension",
    520: "MCXD Desk Station",
    521: "MCXDEXT Desk Channel Extension",
    769: "4W Interface",
    770: "2W Interface",
    771: "BRIDGE Interface",
    772: "INTERFACEX (LCD)",
    773: "INTERFACEX (TFT)",
    774: "BRIDGEX Interface (LCD)",
    775: "BRIDGEX Interface (TFT)",
    776: "Q4WR Interface",
    777: "DANTE Interface",
    897: "BCN Beacon",
    898: "WAA Antenna",
    899: "SIRDX Interface",
    900: "SI4WR Interface",
    901: "SI2WR Interface",
    902: "SIBR8RV Interface"
  };

  const getDeviceTypeName = (typeId) => {
    return deviceTypes[typeId] || "Unknown Device Type";
  };

  const parseConfigFile = (fileContent) => {
    try {
      const config = JSON.parse(fileContent);

      // Helper function to format dates
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false // This enables 24-hour format
        }).replace(',', '');
      };

      // Extract configuration details with better labels and formatted dates
      const configInfo = {
        "Configuration Name": config.Settings.Name,
        "Configuration ID": config.Settings.configId.substring(0, 8),
        "Multicast Address": config.Settings.MulticastAddress,
        "Config Timestamp": formatDate(config.Settings.savedAtTimestamp),
        "Binary Timestamp": formatDate(config.Settings.binaryTimestamp)
      };

      // Extract users
      const users = Object.entries(config.Users)
        .filter(([key]) => key !== 'keys' && key !== 'badge')
        .map(([id, userData]) => ({
          id,
          name: userData.Name,
          color: userData.Color,
          devices: []
        }));

      // First, create a map of device assignments from the Devices section
      const deviceAssignments = {};
      Object.entries(config.Devices || {})
        .filter(([key]) => key !== 'keys' && key !== 'badge')
        .forEach(([deviceId, deviceData]) => {
          if (deviceData.UserId && deviceData.UserId.Type === 1) {
            // Store just the last 6 characters for comparison
            const shortDeviceId = deviceId.slice(-6);
            deviceAssignments[shortDeviceId] = deviceData.UserId.Id.toString();
          }
        });

      // Then extract devices from the Network section with their assignments
      const devices = Object.entries(config.Network || {})
        .filter(([key]) => key !== 'keys' && key !== 'badge')
        .map(([macAddress, deviceData]) => {
          // Get just the last three blocks of the MAC address
          const shortDeviceId = deviceData.macAddress
            .split('-')
            .slice(-3)
            .join('')
            .toUpperCase();

          return {
            name: deviceData.Name,
            deviceType: deviceData.deviceType,
            typeName: getDeviceTypeName(deviceData.deviceType),
            serialNumber: deviceData.serialNumber,
            firmware: deviceData.firmwareName,
            ipAddress: deviceData.IpAddress,
            macAddress: deviceData.macAddress,
            linkedToUser: deviceAssignments[shortDeviceId] || null
          };
        });

      // Count unassigned devices
      const unassignedDevicesCount = devices.filter(device => device.linkedToUser === null).length;
      configInfo["Unassigned Devices"] = unassignedDevicesCount;

      return { configInfo, users, devices };
    } catch (err) {
      throw new Error('Failed to parse configuration file. Please ensure it is a valid Green-GO configuration file.');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.gg5') && !file.name.endsWith('.json')) {
      setError('Please upload a Green-GO .gg5 configuration file');
      return;
    }

    setOriginalFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = parseConfigFile(event.target.result);
        setParsedData(parsed);
      } catch (err) {
        setError(err.message);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const exportToCSV = useCallback(() => {
    if (!parsedData) return;

    // Generate export filename based on original filename
    const exportFileName = originalFileName
      ? originalFileName.replace(/\.(gg5)$/, '.csv')
      : 'config_export.csv';

    // Create CSV headers
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

    // Create CSV rows for linked devices
    const linkedDevicesRows = parsedData.users.flatMap(user => {
      const linkedDevices = parsedData.devices.filter(device => device.linkedToUser === user.id);

      // If user has linked devices, create rows for each device
      if (linkedDevices.length > 0) {
        return linkedDevices.map(device => [
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

      // If user has no linked devices, create a row with just user info
      return [[
        user.name,
        user.id,
        '', // No device name
        '', // No device type
        '', // No serial number
        '', // No firmware
        '', // No IP address
        ''  // No MAC address
      ].map(field => `"${field || ''}"`).join(',')];
    });

    // Create CSV rows for unlinked devices
    const unlinkedDevicesRows = parsedData.devices
      .filter(device => device.linkedToUser === null)
      .map(device => [
        '',  // No user name
        '',  // No user ID
        device.name,
        device.typeName,
        device.serialNumber,
        device.firmware,
        device.ipAddress,
        device.macAddress
      ].map(field => `"${field || ''}"`).join(','));

    // Combine all rows
    const csvContent = [headers, ...linkedDevicesRows, ...unlinkedDevicesRows].join('\n');

    // Create and trigger download
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

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeIcon = () => {
    if (!mounted) return null;
    if (theme === 'dark') return <Sun className="w-5 h-5" />;
    if (theme === 'light') return <Moon className="w-5 h-5" />;
    return <SunMoon className="w-5 h-5" />;
  };

  const getThemeLabel = () => {
    if (!mounted) return 'Loading theme...';
    if (theme === 'dark') return 'Switch to light mode';
    if (theme === 'light') return 'Switch to system theme';
    return 'Switch to dark mode';
  };

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" role="main">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-emerald-600 dark:bg-emerald-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/ggo-config-parser/logo-plain.svg" alt="Green-GO Logo" className="h-8 mr-2 brightness-0 invert" />
            <h1 className="text-white text-xl font-semibold">Green-GO Config Parser</h1>
          </div>
          <TooltipProvider>
            <div className="flex items-center gap-3" role="toolbar" aria-label="Main controls">
              {parsedData && (
                <>
                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <button
                        className="p-2 bg-white dark:bg-gray-200 text-emerald-700 rounded-md hover:bg-emerald-50 dark:hover:bg-gray-300 transition-colors duration-200"
                        onClick={exportToCSV}
                        aria-label="Export to CSV"
                      >
                        <FileDown className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Export to CSV</TooltipContent>
                  </TooltipRoot>

                  <TooltipRoot>
                    <TooltipTrigger asChild>
                      <button
                        className="p-2 bg-emerald-700 dark:bg-emerald-900 text-white rounded-md hover:bg-emerald-800 dark:hover:bg-emerald-950 transition-colors duration-200"
                        onClick={() => {
                          setParsedData(null);
                          setError(null);
                        }}
                        aria-label="Parse another file"
                      >
                        <RotateCcw className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Parse another file</TooltipContent>
                  </TooltipRoot>
                </>
              )}

              <TooltipRoot>
                <TooltipTrigger asChild>
                  <button
                    className="p-2 bg-emerald-700 dark:bg-emerald-900 text-white rounded-md hover:bg-emerald-800 dark:hover:bg-emerald-950 transition-colors duration-200"
                    onClick={cycleTheme}
                    aria-label={mounted ? `Switch theme (currently ${theme})` : 'Loading theme...'}
                  >
                    {getThemeIcon()}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {getThemeLabel()}
                </TooltipContent>
              </TooltipRoot>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {!parsedData ? (
          <Card className="border-2 border-dashed">
            <CardContent className="p-6">
              <div
                className={`rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
                  ${isDragging
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500'
                    : 'bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                  }
                  ${error ? 'border-red-500 bg-red-50 dark:bg-red-950/50' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('file-input').click()}
                role="button"
                tabIndex={0}
                aria-label="Drop zone for configuration file"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    document.getElementById('file-input').click();
                  }
                }}
              >
                <input
                  type="file"
                  id="file-input"
                  className="sr-only"
                  accept=".gg5,.json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const event = { preventDefault: () => { }, dataTransfer: { files: [file] } };
                      handleDrop(event);
                    }
                  }}
                  aria-label="Upload configuration file"
                />
                <Upload className="w-16 h-16 mx-auto mb-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                <p className="text-lg mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Drag and drop your configuration file here
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  (Only supports Green-GO <code>.gg5</code> configuration files)
                </p>
                {error && (
                  <p className="text-red-500 dark:text-red-400 mt-4" role="alert">{error}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Config Info Card */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-emerald-700 dark:text-gray-100">Configuration Details</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(parsedData.configInfo).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <dt className="font-medium text-gray-500 dark:text-gray-400">{key}</dt>
                      <dd className="text-gray-900 dark:text-gray-100">{value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {/* Users Section with improved device presentation */}
            {parsedData.users.map(user => {
              const linkedDevices = parsedData.devices.filter(device => device.linkedToUser === user.id);
              return (
                <Card key={user.id} className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                      User: {user.name}
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-2">
                        (ID: {user.id})
                      </span>
                      {linkedDevices.length > 0 && (
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-normal ml-2">
                          {linkedDevices.length} device{linkedDevices.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {linkedDevices.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {linkedDevices.map(device => (
                          <div
                            key={device.macAddress}
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">Name: </span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">{device.name}</span>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{device.typeName}</span>
                              </div>
                              <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-2">
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">S/N: </span>
                                  <span className="text-gray-900 dark:text-gray-100">{device.serialNumber}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">FW: </span>
                                  <span className="text-gray-900 dark:text-gray-100">{device.firmware}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">IP: </span>
                                  <span className="font-mono text-gray-900 dark:text-gray-100">{device.ipAddress}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 dark:text-gray-400">MAC: </span>
                                  <span className="font-mono text-gray-900 dark:text-gray-100">{device.macAddress}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">No devices linked</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Unlinked Devices Section */}
            <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Unlinked Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {parsedData.devices
                    .filter(device => device.linkedToUser === null)
                    .map(device => (
                      <div key={device.macAddress} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-500 dark:text-gray-400">Name</p>
                            <p className="text-gray-900 dark:text-gray-100">{device.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-500 dark:text-gray-400">Device Type</p>
                            <p className="text-gray-900 dark:text-gray-100">{device.typeName}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-500 dark:text-gray-400">Serial Number</p>
                            <p className="text-gray-900 dark:text-gray-100">{device.serialNumber}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-500 dark:text-gray-400">Firmware</p>
                            <p className="text-gray-900 dark:text-gray-100">{device.firmware}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-500 dark:text-gray-400">IP Address</p>
                            <p className="text-gray-900 dark:text-gray-100 font-mono">{device.ipAddress}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-500 dark:text-gray-400">MAC Address</p>
                            <p className="text-gray-900 dark:text-gray-100 font-mono">{device.macAddress}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigParserApp;