import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ConfigInfo } from '@/types/config';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface ConfigDetailsProps {
  configInfo: ConfigInfo;
}

export const ConfigDetails: React.FC<ConfigDetailsProps> = ({ configInfo }) => {
  const getStatusClasses = () => {
    return configInfo.state.newBinary === 0
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      : 'bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
  };

  const getStatusText = () => {
    return configInfo.state.newBinary === 0 ? 'Up to date' : 'Update pending';
  };

  const getStatusTooltip = () => {
    return configInfo.state.newBinary === 0
      ? 'All devices are using the latest system configuration'
      : 'Some devices may use an outdated system configuration';
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-emerald-700 dark:text-gray-100">
            Configuration Details
          </CardTitle>
          <TooltipProvider>
            <TooltipRoot>
              <TooltipTrigger asChild>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusClasses()}`}>
                  {getStatusText()}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {getStatusTooltip()}
              </TooltipContent>
            </TooltipRoot>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {Object.entries(configInfo)
            .filter(([key]) => key !== 'state')
            .map(([key, value]) => (
              <div key={key} className="space-y-1">
                <dt className="font-medium text-gray-500 dark:text-gray-400">
                  {key}
                </dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {value}
                </dd>
              </div>
            ))}
        </dl>
      </CardContent>
    </Card>
  );
}; 