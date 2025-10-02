# DemoFlow Chrome Extension

The DemoFlow Chrome Extension enables users to record interactive product demos directly from their browser. It captures user interactions, DOM elements, and screenshots to create engaging, clickable demos.

## Features

- **One-Click Recording**: Start recording demos with a single click
- **Interaction Capture**: Automatically captures clicks, form inputs, navigation, and more
- **DOM Serialization**: Preserves element structure for interactive playback
- **Cross-Tab Support**: Continues recording across multiple tabs and pages
- **Real-time Sync**: Auto-saves progress to your DemoFlow account
- **Visual Feedback**: Shows recording status and step count during capture

## Installation

### Development Installation

1. Clone the repository and navigate to the extension directory:
```bash
cd chrome-extension
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

### Production Installation

1. Download the latest release from the Chrome Web Store (coming soon)
2. Or download the `.zip` file from releases and load it manually

## Usage

### First Time Setup

1. Click the DemoFlow extension icon in your browser toolbar
2. Click "Connect Account" to authenticate with your DemoFlow account
3. You're ready to start recording!

### Recording a Demo

1. Navigate to the webpage you want to demo
2. Click the DemoFlow extension icon
3. Enter a demo title and optional description
4. Click "Start Recording"
5. Perform the actions you want to capture
6. Click "Stop & Save" when finished

### Recording Controls

- **Pause/Resume**: Temporarily pause recording
- **Add Note**: Insert annotation at current step
- **Add Pause**: Insert a timed pause in the demo flow

## Project Structure

```
chrome-extension/
├── manifest.json           # Extension manifest
├── src/
│   ├── background/
│   │   └── background.js   # Background service worker
│   ├── content/
│   │   └── content.js      # Content script for DOM capture
│   ├── popup/
│   │   ├── popup.html      # Extension popup UI
│   │   ├── popup.css       # Popup styles
│   │   └── popup.js        # Popup functionality
│   └── utils/
│       ├── api.js          # API client for DemoFlow backend
│       └── state.js        # Recording state management
├── assets/
│   ├── icons/              # Extension icons
│   └── styles/
│       └── content.css     # Styles for content script overlays
└── dist/                   # Built extension files
```

## Development

### Building

```bash
# Build for development
npm run build

# Build and watch for changes
npm run dev

# Create production zip
npm run zip
```

### Testing

1. Load the extension in development mode
2. Open the Chrome DevTools
3. Check the "Extensions" tab for any console errors
4. Test recording on various websites

### Debugging

- **Background Script**: Open `chrome://extensions/`, find DemoFlow, click "service worker"
- **Content Script**: Open DevTools on any webpage while recording
- **Popup**: Right-click the extension icon and select "Inspect popup"

## API Integration

The extension communicates with the DemoFlow backend API:

- **Authentication**: Bearer token stored in Chrome storage
- **Demo Management**: CRUD operations for demos and steps
- **File Upload**: Screenshots and DOM snapshots
- **Real-time Sync**: Auto-saves progress during recording

### Configuration

Update API endpoint in extension settings:
1. Click the extension icon
2. Click "Settings"
3. Update "API Endpoint" field
4. Click "Save"

## Permissions

The extension requires these permissions:

- `activeTab`: Access to current tab for DOM capture
- `tabs`: Navigate between tabs during recording
- `storage`: Store authentication and settings
- `background`: Run background service worker
- `scripting`: Inject content scripts
- `webNavigation`: Track navigation events
- `<all_urls>`: Capture interactions on any website

## Security

- Authentication tokens are stored securely in Chrome storage
- No sensitive data is logged or transmitted
- Content scripts only capture user-intended interactions
- All API communication uses HTTPS

## Browser Support

- Chrome 88+ (Manifest V3 required)
- Chromium-based browsers (Edge, Brave, etc.)

## Known Limitations

- Cannot record in Chrome extension pages or chrome:// URLs
- Some iframe content may not be captured
- Complex SPAs may require manual step boundaries
- File upload interactions need special handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on multiple websites
5. Submit a pull request

## Troubleshooting

### Extension Won't Load
- Check manifest.json syntax
- Ensure all files are in dist/ folder
- Check Chrome DevTools for errors

### Recording Not Working
- Verify authentication token is valid
- Check network connectivity to API
- Ensure content script is injected

### Missing Interactions
- Some dynamic elements may need manual capture
- Check console for content script errors
- Verify element selectors are being generated

## License

MIT License - see LICENSE file for details

## Support

- Documentation: [DemoFlow Docs](http://localhost:3000/docs)
- Issues: [GitHub Issues](https://github.com/your-org/demoflow/issues)
- Email: support@demoflow.com