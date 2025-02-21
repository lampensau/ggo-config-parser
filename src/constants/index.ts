export const DEFAULT_EMPTY_VALUE = '-';

export const DEVICE_TYPES = {
  258: "BPX Belt Pack",
  259: "BPXSP Sports Belt Pack",
  321: "WBPX Wireless Belt Pack",
  322: "WBPXSP Wireless Sports Belt Pack",
  325: "WBPRVCBRS Wireless Belt Pack",
  326: "WBPRVCBRSSP Wireless Sports Belt Pack",
  384: "Wallpanels Group",
  385: "WPSP Wallpanel",
  386: "WPHS Wallpanel",
  387: "WPNA Wallpanel",
  388: "WPX Wallpanel",
  513: "MCD08 Desk Station",
  514: "MCR12 Desk Station",
  515: "MCD16 Desk Station",
  516: "MCD24 Desk Station",
  517: "MCD32 Desk Station",
  518: "MCX Rack Station",
  519: "MCXEXT Rack Channel Extension",
  520: "MCXD Desk Station",
  521: "MCXDEXT Desk Channel Extension",
  769: "4W Interface",
  770: "2W Interface",
  771: "BRIDGE Interface",
  772: "INTERFACEX (LCD)",
  773: "INTERFACEX (TFT)",
  774: "BRIDGEX Interface (LCD)",
  775: "BRIDGEX Interface (TFT)",
  776: "Q4WR Interface",
  777: "DANTE Interface",
  897: "BCN Beacon",
  898: "WAA Antenna",
  899: "SiRDX Interface",
  900: "Si4WR Interface",
  901: "Si2WR Interface",
  902: "SiBR8RV Interface"
} as const;

export const TALK_MODES = {
  0: "Disabled",
  1: "Momentary",
  2: "Latch",
  3: "Latch/Mom"
} as const;

export const LISTEN_MODES = {
  0: "Listen on talk",
  1: "Listen on talk ignore",
  2: "Islate ignore",
  3: "Fixed"
} as const;

export const CHANNEL_MODES = {
  0: "Normal",
  1: "No reply",
  2: "Reply direct",
  3: "Auto reply",
  4: "Auto talk",
  5: "Solo talk",
  6: "GPIO control",
  7: "Flex list"
} as const;

export const CALL_MODES = {
  0: "Disabled",
  1: "Receive only",
  2: "Send only",
  3: "Send/Receive"
} as const;

export const REQUIRED_SETTINGS = [
  'Name',
  'configId',
  'MulticastAddress',
  'savedAtTimestamp',
  'binaryTimestamp'
] as const;

export const ERROR_MESSAGES = {
  INVALID_FILE: 'Invalid configuration file structure',
  INVALID_DATE: 'Invalid date',
  FILE_READ_ERROR: 'Error reading file',
  UNKNOWN_DEVICE_TYPE: 'Unknown Device Type',
  UNKNOWN_USER: 'Unknown User',
  UNKNOWN_GROUP: 'Unknown Group'
} as const; 