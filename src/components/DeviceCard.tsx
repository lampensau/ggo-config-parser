import { memo } from 'react';
import { DeviceCardProps } from '@/types/ui';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const getSyncStatusColor = (status: number) => {
  return status === 1
    ? 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
};

const getSyncStatusText = (status: number) => {
  return status === 1 ? 'Out of sync' : 'In sync';
};

export const DeviceCard = memo<DeviceCardProps>(({ device }) => {
  return (
    <div className={cn(
      'bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600',
      device.syncStatus === 1 && 'bg-orange-50/50 dark:bg-orange-950/50'
    )}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Name: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {device.name}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {device.typeName}
            </span>
            <TooltipProvider>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSyncStatusColor(device.syncStatus)}`}>
                    {getSyncStatusText(device.syncStatus)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {device.syncStatus === 1
                    ? 'Device configuration differs from user configuration'
                    : 'Device configuration matches user configuration'
                  }
                </TooltipContent>
              </TooltipRoot>
            </TooltipProvider>
          </div>
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
});

DeviceCard.displayName = 'DeviceCard'; 