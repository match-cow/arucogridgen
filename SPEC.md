# SPEC.md: ArUco Grid Generator

## 1. Overview

This document specifies the requirements for a client-side web application designed to generate printable ArUco marker grids for computer vision and robotics tasks, specifically for pose estimation using libraries like OpenCV.

The application will be a static website, capable of running entirely in a web browser, making it suitable for hosting on services like GitHub Pages. It will provide users with a set of controls to customize the grid layout and appearance, and it will generate a downloadable PDF for printing.

A key feature is the ability to define a custom base coordinate system and calculate the transformation from this base system to the standard ArUco grid coordinate system, which is crucial for robotics applications.

## 2. Target Platform

* **Hosting:** The application must be a static website comprised of HTML, CSS, and JavaScript. It is intended to be hosted on **GitHub Pages**.
* **Execution Environment:** All generation and processing logic must run client-side in the user's web browser. No server-side backend is required.

## 3. Core Features & User Controls

The user interface will provide the following configuration options, with a real-time preview of the resulting grid.

### 3.1. Page and Layout Configuration

* **Paper Size:** Dropdown selection.
    * `A4` (210 x 297 mm)
    * `A3` (297 x 420 mm)
* **Orientation:** Toggle or dropdown.
    * `Portrait` (Default)
    * `Landscape`
* **ArUco Dictionary:** Dropdown selection of common OpenCV ArUco dictionaries.
    * `DICT_4X4_50`
    * `DICT_4X4_100`
    * `DICT_4X4_250`
    * `DICT_4X4_1000`
    * `DICT_5X5_50`
    * `DICT_5X5_100`
    * `DICT_5X5_250`
    * `DICT_5X5_1000`
    * `DICT_6X6_50`
    * `DICT_6X6_100`
    * `DICT_6X6_250` (Default)
    * `DICT_6X6_1000`
    * `DICT_7X7_50`
    * `DICT_7X7_100`
    * `DICT_7X7_250`
    * `DICT_7X7_1000`

### 3.2. Grid Dimensions

* **Marker Columns:** Number input for the number of markers horizontally. (Default: 5)
* **Marker Rows:** Number input for the number of markers vertically. (Default: 7)
* **Marker Size:** Number input for the side length of a single square marker in millimeters (mm). (Default: 30)
* **Marker Separation:** Number input for the distance between adjacent markers in millimeters (mm). (Default: 8)

### 3.3. Auto-Resizing Logic

* The application must calculate the total required width and height of the grid based on the user's settings, including a default page margin (e.g., 10mm).
* **If the calculated dimensions exceed the selected paper size**, the application must automatically and proportionally scale down the `Marker Size` and `Marker Separation` to fit within the page margins. A visual indicator or notification should inform the user that resizing has occurred.

### 3.4. Output Toggles (Display Options)

These options can be toggled on or off via checkboxes. They affect the final PDF output.

* `Show Marker IDs`: If enabled, the numerical ID of each ArUco marker will be printed in a small font near the marker itself. (Default: On)
* `Show Scale`: If enabled, a metric ruler (in mm) will be printed along one horizontal and one vertical edge of the page to allow for verification of print scaling. (Default: On)
* `Show Parameters`: If enabled, a text block will be added to the PDF detailing all the configuration settings used to generate it (e.g., Dictionary, Rows, Cols, Marker Size, etc.). (Default: On)

## 4. Output

* The primary output is a **PDF file** generated on the client side.
* A "Download PDF" button will trigger the generation and download process.
* The PDF must be accurately scaled to the selected paper size (A4 or A3).

## 5. Advanced Feature: Robotics Coordinate System

This section defines the functionality for establishing a custom coordinate frame and outputting the necessary transformation for robotics integration.

### 5.1. Coordinate System Definitions

All coordinate systems are right-handed.

* **ArUco Grid System ($F_{grid}$):** This is the standard coordinate system used by OpenCV's `estimatePoseSingleMarkers`.
    * **Origin:** The top-left corner of the marker with the lowest ID (typically ID 0).
    * **X-axis:** Points to the right, along the row of markers.
    * **Y-axis:** Points downwards, along the column of markers.
    * **Z-axis:** Points "into" the paper plane.

* **User-Defined Base System ($F_{base}$):** This is a custom coordinate system defined by the user relative to the page.
    * **Default State:**
        * **Origin:** The geometric center of the paper.
        * **X-axis:** Points to the right.
        * **Y-axis:** Points towards the top of the page.
        * **Z-axis:** Points "out of" the paper plane, towards the viewer.
    * **User Modification:** The user can modify this default base system by providing:
        * **Translation (mm):** Input fields for $t_x, t_y, t_z$ to translate the origin from the page center.
        * **Orientation (degrees):** Input fields for Roll, Pitch, Yaw (Euler angles) to rotate the frame relative to the default orientation.

### 5.2. Required Output

The application must calculate and display the **homogeneous transformation matrix** ($T_{grid \leftarrow base}$) that transforms points from the user-defined base system ($F_{base}$) to the ArUco grid system ($F_{grid}$).

This will be displayed in the UI and included in the parameter block on the PDF.

The output should be provided in two formats:

1.  **4x4 Homogeneous Transformation Matrix:**
    $$
    T_{grid \leftarrow base} =
    \begin{bmatrix}
    R_{11} & R_{12} & R_{13} & t_x \\
    R_{21} & R_{22} & R_{23} & t_y \\
    R_{31} & R_{32} & R_{33} & t_z \\
    0 & 0 & 0 & 1
    \end{bmatrix}
    $$
    Where $R$ is the $3 \times 3$ rotation matrix and $t$ is the translation vector.

2.  **Translation and Quaternion:**
    * Translation: `[x, y, z]` (in meters, for direct use in systems like ROS).
    * Quaternion: `[x, y, z, w]` representing the rotation.

## 6. Technical Stack

* **Core:** HTML5, CSS3, JavaScript (ES6+).
* **JavaScript Libraries:**
    * **ArUco Generation:** A client-side library capable of generating ArUco markers (e.g., a JavaScript port or a WebAssembly build of OpenCV's `aruco` module).
    * **PDF Generation:** A library like `jsPDF` to create and render the PDF document on the client side.
    * **UI Framework (Optional):** A lightweight framework like Vue.js, Svelte, or React may be used to manage the state of the UI and the real-time preview.
    * **Linear Algebra Library (Optional):** A library like `gl-matrix` might be helpful for handling the coordinate system transformations accurately.

## 7. User Interface (UI) / User Experience (UX) Mockup

The interface should be split into two main sections:

1.  **Control Panel (Left Sidebar):**
    * Contains all the dropdowns, number inputs, and checkboxes described in Section 3 and 5.
    * Controls are grouped into logical sections (e.g., "Page Setup", "Grid Layout", "Display Options", "Robotics Frame").
    * The calculated transformation matrix and quaternion will be displayed in a read-only text area at the bottom of this panel.

2.  **Preview Panel (Main Area):**
    * Displays a real-time, WYSIWYG (What You See Is What You Get) preview of the final PDF.
    * The preview should update instantly whenever a control is changed.
    * A visual representation of the User-Defined Base System's axes ($F_{base}$) should be overlaid on the preview to give the user immediate feedback.