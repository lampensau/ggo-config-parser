import {
  ParsedConfig,
  User,
  Device,
  ChannelAssignment,
  Group,
  UserDetails,
  UserSpecialChannel,
  DeviceProfile,
  UserSettings,
  FlexListEntry
} from '@/types/config';
import { isValidConfigDateFormat } from '@/lib/utils';
import {
  DEVICE_TYPES,
  ERROR_MESSAGES,
  REQUIRED_SETTINGS,
  DEFAULT_EMPTY_VALUE
} from '@/constants';

export const getDeviceTypeName = (typeId: number): string => {
  return DEVICE_TYPES[typeId as keyof typeof DEVICE_TYPES] || ERROR_MESSAGES.UNKNOWN_DEVICE_TYPE;
};

interface RawConfigData {
  Settings?: {
    Name: string;
    configId: string;
    MulticastAddress: string;
    savedAtTimestamp: string;
    binaryTimestamp: string;
  };
  State?: {
    newBinary: number;
    configChanged: number;
    following: number;
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
  Groups?: {
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
  Channels?: Record<string, RawChannelData>;
  DisplayName?: string;
  SpecialChannels?: Record<string, UserSpecialChannel>;
  DeviceProfiles?: Record<string, DeviceProfile>;
  Settings?: UserSettings;
  FlexList?: FlexListEntry[];
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

interface RawChannelData {
  myId: string;
  Assign: {
    Type: number;
    Id: string | number;
  };
  TalkMode: number;
  ListenMode: number;
  ChannelMode: number;
  Listen: number;
  Level: {
    Value: number;
    min: number;
    max: number;
  };
  talkState: number;
  CallMode: number;
  Priority: number;
}

interface RawGroupData {
  myId: string;
  Name: string;
  Color: string;
}

interface ConfigInfoData {
  "Configuration Name": string;
  "Configuration ID": string;
  "Multicast Address": string;
  "Config Timestamp": string;
  "Binary Timestamp": string;
  "Unassigned Devices": number;
  state: {
    newBinary: number;
  };
}

interface RawDeviceStatusData {
  myId: string;
  Name: string;
  syncStatus: number;
  macAddress: string;
}

const formatConfigDate = (dateString: string): string => {
  try {
    // Input format: "DD-M-YYYY HH:mm:ss"
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes, seconds] = timePart.split(':');

    // Create date using numeric values
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Months are 0-based in JS
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date created from:', dateString);
      return ERROR_MESSAGES.INVALID_DATE;
    }

    // Format the date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(',', '');

  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateString);
    return ERROR_MESSAGES.INVALID_DATE;
  }
};

const DEBUG = process.env.NODE_ENV !== 'production';

export const getPriorityName = (priority: number): string => {
  const priorities = {
    [-1]: "Low",
    0: "Normal",
    1: "High"
  };
  return priorities[priority as keyof typeof priorities] || "Normal";
};

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

    // Validate date formats
    const savedAtTimestamp = data.Settings?.savedAtTimestamp || '';
    const binaryTimestamp = data.Settings?.binaryTimestamp || '';

    if (!isValidConfigDateFormat(savedAtTimestamp)) {
      console.warn('Invalid savedAtTimestamp format:', savedAtTimestamp);
    }
    if (!isValidConfigDateFormat(binaryTimestamp)) {
      console.warn('Invalid binaryTimestamp format:', binaryTimestamp);
    }

    // Extract configuration details
    const configInfo: ConfigInfoData = {
      "Configuration Name": data.Settings?.Name || "Unknown",
      "Configuration ID": data.Settings?.configId || "Unknown",
      "Multicast Address": data.Settings?.MulticastAddress || "Unknown",
      "Config Timestamp": formatConfigDate(savedAtTimestamp || "Invalid Date"),
      "Binary Timestamp": formatConfigDate(binaryTimestamp || "Invalid Date"),
      "Unassigned Devices": 0,
      state: {
        newBinary: data.State?.newBinary ?? 0
      }
    };

    // Extract groups first since we need them for channel assignments
    const groups = extractGroups(data.Groups ?? {});

    // Extract users with channel assignments
    const users = extractUsers(data.Users ?? {}, groups);

    // Extract devices
    const deviceAssignments = extractDeviceAssignments(data.Devices ?? {});

    // Get both regular and wireless devices
    const regularDevices = extractDevices(
      data.Devices ?? {},
      data.Network ?? {},
      deviceAssignments
    );
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

const extractGroups = (groups: Record<string, unknown>): Map<string, Group> => {
  const groupsMap = new Map<string, Group>();

  Object.entries(groups)
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .forEach(([id, groupData]) => {
      const data = groupData as RawGroupData;
      groupsMap.set(id, {
        id,
        name: data.Name,
        color: data.Color?.toString() || '0'
      });
    });

  return groupsMap;
};

const extractUserDetails = (userData: RawUserData): UserDetails => {
  return {
    DisplayName: userData.DisplayName,
    SpecialChannels: userData.SpecialChannels,
    DeviceProfiles: userData.DeviceProfiles,
    Settings: userData.Settings,
    FlexList: userData.FlexList
  };
};

const extractUsers = (
  users: Record<string, unknown>,
  groups: Map<string, Group>
): User[] => {
  return Object.entries(users)
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .map(([id, userData]) => {
      const data = userData as RawUserData;

      const channelAssignments: ChannelAssignment[] = [];

      if (data.Channels) {
        Object.entries(data.Channels)
          .filter(([key]) => key !== 'keys')
          .forEach(([channelNum, channelData]) => {
            const assignment = channelData.Assign;
            if (assignment && assignment.Type && assignment.Id) {
              const targetId = assignment.Id.toString();
              const isUser = assignment.Type === 1;
              const targetName = isUser ?
                (users[targetId] as RawUserData)?.Name || 'Unknown User' :
                groups.get(targetId)?.name || 'Unknown Group';

              channelAssignments.push({
                type: isUser ? 'user' : 'group',
                id: targetId,
                name: targetName,
                channelNumber: parseInt(channelNum),
                talkMode: channelData.TalkMode,
                listenMode: channelData.ListenMode,
                channelMode: channelData.ChannelMode,
                isListening: channelData.Listen === 1,
                volume: channelData.Level?.Value ?? 0,
                talkState: channelData.talkState,
                callMode: channelData.CallMode,
                priority: channelData.Priority
              });
            }
          });
      }

      return {
        id,
        name: data.Name,
        color: data.Color,
        devices: [],
        channelAssignments: channelAssignments.length > 0 ? channelAssignments : undefined,
        details: extractUserDetails(data)
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
  networkDevices: Record<string, unknown>,
  deviceAssignments: { [key: string]: string }
): Device[] => {
  // Create a map of sync statuses from the Devices section
  const syncStatuses = new Map<string, number>();
  Object.entries(devices)
    .filter(([key]) => key !== 'keys' && key !== 'badge')
    .forEach(([, deviceData]) => {
      const data = deviceData as RawDeviceStatusData;
      if (data.macAddress) {
        syncStatuses.set(data.macAddress, data.syncStatus);
      }
    });

  return Object.entries(networkDevices)
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
        linkedToUser: deviceAssignments[shortDeviceId] || null,
        syncStatus: syncStatuses.get(data.macAddress) ?? 0
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