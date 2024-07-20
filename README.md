# Twitchr Web App


<img width="52" alt="logo" src="https://github.com/user-attachments/assets/9e19fadb-42e4-49b2-bb61-d90f4341f091">

## About
The Twitchr Web Application is a web app that is used with the Twitchr RPI Application. It has the following purposes:

1. Allow the user to log in and view the latest information from the RPI (status, temperature, humidity and pressure and the latest snapshot taken from the camera). If the user is an admin, display a control panel. If the admin clicks the weather update button, get weather update. If the admin clicks one of the sound buttons, publish message to MQTT queue to play a sound.

<img width="1162" alt="dashboard" src="https://github.com/user-attachments/assets/2144c292-52e0-4e4f-9194-33d23a2c58f3">


2. Display breakdown of bird/cat sightings from the week and breakdown of bird species spotted. Also display list of the day's sightings with timestamp and link to image

<img width="1181" alt="breakdown" src="https://github.com/user-attachments/assets/97e54352-14d4-4a56-96b3-cc968e6e05ca">


3. Allow the user to update their details (e.g email and phone number) and to check which notifications they wish to receive and how they wish to receive them (SMS, Email or both). If the user is an Admin, they can update Weather Notification settings.


![not](https://github.com/user-attachments/assets/6d02b664-2e30-42aa-9685-7fd0e5c13845)

4. Depending payload sent to API Endpoint `api/send-update`, Send comms to users/publish message to MQTT topic.


![bird_spotted](https://github.com/user-attachments/assets/c7f8f1ad-d4a8-43f0-a47f-d7ed04c58471)


5. When API request is made to `api/update-weather`, get weather update based on latitude and longitude stored in database.

## Flow Diagram

<img width="1237" alt="flow_chart" src="https://github.com/user-attachments/assets/297d7651-369f-48ae-a557-8b5d0634b7f8">


## Installation Guide
The installation guide for the Twitchr Web App can be found [here](https://github.com/gracielilykelly/twitchr-app/blob/main/docs/InstallationGuide.md)


## Documentation
You can find documentation related to this application [here](https://github.com/gracielilykelly/twitchr-app/tree/main/docs)
