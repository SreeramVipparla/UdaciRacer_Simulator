# UdaciRacer Simulation Game Project

# Overview

<img src="https://user-images.githubusercontent.com/86887626/137727899-82b75483-0881-4de5-aa5f-78684ff6d1f0.jpg" width="500" height="250">

# Introduction

In this project I have created a racing simulation that has 6 unique tracks and 5 drivers of 3 different statistics (Top_Speed, Acceleration, Handling). I have used Javascript, HTML & CSS to create this project. The race begins as the user clicks on the accelerator. The race regularly updates the users position and displays the positions on a leaderboard. After a race is completed the final standing is generated. If the user wishes to play again a redirect button is provided in the leaderboard page.

While creating the project I have used 4 types of APIs -

1. [GET] `api/tracks`
   List of all tracks

- id: number (1)
- name: string ("Track 1")
- segments: number[]([87,47,29,31,78,25,80,76,60,14....])

2. [GET] `api/cars`
   List of all cars

- id: number (3)
- driver_name: string ("Racer 1")
- top_speed: number (500)
- acceleration: number (10)
- handling: number (10)

3. [GET] `api/races/${id}`
   Information about a single race

- status: RaceStatus ("unstarted" | "in-progress" | "finished")
- positions object[] ([{ car: object, final_position: number (omitted if empty), speed: number, segment: number}])

4. [POST] `api/races`
   Create a race

- id: number
- track: string
- player_id: number
- cars: Cars[] (array of cars in the race)
- results: Cars[] (array of cars in the position they finished, available if the race is finished)

5. [POST] `api/races/${id}/start`
   Begin a race

- Returns nothing

6. [POST] `api/races/${id}/accelerate`
   Accelerate a car

- Returns nothing

## Instructions to run the project

### Start the Server

The game engine has been compiled down to a binary so that ythe user can run it on any system. Because of this, the user cannot edit the API in any way, it is just a black box that the user interact with via the API endpoints.

To run the server, locate the operating system and run the associated command in the terminal at the root of the project.

| Your OS               | Command to start the API                                  |
| --------------------- | --------------------------------------------------------- |
| Mac                   | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx`   |
| Windows               | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server.exe`   |
| Linux (Ubuntu, etc..) | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux` |

Note that this process will use the terminal tab, so the user will have to open a new tab and navigate back to the project root to start the front end.

#### WINDOWS USERS -- Setting Environment Variables

If you are using a windows machine:

1. `cd` into the root of the project containing data.json
2. Run the following command to add the environment variable:
   `set DATA_FILE=./data.json`

### Start the Frontend

First, run your preference of `npm install && npm start` or `yarn && yarn start` at the root of this project. Then you should be able to access http://localhost:3000.
