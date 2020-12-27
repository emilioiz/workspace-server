# Workspace Server

The purpose of the Workspace Server is to handle all Firebase Cloud Functions to include API Routes and Maintenance scripts. These scripts are created and managed by Daasly, Inc.

## Initial Setup and Authentication

<details>
<summary><b>Node Package Manager</b></summary>
<p>Workspace Server uses NPM packages for operations. Once you have cloned the git repo, following these steps to installed all required packages in the repo.
<br>

1. `cd functions`
2. `npm i`
</p>
</details>
<details>
<summary><b>Firebase Emulators</b></summary>
<p>
Firebase Emulators allows you to run and test the Workspace Server on your local machine. You can install the Firebase Emulators following the instructions in the following link: <a href="https://firebase.google.com/docs/rules/emulator-setup" target="_blank">Set up the Firebase Emulators</a> 
</p>
</details>
<details>
<summary><b>Using Postman</b></summary>
<p>
Postman allows you to make requests to the Workspace Server routes. When a Postman user enters the request data, the data is then sent to the local Firebase Emulator. If the request is successful, information is returned to the user by Postman. Let's make our first Postman request. Navigate  <a href="https://learning.postman.com/docs/getting-started/sending-the-first-request/" target="_blank">here</a> and follow the Postman documentation to gain a better understanding of Postman itself.
<br>

\*If using Postman in your brower, you are subject to CORS policies. Using the local client version of Postman will bypass CORS policies.

</p>
</details>
<details>
<summary><b>Obtaining an Authorization Token</b></summary>
<p>
The Workspace Server requires a user to be authenticated with an authorization token before they can make a request. All users must be authenticated via their login's or as an anonymous user. If you are an admin, you will be assigned a username and password the system admin(s) to make changes in the production enviroment. For development purposes, this code base has a dev route which will return a local auth token and seed the local development firestore database.
<br>

To retrieve the token and seed your local development database, open Postman and make a GET request to:
`http://localhost:5001/workspace-247959/us-central1/dev`
<br>

For production authorization tokens utilize the firebase client sdk to produce an annouymous user login. Follow the insturctions <a href="https://firebase.google.com/docs/auth/web/anonymous-auth" target="_blank">here</a>.

</p>
</details>
<details>
<summary><b>Authenticating Requests</b></summary>
<p>
In order to authenticate a request via Postman, navigate to the Authorization tab (of the request you are making) and in the type drop down menu select Bearer Token. You will see an input field labeled Token.  Paste your authorization token in the input field.  See image below:
<img src="https://storage.googleapis.com/daasly_public/example-auth-spring.png" />
You will now be able to make authenticated requests. Please note, a token lasts 1 hour.  Repeat this process once a token expires.
</p>
</details>

## Calendar Requests

All request begin with the following base urls:

Development: `http://localhost:5001/workspace-247959/us-central1/calendar`
Production: `https://us-central1-workspace-247959.cloudfunctions.net/calendar`

<details>
<summary><b>/availability</b></summary>

- Query Params

  - date **(required)**
    - Date to check available times i.e. "2020-01-01"
  - calendarID
    - Numeric id of the calendar to check availability for.
  - appointmentTypeID
    - Numeric id of the appointment type to check availability for.

- Response
  - When only the date is provided in the request, the api will reponse with the aviability for all active lawyers in the database.
    ```json
    {
      "date": "2021-01-04",
      "dateValues": [
        {
          "timeBlock": "09",
          "timeBlockValues": [
            {
              "calendarID": 4994648,
              "appointmentTypeID": 19928316,
              "name": "Free Consultation - 15",
              "duration": 15,
              "description": "This is the description set in Acuity",
              "timeBlock": "09",
              "times": [
                "2021-01-04T09:00:00-0500",
                "2021-01-04T09:15:00-0500",
                "2021-01-04T09:30:00-0500",
                "2021-01-04T09:45:00-0500"
              ]
            },
            {
              "calendarID": 4994413,
              "appointmentTypeID": 19928316,
              "name": "Free Consultation - 15",
              "duration": 15,
              "description": "This is the description set in Acuity",
              "timeBlock": "09",
              "times": [
                "2021-01-04T09:00:00-0500",
                "2021-01-04T09:15:00-0500",
                "2021-01-04T09:30:00-0500",
                "2021-01-04T09:45:00-0500"
              ]
            }
          ]
        }
      ]
    }
    ```
  - When the `calendarID` and `appointmentTypeID` is added to the request, the api will respone with only the aviability for the single lawyer requested.
    ```json
    {
      "date": "2021-01-04",
      "calendarID": "4783565",
      "appointmentTypeID": 18628316,
      "name": "Free Consultation - 15",
      "duration": 15,
      "description": "This is the description set in Acuity",
      "times": [
        "2021-01-04T09:00:00-0500",
        "2021-01-04T09:15:00-0500",
        "2021-01-04T09:30:00-0500",
        "2021-01-04T09:45:00-0500",
        "2021-01-04T10:00:00-0500",
        "2021-01-04T10:15:00-0500",
        "2021-01-04T10:30:00-0500",
        "2021-01-04T10:45:00-0500",
        "2021-01-04T11:00:00-0500",
        "2021-01-04T11:15:00-0500",
        "2021-01-04T11:30:00-0500",
        "2021-01-04T11:45:00-0500",
        "2021-01-04T12:00:00-0500",
        "2021-01-04T12:15:00-0500",
        "2021-01-04T12:30:00-0500",
        "2021-01-04T12:45:00-0500",
        "2021-01-04T13:00:00-0500",
        "2021-01-04T13:15:00-0500",
        "2021-01-04T13:30:00-0500",
        "2021-01-04T13:45:00-0500"
      ]
    }
    ```

\*Note that the JSON structure of the response is different dependant on the query params passed in with the request, see examples below.

</details>
