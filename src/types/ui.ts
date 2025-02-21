import { ParsedConfig, User, Device } from './config';
import type { Device as DeviceType } from './config';

export interface DeviceCardProps {
  device: DeviceType;
}

export interface UserCardProps {
  user: User;
  devices: Device[];
}

export interface UnassignedDevicesProps {
  devices: Device[];
}

export interface HeaderProps {
  parsedData: ParsedConfig | null;
  onExport: () => void;
  onReset: () => void;
  theme: string | undefined;
  onThemeChange: () => void;
  mounted: boolean;
}

export interface FileUploadAreaProps {
  isDragging: boolean;
  error: string | null;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  isLoading?: boolean;
} 