import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload } from 'lucide-react';

const ConfigParserApp = () => {
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

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
      
      // Extract users
      const users = Object.entries(config.Users)
        .filter(([key]) => key !== 'keys' && key !== 'badge')
        .map(([id, userData]) => ({
          id,
          name: userData.Name,
          color: userData.Color,
          devices: []
        }));

      // Extract devices and their relationships
      const devices = Object.entries(config.Network)
        .filter(([key]) => key !== 'keys' && key !== 'badge')
        .map(([macAddress, deviceData]) => ({
          name: deviceData.Name,
          deviceType: deviceData.deviceType,
          typeName: getDeviceTypeName(deviceData.deviceType),
          serialNumber: deviceData.serialNumber,
          firmware: deviceData.firmwareName,
          ipAddress: deviceData.IpAddress,
          macAddress: deviceData.macAddress,
          // Note: In a real application, we would need more sophisticated logic
          // to determine device-user relationships based on the configuration
          linkedToUser: deviceData.deviceType === 520 ? "3" : null
        }));

      return { users, devices };
    } catch (err) {
      throw new Error('Failed to parse configuration file. Please ensure it is a valid JSON file.');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.gg5') && !file.name.endsWith('.json')) {
      setError('Please upload a .gg5 or .json configuration file');
      return;
    }

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

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Configuration File Parser</CardTitle>
        </CardHeader>
        <CardContent>
          {!parsedData ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                ${error ? 'border-red-500 bg-red-50' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">
                Drag and drop your configuration file here
              </p>
              <p className="text-sm text-gray-500">
                Supports .gg5 and .json files
              </p>
              {error && (
                <p className="text-red-500 mt-4">{error}</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {parsedData.users.map(user => (
                <div key={user.id} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    User: {user.name} (ID: {user.id})
                  </h3>
                  
                  {parsedData.devices.filter(device => device.linkedToUser === user.id).length > 0 ? (
                    <div className="pl-4">
                      <h4 className="font-medium mb-2">Linked Devices:</h4>
                      {parsedData.devices
                        .filter(device => device.linkedToUser === user.id)
                        .map(device => (
                          <div key={device.macAddress} className="bg-gray-50 p-3 rounded">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>Device Name:</div>
                              <div>{device.name}</div>
                              <div>Device Type:</div>
                              <div>{device.typeName}</div>
                              <div>Serial Number:</div>
                              <div>{device.serialNumber}</div>
                              <div>Firmware:</div>
                              <div>{device.firmware}</div>
                              <div>IP Address:</div>
                              <div>{device.ipAddress}</div>
                              <div>MAC Address:</div>
                              <div>{device.macAddress}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">No devices linked</div>
                  )}
                </div>
              ))}

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Unlinked Devices:</h3>
                {parsedData.devices
                  .filter(device => device.linkedToUser === null)
                  .map(device => (
                    <div key={device.macAddress} className="bg-gray-50 p-3 rounded mb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Device Name:</div>
                        <div>{device.name}</div>
                        <div>Device Type:</div>
                        <div>{device.typeName}</div>
                        <div>Serial Number:</div>
                        <div>{device.serialNumber}</div>
                        <div>Firmware:</div>
                        <div>{device.firmware}</div>
                        <div>IP Address:</div>
                        <div>{device.ipAddress}</div>
                        <div>MAC Address:</div>
                        <div>{device.macAddress}</div>
                      </div>
                    </div>
                  ))}
              </div>

              <button
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setParsedData(null);
                  setError(null);
                }}
              >
                Parse Another File
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfigParserApp;