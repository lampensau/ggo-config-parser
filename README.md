# Green-GO Config Parser

A web application that parses Green-GO configuration files (.gg5) and exports device and user information to CSV format. Built with Next.js and TailwindCSS.

## Features

- Parse Green-GO configuration files (.gg5)
- Display configuration details, users, and devices in an organized layout
- Responsive design with dark/light/system theme support
- Drag and drop file upload
- Export parsed data to CSV format
- View detailed device information including:
  - Device names and types
  - Serial numbers
  - Firmware versions
  - IP addresses
  - MAC addresses
- User-device assignments
- Mobile-friendly interface

## Live Demo

Visit the live application at: [https://lampensau.github.io/ggo-config-parser](https://lampensau.github.io/ggo-config-parser)

## Local Development

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lampensau/ggo-config-parser.git
cd ggo-config-parser
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000/ggo-config-parser](http://localhost:3000/ggo-config-parser) in your browser

### Building for Production

To create a production build:
```bash
npm run build
# or
yarn build
```

To deploy to GitHub Pages:
```bash
npm run deploy
# or
yarn deploy
```

## Usage

1. Drag and drop a Green-GO configuration file (.gg5) onto the upload area, or click to select a file
2. View the parsed configuration details, user information, and device assignments
3. Use the export button to download the data in CSV format
4. Toggle between light, dark, and system theme using the theme button

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- UI Components with [Radix UI](https://www.radix-ui.com/)
