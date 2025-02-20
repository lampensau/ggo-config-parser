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

interface RawConfigData {
  name: string;
  id: string;
  multicastAddress: string;
  timestamp: string;
  binaryTimestamp: string;
  users: Record<string, unknown>;
  devices: Record<string, unknown>;
}

interface RawUserData {
  Name: string;
  Color: string;
  UserId?: {
    Type: number;
    Id: string;
  };
}

interface RawDeviceData {
  Name: string;
  deviceType: number;
  serialNumber: string;
  firmwareName: string;
  IpAddress: string;
  macAddress: string;
  UserId?: {
    Type: number;
    Id: string;
  };
}

export function parseConfigFile(fileContent: string): ParsedConfig {
  try {
    const data = JSON.parse(fileContent) as RawConfigData;

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
      "Configuration Name": data.name,
      "Configuration ID": data.id.substring(0, 8),
      "Multicast Address": data.multicastAddress,
      "Config Timestamp": formatDate(data.timestamp),
      "Binary Timestamp": formatDate(data.binaryTimestamp)
    };

    // Extract users and devices
    const users = extractUsers(data.users);
    const deviceAssignments = extractDeviceAssignments(data.devices);
    const devices = extractDevices(data.devices, deviceAssignments);

    // Count unassigned devices
    const unassignedDevices = devices.filter(device => device.linkedToUser === null).length;
    configInfo["Unassigned Devices"] = unassignedDevices;

    return { configInfo, users, devices };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse config file: ${error.message}`);
    }
    throw new Error('Failed to parse config file');
  }
}

const extractUsers = (users: Record<string, unknown>): User[] => {
  return Object.entries(users)
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .map(([id, userData]) => {
      const data = userData as RawUserData;
      return {
        id,
        name: data.Name,
        color: data.Color,
        devices: []
      };
    });
};

const extractDeviceAssignments = (devices: Record<string, unknown>): { [key: string]: string } => {
  const assignments: { [key: string]: string } = {};
  Object.entries(devices)
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .forEach(([deviceId, deviceData]) => {
      const data = deviceData as RawDeviceData;
      if (data.UserId && data.UserId.Type === 1) {
        const shortDeviceId = deviceId.slice(-6);
        assignments[shortDeviceId] = data.UserId.Id.toString();
      }
    });
  return assignments;
};

const extractDevices = (devices: Record<string, unknown>, deviceAssignments: { [key: string]: string }): Device[] => {
  return Object.entries(devices)
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .map(([macAddress, deviceData]) => {
      const data = deviceData as RawDeviceData;
      const shortDeviceId = macAddress
        .split('-')
        .slice(-3)
        .join('')
        .toUpperCase();

      return {
        name: data.Name,
        deviceType: data.deviceType,
        typeName: getDeviceTypeName(data.deviceType),
        serialNumber: data.serialNumber,
        firmware: data.firmwareName,
        ipAddress: data.IpAddress,
        macAddress: data.macAddress,
        linkedToUser: deviceAssignments[shortDeviceId] || null
      };
    });
};

export function parseDeviceType(deviceType: number): string {
  return getDeviceTypeName(deviceType);
}

export function parseDeviceData(deviceData: RawDeviceData): Device {
  return {
    name: deviceData.Name,
    deviceType: deviceData.deviceType,
    typeName: getDeviceTypeName(deviceData.deviceType),
    serialNumber: deviceData.serialNumber,
    firmware: deviceData.firmwareName,
    ipAddress: deviceData.IpAddress,
    macAddress: deviceData.macAddress,
    linkedToUser: null
  };
}

export function parseUserData(userData: RawUserData): User {
  return {
    id: '',  // This needs to be provided externally
    name: userData.Name,
    color: userData.Color,
    devices: []
  };
}

export function parseDeviceMacAddress(deviceData: Record<string, unknown>): string {
  const macAddress = deviceData.macAddress as string;
  return macAddress;
} 