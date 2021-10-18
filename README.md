# UdaciRacer Simulation Game Project

# Overview

<img src="https://user-images.githubusercontent.com/86887626/137727899-82b75483-0881-4de5-aa5f-78684ff6d1f0.jpg" width="500" height="300">
# Introduction

This project is a racing simulation created using javascript,html and css.This project consists of 3 parts-

1. An API. The API is provided in the form of a binary held in the bin folder. You never need to open the binary file, as there are no edits you can make to it. Your work will be 100% in the front end.The various API Endpoints used in the project are-
   [GET] `api/tracks`
   List of all tracks

- id: number (1)
- name: string ("Track 1")
- segments: number[]([87,47,29,31,78,25,80,76,60,14....])

[GET] `api/cars`
List of all cars

- id: number (3)
- driver_name: string ("Racer 1")
- top_speed: number (500)
- acceleration: number (10)
- handling: number (10)

[GET] `api/races/${id}`
Information about a single race

- status: RaceStatus ("unstarted" | "in-progress" | "finished")
- positions object[] ([{ car: object, final_position: number (omitted if empty), speed: number, segment: number}])

[POST] `api/races`
Create a race

- id: number
- track: string
- player_id: number
- cars: Cars[] (array of cars in the race)
- results: Cars[] (array of cars in the position they finished, available if the race is finished)

[POST] `api/races/${id}/start`
Begin a race

- Returns nothing

[POST] `api/races/${id}/accelerate`
Accelerate a car

- Returns nothing

2. HTML Views. The focus of this course is not UI development or styling practice, so we have already provided you with pieces of UI, all you have to do is call them at the right times.

## Instructions to run the project

### Start the Server

The game engine has been compiled down to a binary so that you can run it on any system. Because of this, you cannot edit the API in any way, it is just a black box that the user interact with via the API endpoints.

To run the server, locate your operating system and run the associated command in your terminal at the root of the project.

| Your OS               | Command to start the API                                  |
| --------------------- | --------------------------------------------------------- |
| Mac                   | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-osx`   |
| Windows               | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server.exe`   |
| Linux (Ubuntu, etc..) | `ORIGIN_ALLOWED=http://localhost:3000 ./bin/server-linux` |

Note that this process will use your terminal tab, so you will have to open a new tab and navigate back to the project root to start the front end.

#### WINDOWS USERS -- Setting Environment Variables

If you are using a windows machine:

1. `cd` into the root of the project containing data.json
2. Run the following command to add the environment variable:
   `set DATA_FILE=./data.json`

If you still run into issues running the API server on your machine, you can run this project in the Udacity classroom.

### Start the Frontend

First, run your preference of `npm install && npm start` or `yarn && yarn start` at the root of this project. Then you should be able to access http://localhost:3000.

### API Calls

To complete the project you must first create the calls to the API. These will all be fetch requests, and all information needed to create the request is provided in the instructions. The API calls are all at the bottom of the file: `src/client/assets/javascript/index.js`.

Below are a list of the API endpoints and the shape of the data they return. These are all of the endpoints you need to complete the game. Consult this information often as you complete the project: