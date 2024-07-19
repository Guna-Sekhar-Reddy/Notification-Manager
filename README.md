[]
# Firebase Notification Manager


## Description:
- The Firebase Notification Manager allows users to compose and send notifications to selected users. It provides a user-friendly interface to select recipients, compose message titles, and messages. The application integrates with Firebase Cloud Messaging to deliver notifications efficiently.

## Features:
- Compose notifications with customizable titles and messages.
- Select users from a list to send notifications.
- Save notification templates for future use.
- Monitor the progress of notification sending.
- Search functionality to find specific users easily.
- Select all/deselect all functionality for user lists.

## Tools:
  - Visual Studio Code (VS Code)
  - MySQL Workbench. (password must not contain @ symbol)
  - FireBase Console
  - POSTMAN
  - Python

## To install all the dependencies:
   ```
     pip install -r requiremnts.txt
   ```

### Installation of Visual Studio Code (VS Code) on Windows:

1. Download the Installer:
   - Go to the Visual Studio Code website.
   - Click on the "Download for Windows" button to download the installer.

2. Run the Installer:
   - Once the installer (VSCodeSetup-*.exe) is downloaded, open it by double-clicking on the file.
   - You might see a User Account Control prompt asking for permission to allow the app to make changes to your device.
   - Click Yes.

3. Setup Wizard:
   - The VS Code Setup Wizard will open.
   - Click Next to continue.
   - Read and accept the license agreement, then click Next.
   - Choose the installation location (the default location is usually fine), then click Next.
   - Select the additional tasks you want to perform. It is recommended to check:
     - Create a desktop icon
     - Add to PATH (requires shell restart)
     - Register Code as an editor for supported file types
     - Add "Open with Code" action to Windows Explorer directory context menu
   - Click Next, then Install to begin the installation.
     
4. Complete Installation:
   - Wait for the installation process to complete. Once done, click Finish.

### Download and Install Python:

1. Visit the Python Website and Navigate to the Downloads Section
   - First and foremost step is to open a browser and type Python Download or paste link (https://www.python.org/downloads/)
2. Choose the Python Version
   - Click on the version you want to download. – Prefer latest version
3. Download the Python Installer
   - Once the download is complete, run the installer program. On Windows, it will typically be a .exe file, on macOS, it will be a .pkg file, and on Linux, it will be a .tar.gz file.
4. Installation process of Python
   - Run the Python Installer for how to install Python on the Windows downloads folder
   - Make sure to mark Add Python to PATH otherwise you will have to do it explicitly. It will start installing Python on Windows.
   - After installation is complete click on Close. Python is installed.
     
### Installation of Flask on Windows:
Flask is basically a Python module. It can work with Python only and it is a web-developing framework. It is a collection of libraries and modules. Frameworks are used for developing web platforms. Flask is such a type of web application framework. It is completely written in Python language. Unlike Django, it is only written in Python. As a new user, Flask is to be used. As it is easier to handle. As it is only written in Python, before installing Flask on the machine, Python should be installed previously.  

0. Create a python virtual environment:
   ```
   python -m venv .venv
   ```
   ```
   .venv\Scripts\activate
   ```
1. Make sure that Python PIP should be installed on your OS. You can check using the below command.
   ```
        pip -V   (or)  pip --version
   ```
3. At first, open the command prompt in administrator mode. Then the following command should be run. This command will help to install Flask using Pip in Python and will take very less time to install. According to the machine configuration, a proper Flask version should be installed. Wait for some time till the process is completed. After completion of the process, Flask is completed successfully, the message will be displayed. Hence Installation is successful.

### Installation of POSTMAN on Windows:
Postman is a platform for building and using APIs and helps for simplifying the steps in the APIs lifecycles to streamline collaboration for creating faster APIs. It includes various API tools to accelerate the development cycle, including the design mockups and testing documentation, etc. Postman will use it directly on a web browser or we can also download the desktop version also for convenient use. 

1. Visit the [https://www.postman.com](url)/ website using any web browser. 

2. Click on Windows Button to download.

3. Now click on Windows 64 – bit button.

4. Now check for the executable file in downloads in your system and run it.

5. Now installing process will start it takes a minute to install in the system.

6. After installing the program the software opens automatically. Now you can see the interface of the software.

7. Postman is successfully installed on the system and an icon is created on the desktop.

### Installation MySQL for Windows:

1. Visit the Official MySQL Website
   - Open your preferred web browser and navigate to the official MySQL website. Now, Simple click on first download button.

2. Go to the Downloads Section
   - On the MySQL homepage, Click on the ” No thanks, just start my download” link to proceed MySql downloading.

3. Run the Installer
   - After MySQL downloading MySQL.exe file , go to your Downloads folder, find the file, and double-click to run the installer.

4.  Choose Setup Type
    - The installer will instruct you to choose the setup type. For most users, the “Developer Default” is suitable. Click “Next” to proceed.

5. MySQL Downloading
   - Now the downloaded components will be installed. Click “Execute” to start the installation process. MySQL will be installed on your Windows system. Then click Next to proceed

6. Navigate to Few Configuration Pages
   - Proceed to “Product Configuration” > “Type and Networking” > “Authentication Method” Pages by clicking the “Next” button.
   
7. Create MySQL Accounts
   - Create a password for the MySQL root user. Ensure it’s strong and memorable. Click “Next” to proceed.

8. Connect To Server
   - Enter the root password (password must not contain @ symbol), click Check. If it says “Connection succeed,” you’ve successfully connected to the server

9. Complete Installation
   - Once the installation is complete, click “Finish.” Congratulations! MySQL is now installed on your Windows system.
   
10. Verify Installation
    - To ensure a successful installation of MySQL, open the MySQL Command Line Client or MySQL Workbench, both available in your Start Menu. Log in using the root user credentials you set during installation.

11. Open notifier.cfg and in that change the following:
    
        [DEFAULT]
        ; The default section is used when no section is specified
        secret_key=YOUR_SECRET_KEY
        # copy the relative path of your firebase sdk .json file
        path_to_firebase_sdk=bluboy-test-firebase-adminsdk-6k08o-9184a30f9b.json     
        
        [DATABASE]
        host = test-bluboygames-com.c8ogql7pdyd4.ap-south-1.rds.amazonaws.com
        port = 3306
        user = interns_team
        password = interns_team#098#
        database = interns_db
    
### FireBase Setup: (Do it in web No need of installation).
If you have a existing project directly start from step 4:

1. Sign in to Firebase:
  - Go to the Firebase Console.
  - Sign in with your Google account.

2. Create a New Project:
   - Click on the Add project button.
   - Project name:
     - Enter a name for your project.
     - Click Continue.
   - Google Analytics Setup:
     - Select an existing Google Analytics account or create a new one.
     - Review and configure your Google Analytics settings.
     - Click Create project.

3.  Configure Project Settings:
    - Once the project is created, you will be taken to the Firebase project dashboard.
    - Choose the platform for your app (iOS, Android, Web, or Unity). Choose WEB (</>) for our project. 
    - Registering your app with Firebase:
      - Add a name for the app (ex:notification)
      - Also set up Firebase Hosting for this app (Select this option).
      - Click on Register app.
      - Click on Continue to Console.
 
       
### How to run the project:

  - Open Terminal in Vs code and type and change to the root directory where run file is present.
    ```
       python run.py
    ```
