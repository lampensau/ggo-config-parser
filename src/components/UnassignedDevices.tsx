import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DeviceCard } from './DeviceCard';
import { Device } from '@/types/config';

interface UnassignedDevicesProps {
  devices: Device[];
}

export const UnassignedDevices: React.FC<UnassignedDevicesProps> = ({ devices }) => {
  const unassignedDevices = devices.filter(device => device.linkedToUser === null);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
          Unassigned Devices
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-normal ml-2">
            ({unassignedDevices.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {unassignedDevices.map(device => (
            <DeviceCard key={device.macAddress} device={device} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 