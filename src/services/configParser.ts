import { ParsedConfig, DeviceTypes, User, Device } from '@/types/config';

export const deviceTypes: DeviceTypes = {
  258: "BPX Belt Pack",
  259: "BPXSP Sports Belt Pack",
  321: "WBPX Wireless Belt Pack",
  322: "WBPXSP Wireless Sports Belt Pack",
  325: "WBPRVCBRS Wireless Belt Pack",
  326: "WBPRVCBRSSP Wireless Sports Belt Pack",
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
  899: "SiRDX Interface",
  900: "Si4WR Interface",
  901: "Si2WR Interface",
  902: "SiBR8RV Interface"
};

export const getDeviceTypeName = (typeId: number): string => {
  return deviceTypes[typeId] || "Unknown Device Type";
};

interface RawConfigData {
  Settings?: {
    Name: string;
    configId: string;
    MulticastAddress: string;
    savedAtTimestamp: string;
    binaryTimestamp: string;
  };
  Users?: {
    keys: string[];
    [key: string]: unknown;
  };
  Network?: {
    keys: string[];
    [key: string]: unknown;
  };
  Devices?: {
    keys: string[];
    [key: string]: unknown;
  };
  WirelessClients?: {
    keys: string[];
    [key: string]: unknown;
  };
  UsbDevices?: {
    keys: string[];
    [key: string]: unknown;
  };
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

interface RawWirelessDeviceData {
  myId: string;
  Name: string;
  deviceType: number;
  deviceId: string;
  poolData?: {
    rfId: string;
  };
}

interface RawDeviceAssignmentData {
  myId: string;
  UserId?: {
    Type: number;
    Id: number;  // Changed to number since user IDs are numbers
  };
}

interface RawUsbDeviceData {
  deviceId: string;
  serialNumber: number;
  firmwareName: string;
}

interface ConfigInfoData {
  "Configuration Name": string;
  "Configuration ID": string;
  "Multicast Address": string;
  "Config Timestamp": string;
  "Binary Timestamp": string;
  "Unassigned Devices": number;
}

const DEFAULT_EMPTY_VALUE = '-';

const formatConfigDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

const DEBUG = process.env.NODE_ENV !== 'production';

const REQUIRED_SETTINGS = [
  'Name',
  'configId',
  'MulticastAddress',
  'savedAtTimestamp',
  'binaryTimestamp'
] as const;

export function parseConfigFile(fileContent: string): ParsedConfig {
  try {
    const data = JSON.parse(fileContent) as RawConfigData;

    if (DEBUG) {
      console.log('Parsed data structure:', {
        name: data.Settings?.Name,
        id: data.Settings?.configId,
        multicastAddress: data.Settings?.MulticastAddress,
        timestamp: data.Settings?.savedAtTimestamp,
        binaryTimestamp: data.Settings?.binaryTimestamp
      });
    }

    // Validate required fields
    const missingFields = REQUIRED_SETTINGS.filter(field => !data.Settings?.[field]);
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      throw new Error('Invalid configuration file structure');
    }

    // Extract configuration details with proper typing
    const configInfo: ConfigInfoData = {
      "Configuration Name": data.Settings?.Name ?? 'Unknown',
      "Configuration ID": (data.Settings?.configId ?? '').substring(0, 8),
      "Multicast Address": data.Settings?.MulticastAddress ?? '',
      "Config Timestamp": formatConfigDate(data.Settings?.savedAtTimestamp ?? ''),
      "Binary Timestamp": formatConfigDate(data.Settings?.binaryTimestamp ?? ''),
      "Unassigned Devices": 0
    };

    // Extract users and devices
    const users = extractUsers(data.Users ?? {});
    const deviceAssignments = extractDeviceAssignments(data.Devices ?? {});

    // Get both regular and wireless devices
    const regularDevices = extractDevices(data.Network ?? {}, deviceAssignments);
    const wirelessDevices = extractWirelessDevices(
      data.WirelessClients ?? {},
      deviceAssignments,
      data.UsbDevices ?? {}
    );

    // Combine all devices
    const devices = [...regularDevices, ...wirelessDevices];

    // Count unassigned devices
    configInfo["Unassigned Devices"] = devices.filter(device => device.linkedToUser === null).length;

    return { configInfo, users, devices };
  } catch (error: unknown) {
    // Enhanced error logging
    console.error('Error parsing config file:', error);
    console.error('File content preview:', fileContent.substring(0, 200) + '...');

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

const extractDeviceAssignments = (
  devices: Record<string, unknown>
): { [key: string]: string } => {
  const assignments: { [key: string]: string } = {};

  // Handle all devices (both regular and wireless)
  Object.entries(devices)
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .forEach(([deviceId, deviceData]) => {
      const data = deviceData as RawDeviceAssignmentData;
      if (data.UserId && data.UserId.Type === 1) {
        // For wired devices, we need to store both formats of the ID
        // Store the full ID for wireless devices
        assignments[deviceId] = data.UserId.Id.toString();
        // Store the short ID for wired devices
        const shortDeviceId = deviceId.slice(-6);
        assignments[shortDeviceId] = data.UserId.Id.toString();
      }
    });

  return assignments;
};

const extractDevices = (
  devices: Record<string, unknown>,
  deviceAssignments: { [key: string]: string }
): Device[] => {
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

const extractUsbDeviceInfo = (
  usbDevices: Record<string, unknown>
): Map<string, { serialNumber: string, firmware: string }> => {
  const deviceInfo = new Map();

  if (!usbDevices?.keys) return deviceInfo;

  Object.entries(usbDevices)
    .filter(([key]) => key !== 'keys')
    .forEach(([, deviceData]) => {
      const data = deviceData as RawUsbDeviceData;
      if (data.deviceId && data.serialNumber) {
        deviceInfo.set(data.deviceId, {
          serialNumber: data.serialNumber.toString(),
          firmware: data.firmwareName || DEFAULT_EMPTY_VALUE
        });
      }
    });

  return deviceInfo;
};

const extractWirelessDevices = (
  wirelessClients: Record<string, unknown>,
  deviceAssignments: { [key: string]: string },
  usbDevices: Record<string, unknown>
): Device[] => {
  if (!wirelessClients?.keys) return [];

  // Get USB device information
  const usbDeviceInfo = extractUsbDeviceInfo(usbDevices);

  return Object.entries(wirelessClients)
    .filter(([key]) => key !== 'keys')
    .map(([deviceId, deviceData]) => {
      const data = deviceData as RawWirelessDeviceData;

      // Only create device if we have the minimum required data
      if (!data.Name || !data.deviceType) {
        console.warn(`Skipping wireless device ${deviceId} due to missing required data`);
        return null;
      }

      // Get additional info from USB devices if available
      const additionalInfo = usbDeviceInfo.get(deviceId);

      return {
        name: data.Name,
        deviceType: data.deviceType,
        typeName: getDeviceTypeName(data.deviceType),
        serialNumber: additionalInfo?.serialNumber || DEFAULT_EMPTY_VALUE,
        firmware: additionalInfo?.firmware || DEFAULT_EMPTY_VALUE,
        ipAddress: DEFAULT_EMPTY_VALUE,     // No IP for wireless devices
        macAddress: data.poolData?.rfId ?? deviceId,
        linkedToUser: deviceAssignments[deviceId] || null
      };
    })
    .filter((device): device is Device => device !== null);
};

export function parseDeviceMacAddress(deviceData: Record<string, unknown>): string {
  const macAddress = deviceData.macAddress as string;
  return macAddress;
} 