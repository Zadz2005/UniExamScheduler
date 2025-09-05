# Exam Scheduler Frontend

A modern React frontend for the Exam Scheduler application that connects to your Spring Boot backend.

## Features

- **Search Page**: Search for exams by name with real-time results
- **Exam Detail Page**: View detailed information about specific exams
- **Add to Calendar**: Universal calendar integration that works on all devices
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Your Spring Boot backend running on `http://localhost:8080`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Integration

The frontend connects to your Spring Boot backend using the following endpoints:

- `GET /api/v1/exam?name={searchTerm}` - Search for exams by name
- The backend should be running on `http://localhost:8080`

## Calendar Integration

The "Add to Calendar" feature provides universal compatibility:

### Mobile Devices
- Automatically detects mobile devices
- Downloads `.ics` file for native calendar apps
- Works with Samsung Calendar, iPhone Calendar, Google Calendar, etc.

### Desktop Devices
- Google Calendar integration
- `.ics` file download option
- Compatible with Outlook, Apple Calendar, and other desktop calendar applications

## Project Structure

```
src/
├── components/
│   ├── ExamSearch.js          # Main search page component
│   ├── ExamSearch.css         # Search page styles
│   ├── ExamDetail.js          # Exam detail page component
│   └── ExamDetail.css         # Detail page styles
├── App.js                     # Main app component with routing
├── App.css                    # Global styles
└── index.js                   # App entry point
```

## Customization

### Changing the Backend URL

If your Spring Boot backend runs on a different port or host, update the `API_BASE_URL` in:

- `src/components/ExamSearch.js` (line 15)
- `src/components/ExamDetail.js` (line 15)

### Styling

The application uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS animations and transitions
- Responsive design principles
- Custom gradient backgrounds

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)

## Troubleshooting

### Backend Connection Issues

1. Ensure your Spring Boot backend is running on `http://localhost:8080`
2. Check that CORS is properly configured in your Spring Boot application
3. Verify the API endpoints match the expected format

### Calendar Integration Issues

1. On mobile devices, ensure you have a calendar app installed
2. For `.ics` files, most calendar applications support this format
3. If Google Calendar doesn't open, try the `.ics` download option

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App (irreversible)

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Contributing

1. Make your changes
2. Test thoroughly on different devices
3. Ensure the backend integration works correctly
4. Submit your changes

## License

This project is part of the Exam Scheduler application.