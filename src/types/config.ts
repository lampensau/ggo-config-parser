export interface Device {
  name: string;
  deviceType: number;
  typeName: string;
  serialNumber: string;
  firmware: string;
  ipAddress: string;
  macAddress: string;
  linkedToUser: string | null;
}

export interface User {
  id: string;
  name: string;
  color: string;
  devices: Device[];
}

export interface ConfigInfo {
  "Configuration Name": string;
  "Configuration ID": string;
  "Multicast Address": string;
  "Config Timestamp": string;
  "Binary Timestamp": string;
  "Unassigned Devices": number;
}

export interface ParsedConfig {
  configInfo: ConfigInfo;
  users: User[];
  devices: Device[];
}

export interface DeviceTypes {
  [key: number]: string;
}