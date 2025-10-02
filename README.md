![ArUco Grid](static/match.png)

# ArUco Grid Generator

A responsive web application for generating printable ArUco marker grids used in pose estimation tasks for computer vision and robotics applications.

## Features

- **Customizable Grid Parameters**: Configure paper size (A4/A3), orientation (portrait/landscape), ArUco dictionary (4x4, 5x5, 6x6, 7x7, Original), number of rows and columns, marker size in mm, and separation between markers.
- **Real-Time Preview**: See a live preview of the generated grid as you adjust parameters.
- **Optional Overlays**: Toggle display of marker IDs, a scale ruler, generation parameters, and a coordinate system visualization.
- **Coordinate System Support**: Define a robotics-oriented coordinate system with customizable translations (X, Y, Z in mm) and rotations (Roll, Pitch, Yaw in degrees). The app calculates and provides transformation matrices for pose estimation.
- **High-Resolution PDF Export**: Generate print-ready PDFs with automatic scaling to fit the selected paper size.
- **Responsive Design**: Works seamlessly on desktop and mobile devices with a mobile-first approach.

## Technology Stack

- **Backend**: Python with Flask framework, OpenCV for ArUco marker generation, NumPy for mathematical operations, ReportLab for PDF creation, PIL for image processing.
- **Frontend**: HTML5, CSS3 (Tailwind CSS), vanilla JavaScript for responsive UI and API communication.
___

This project is developed for academic and research purposes at the match, Leibniz University Hannover.
