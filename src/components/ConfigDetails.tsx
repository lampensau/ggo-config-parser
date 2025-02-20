import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ConfigInfo } from '@/types/config';

interface ConfigDetailsProps {
  configInfo: ConfigInfo;
}

export const ConfigDetails: React.FC<ConfigDetailsProps> = ({ configInfo }) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="text-emerald-700 dark:text-gray-100">
          Configuration Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {Object.entries(configInfo).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <dt className="font-medium text-gray-500 dark:text-gray-400">
                {key}
              </dt>
              <dd className="text-gray-900 dark:text-gray-100">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}; 