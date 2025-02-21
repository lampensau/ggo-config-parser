import { User } from '@/types/config';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface UserSummaryProps {
  user: User;
}

export const UserSummary: React.FC<UserSummaryProps> = ({ user }) => {
  const getProgramAssignment = () => {
    const program = user.details?.SpecialChannels?.Program;
    if (!program || program.Assign.Type !== 2) return 'Not assigned';
    return `Group ${program.Assign.Id}`;
  };

  const getDeviceProfiles = () => {
    if (!user.details?.DeviceProfiles) return 'None';
    return Object.keys(user.details.DeviceProfiles).join(', ');
  };

  const getScriptStatus = () => {
    if (!user.details?.DeviceProfiles) return 'N/A';

    const profilesWithScripts = Object.entries(user.details.DeviceProfiles)
      .filter(([, profile]) => profile.ScriptSettings?.Id)
      .map(([type]) => type);

    return profilesWithScripts.length > 0
      ? `Active (${profilesWithScripts.join(', ')})`
      : 'Not active';
  };

  const getIsolateState = () => {
    return user.details?.Settings?.Isolate === 1 ? 'Active' : 'Inactive';
  };

  const getFlexListInfo = () => {
    if (!user.details?.FlexList?.length) return 'No targets';
    return `${user.details.FlexList.length} target${user.details.FlexList.length !== 1 ? 's' : ''}`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-8 text-sm">
      <div>
        <div className="text-gray-500 dark:text-gray-400">Display Name</div>
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {user.details?.DisplayName || 'Not set'}
        </div>
      </div>

      <div>
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <div>
                <div className="text-gray-500 dark:text-gray-400">PGM Assignment</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {getProgramAssignment()}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Program channel assignment</TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      </div>

      <div>
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Device Profiles</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {getDeviceProfiles()}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Configured device types for this user</TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      </div>

      <div>
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Script Status</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {getScriptStatus()}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Script configuration status for device profiles</TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      </div>

      <div>
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Isolate</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {getIsolateState()}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Channel isolation state</TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      </div>

      <div>
        <TooltipProvider>
          <TooltipRoot>
            <TooltipTrigger asChild>
              <div>
                <div className="text-gray-500 dark:text-gray-400">Flex List</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {getFlexListInfo()}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Number of flex list targets</TooltipContent>
          </TooltipRoot>
        </TooltipProvider>
      </div>
    </div>
  );
}; 