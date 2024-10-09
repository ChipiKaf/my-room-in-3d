# My Room in 3D

This project is a work-in-progress 3D representation of my room using React, Three.js, and `@react-three/fiber`. The scene includes various models, textures, and interactive elements that bring the virtual space to life. (Note, I did not push the glb models to the repo. Email me for the models)

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [License](#license)

## Demo

[Link to live demo](https://room.chipilidev.com)

## Features

- Interactive 3D room environment
- Use of custom shader materials for visual effects
- Support for GLTF models and Draco compression for optimized loading
- Built with a modular structure for easy extension and maintenance

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/my-room-in-3d.git
    cd my-room-in-3d
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

1. Start the development server:

    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000` to see the 3D room.

## Scripts

- `dev`: Starts the development server.
- `build`: Builds the project for production.

## Project Structure

    .
    ├── dist
    │   ├── assets
    │   ├── draco
    │   ├── models
    │   ├── textures
    │   ├── bangers-v20-latin-regular.woff
    │   └── index.html
    ├── node_modules
    ├── public
    ├── src
    │   ├── hooks
    │   ├── shaders
    │   ├── Experience.jsx
    │   ├── index.html
    │   ├── index.jsx
    │   └── style.css
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    ├── README.md
    └── vite.config.js

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Three.js**: A JavaScript 3D library.
- **@react-three/fiber**: React renderer for Three.js.
- **@react-three/drei**: Useful helpers for `@react-three/fiber`.
- **Vite**: A build tool that aims to provide a faster and leaner development experience.
- **Draco**: A library for compressing and decompressing 3D geometric meshes and point clouds.

## License

This project is licensed under the MIT License.