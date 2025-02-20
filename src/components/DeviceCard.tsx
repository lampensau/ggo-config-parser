import { Device } from '@/types/config';

interface DeviceCardProps {
  device: Device;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Name: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {device.name}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {device.typeName}
          </span>
        </div>
        <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <span className="text-gray-500 dark:text-gray-400">S/N: </span>
            <span className="text-gray-900 dark:text-gray-100">
              {device.serialNumber}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">FW: </span>
            <span className="text-gray-900 dark:text-gray-100">
              {device.firmware}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">IP: </span>
            <span className="font-mono text-gray-900 dark:text-gray-100">
              {device.ipAddress}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">MAC: </span>
            <span className="font-mono text-gray-900 dark:text-gray-100">
              {device.macAddress}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 