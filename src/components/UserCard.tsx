import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DeviceCard } from './DeviceCard';
import { ChevronDown, ChevronUp, User as UserIcon, Users, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import type { ChannelAssignment } from '@/types/config';
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { UserSummary } from './UserSummary';
import { getPriorityName } from '@/services/configParser';
import {
  TALK_MODES,
  LISTEN_MODES,
  CHANNEL_MODES,
  CALL_MODES
} from '@/constants';
import type { UserCardProps } from '@/types/ui';

const ChannelAssignmentHeader: React.FC = () => {
  return (
    <div className="flex items-center py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
      <div className="w-12">CH</div>
      <div className="flex-1 min-w-[120px]">ASSIGNMENT</div>
      <div className="w-24">LISTEN</div>
      <div className="w-20">TALK</div>
      <div className="w-28">TALK MODE</div>
      <div className="w-28">LISTEN MODE</div>
      <div className="w-28">CALL MODE</div>
      <div className="w-24">CH MODE</div>
      <div className="w-20">PRIORITY</div>
    </div>
  );
};

const ChannelAssignmentRow: React.FC<{ assignment: ChannelAssignment }> = ({ assignment }) => {
  return (
    <div className="flex items-center py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition-colors">
      <div className="w-12 font-medium text-gray-700 dark:text-gray-300">
        {assignment.channelNumber}
      </div>

      <div className="flex-1 flex items-center gap-1.5 min-w-[120px] text-gray-700 dark:text-gray-300">
        {assignment.type === 'user' ? (
          <UserIcon className="w-3.5 h-3.5 text-gray-500" />
        ) : (
          <Users className="w-3.5 h-3.5 text-gray-500" />
        )}
        <span className="truncate">{assignment.name}</span>
      </div>

      <div className="w-24 flex items-center gap-1.5">
        {assignment.isListening ? (
          <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-gray-400" />
        )}
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {assignment.volume > 0 ? `+${assignment.volume}` : assignment.volume}dB
        </span>
      </div>

      <div className="w-20 flex items-start justify-start">
        {assignment.talkState === 1 ? (
          <Mic className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <MicOff className="w-3.5 h-3.5 text-gray-400" />
        )}
      </div>

      <div className="w-28 text-gray-600 dark:text-gray-400">
        {TALK_MODES[assignment.talkMode as keyof typeof TALK_MODES] || "Unknown"}
      </div>

      <div className="w-28 text-gray-600 dark:text-gray-400">
        {LISTEN_MODES[assignment.listenMode as keyof typeof LISTEN_MODES] || "Unknown"}
      </div>

      <div className="w-28 text-gray-600 dark:text-gray-400">
        {CALL_MODES[assignment.callMode as keyof typeof CALL_MODES] || "Unknown"}
      </div>

      <div className="w-24 text-gray-600 dark:text-gray-400">
        {CHANNEL_MODES[assignment.channelMode as keyof typeof CHANNEL_MODES] || "Unknown"}
      </div>

      <div className="w-20 text-gray-600 dark:text-gray-400">
        {getPriorityName(assignment.priority)}
      </div>
    </div>
  );
};

const UserCard: React.FC<UserCardProps> = ({ user, devices }) => {
  const [showChannels, setShowChannels] = useState(false);
  const linkedDevices = devices.filter(device => device.linkedToUser === user.id);

  const getDeviceCountStatus = () => {
    if (linkedDevices.length === 0) return null;

    const outOfSyncCount = linkedDevices.filter(device => device.syncStatus === 1).length;

    if (outOfSyncCount === 0) {
      return {
        classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
        tooltip: 'All user devices are in sync'
      };
    }

    if (outOfSyncCount === linkedDevices.length) {
      return {
        classes: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
        tooltip: 'All user devices are out of sync'
      };
    }

    return {
      classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
      tooltip: `${outOfSyncCount} of ${linkedDevices.length} user devices out of sync`
    };
  };

  const status = getDeviceCountStatus();

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span>{user.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
              (ID: {user.id})
            </span>
            {status && (
              <TooltipProvider>
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.classes}`}>
                      {linkedDevices.length} device{linkedDevices.length !== 1 ? 's' : ''}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {status.tooltip}
                  </TooltipContent>
                </TooltipRoot>
              </TooltipProvider>
            )}
          </CardTitle>

          {user.channelAssignments && user.channelAssignments.length > 0 && (
            <TooltipProvider>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowChannels(!showChannels)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showChannels ? (
                      <>Hide User Channels <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Show User Channels <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {showChannels
                    ? "Hide this user's channel assignments"
                    : "Show this user's channel assignments"
                  }
                </TooltipContent>
              </TooltipRoot>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div>
          <UserSummary user={user} />
        </div>

        {showChannels && user.channelAssignments && (
          <div>
            <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
              Channel Assignments
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="space-y-0.5">
                <ChannelAssignmentHeader />
                {user.channelAssignments.map((assignment) => (
                  <ChannelAssignmentRow
                    key={`${assignment.type}-${assignment.id}-${assignment.channelNumber}`}
                    assignment={assignment}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-2">
            Assigned Devices
          </h3>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;