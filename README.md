# OZ-CSC-480-HCI-521-Spring-2025

## Developing
0. Make sure you have `java jdk17` and `maven` installed.
1. Clone the repo using `git clone`, and `cd` into the project

### Frontend
> [!NOTE]
> If you are developing the frontend, you should have a local copy of 
> node & npm for dev server purposes. If all you're doing is building the 
> frontend, you shouldn't have to, as the frontend-maven-plugin will 
> install a copy for you for building.

1. `cd` into `frontend/src/main/frontend`
2. Install the dependencies by running `npm install`
3. Run the dev server by using `npm run dev`

### Backend
1. `cd` into `backend`
2. Run the liberty dev server by using `./mvnw liberty:dev`


## Build Instructions

### Frontend
1. `cd` into `frontend/src/main/frontend`
1. Run `./mvnw process-resources` to build the frontend into a static site

... TODO

### Backend
TODO