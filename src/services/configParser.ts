import { ParsedConfig, DeviceTypes, User, Device } from '@/types/config';

export const deviceTypes: DeviceTypes = {
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

export const getDeviceTypeName = (typeId: number): string => {
  return deviceTypes[typeId] || "Unknown Device Type";
};

export const parseConfigFile = (fileContent: string): ParsedConfig => {
  try {
    const config = JSON.parse(fileContent);

    // Helper function to format dates
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '');
    };

    // Extract configuration details
    const configInfo = {
      "Configuration Name": config.Settings.Name,
      "Configuration ID": config.Settings.configId.substring(0, 8),
      "Multicast Address": config.Settings.MulticastAddress,
      "Config Timestamp": formatDate(config.Settings.savedAtTimestamp),
      "Binary Timestamp": formatDate(config.Settings.binaryTimestamp)
    };

    // Extract users and devices
    const users = extractUsers(config);
    const deviceAssignments = extractDeviceAssignments(config);
    const devices = extractDevices(config, deviceAssignments);

    // Count unassigned devices
    const unassignedDevices = devices.filter(device => device.linkedToUser === null).length;
    configInfo["Unassigned Devices"] = unassignedDevices;

    return { configInfo, users, devices };
  } catch (_err) {
    throw new Error('Failed to parse configuration file');
  }
};

const extractUsers = (config: any): User[] => {
  return Object.entries(config.Users)
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .map(([id, userData]: [string, any]) => ({
      id,
      name: userData.Name,
      color: userData.Color,
      devices: []
    }));
};

const extractDeviceAssignments = (config: any): { [key: string]: string } => {
  const assignments: { [key: string]: string } = {};
  Object.entries(config.Devices || {})
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .forEach(([deviceId, deviceData]: [string, any]) => {
      if (deviceData.UserId && deviceData.UserId.Type === 1) {
        const shortDeviceId = deviceId.slice(-6);
        assignments[shortDeviceId] = deviceData.UserId.Id.toString();
      }
    });
  return assignments;
};

const extractDevices = (config: any, deviceAssignments: { [key: string]: string }): Device[] => {
  return Object.entries(config.Network || {})
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .map(([macAddress, deviceData]: [string, any]) => {
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
};

interface DeviceData {
  name: string;
  deviceType: number;
  serialNumber: string;
  firmware: string;
  ipAddress: string;
  macAddress: string;
  linkedToUser: string | null;
}

interface UserData {
  id: string;
  name: string;
  color: string;
  devices: DeviceData[];
}

const parseDevices = (data: DeviceData[]): Device[] => {
  // ... implementation
};

const parseUsers = (data: UserData[]): User[] => {
  // ... implementation
};

const deviceTypeMap: Record<number, string> = {
  // ... your device type mappings
};

const getDeviceType = (deviceType: number): string => {
  return deviceTypeMap[deviceType] || 'Unknown Device Type';
}; 