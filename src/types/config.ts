export interface Device {
  name: string;
  deviceType: number;
  typeName: string;
  serialNumber: string;
  firmware: string;
  ipAddress: string;
  macAddress: string;
  linkedToUser: string | null;
  syncStatus: number;
}

export interface User {
  id: string;
  name: string;
  color: string;
  devices: Device[];
  channelAssignments?: ChannelAssignment[];
  details?: UserDetails;
}

export interface ConfigInfo {
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

export interface ParsedConfig {
  configInfo: ConfigInfo;
  users: User[];
  devices: Device[];
}

export interface DeviceTypes {
  [key: number]: string;
}

export interface ChannelAssignment {
  type: 'user' | 'group';
  id: string;
  name: string;
  channelNumber: number;
  talkMode: number;
  listenMode: number;
  channelMode: number;
  isListening: boolean;
  volume: number;
  talkState: number;
  callMode: number;
  priority: number;
}

export interface Group {
  id: string;
  name: string;
  color: string;
}

export interface UserSpecialChannel {
  status: number;
  Assign: {
    Type: number;
    Id: number;
  };
  Level: {
    Value: number;
    min: number;
    max: number;
  };
}

export interface UserSettings {
  Isolate: number;
  // Add other settings as needed
}

export interface DeviceProfileScript {
  Id?: string;
  // Add other script settings as needed
}

export interface DeviceProfile {
  ScriptSettings?: DeviceProfileScript;
  // Add other profile settings as needed
}

export interface FlexListEntry {
  Type: number;
  Id: number;
}

export interface UserDetails {
  DisplayName?: string;
  SpecialChannels?: {
    Program?: UserSpecialChannel;
  };
  DeviceProfiles?: Record<string, DeviceProfile>;
  Settings?: UserSettings;
  FlexList?: FlexListEntry[];
}

export interface RawConfigData {
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
  // ... rest of the interface
}

// Add other Raw* interfaces here