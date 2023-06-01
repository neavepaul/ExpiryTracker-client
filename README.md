# Expiry Tracker

Expiry Tracker is a web application that helps you keep track of the expiration dates of your items. It allows you to scan barcodes to automatically retrieve item information and set expiration dates.

## Features

- Barcode scanning using the device's camera
- Manual item addition with custom name, comments, and expiry date
- Firebase authentication for user login/logout
- Firebase Firestore for storing user data
- Integration with Open Food Facts API to retrieve item information
- Responsive design for mobile and desktop

## Installation

1. Clone the repository: `git clone https://github.com/your-username/expiry-tracker.git`
2. Navigate to the project directory: `cd expiry-tracker`
3. Install dependencies: `npm install`
4. Create a Firebase project and enable Firebase Authentication and Firestore
5. Configure Firebase credentials in the project (see instructions below)
6. Start the development server: `npm start`
7. Open the application in your browser at `http://localhost:3000`

### Firebase Configuration

To configure Firebase credentials, create a `.env` file in the root directory of the project and add the following variables from your firebase project settings page:
APIKEY='XXX'
AUTHDOMAIN='XXX'
PROJECTID='XXX'
STORAGEBUCKET='XXX'
MESSAGINGSENDERID='XXX'
APPID='XXX'
MEASUREMENTID='XXX'


## Usage

- Register or login using your email and password
- Grant camera access to the application to scan barcodes
- Point the camera at the barcode of an item to scan it
- If the item is found in the Open Food Facts database, its name and other details will be displayed
- Set the item's expiry date and add any comments if needed
- Click the "Add" button to save the item
- View your items on the dashboard, sorted by expiry date
- Logout from the application when done

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
