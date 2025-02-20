import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DeviceCard } from './DeviceCard';
import { User, Device } from '@/types/config';

interface UserDevicesProps {
  user: User;
  devices: Device[];
}

export const UserDevices: React.FC<UserDevicesProps> = ({ user, devices }) => {
  const linkedDevices = devices.filter(device => device.linkedToUser === user.id);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
          User: {user.name}
          <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-2">
            (ID: {user.id})
          </span>
          {linkedDevices.length > 0 && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-normal ml-2">
              {linkedDevices.length} device{linkedDevices.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {linkedDevices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedDevices.map(device => (
              <DeviceCard key={device.macAddress} device={device} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">
            No devices linked
          </p>
        )}
      </CardContent>
    </Card>
  );
}; 