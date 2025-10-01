# SPEC.md: ArUco Grid Generator

**Document Version: 2.0 (Final)**
**Status: Confirmed**

## 1\. Executive Summary

This document specifies the requirements for a responsive, self-hosted web application that generates printable ArUco marker grids. The application will be built using a **Python backend** responsible for all core logic, and a lightweight, responsive HTML/CSS/JS frontend for the user interface.

The system will allow users to customize grid parameters, define a robotics-oriented coordinate system, and download the final grid as a print-ready PDF.

## 2\. Target Platform & Architecture

  * **Hosting:** The application will be self-hosted on a server capable of running Python WSGI applications (e.g., using Gunicorn, Nginx).
  * **Architecture:** A classic client-server model.
      * **Backend (Python):** A web server built with the Flask framework will handle all business logic, including ArUco marker generation, coordinate system transformations, and PDF creation.
      * **Frontend (Browser):** A static set of HTML, CSS, and JavaScript files will render the user interface. It will communicate with the backend via API calls to request previews and final PDFs.

## 3\. Core Features & User Controls

The user interface will provide the following configuration options with a real-time preview.

### 3.1. Page and Layout

  * **Paper Size:** `A4`, `A3`
  * **Orientation:** `Portrait`, `Landscape`
  * **ArUco Dictionary:** Dropdown with common OpenCV `DICT_*` options (e.g., `DICT_6X6_250`).

### 3.2. Grid Dimensions

  * **Marker Columns/Rows:** Number inputs.
  * **Marker Size (mm):** Number input.
  * **Marker Separation (mm):** Number input.

### 3.3. Auto-Resizing Logic

  * If the total grid dimensions (including margins) exceed the selected paper size, the `Marker Size` and `Marker Separation` will be proportionally scaled down to fit. The UI will inform the user that this scaling has occurred.

### 3.4. Output Toggles

  * `Show Marker IDs`
  * `Show Scale` (a printable ruler on the page edges)
  * `Show Parameters` (a text block with all generation settings)

## 4\. UI/UX and Responsive Design

The application will be fully responsive using a **mobile-first** approach.

  * **Mobile View (\< 768px):** A single-column, stacked layout. The control panel will be on top, using collapsible accordions for its sections. The preview will be below, filling the screen width.
  * **Desktop View (\>= 768px):** A two-column layout. A fixed-width control panel will be on the left, and the larger, flexible preview panel will be on the right.

## 5\. Advanced Feature: Robotics Coordinate System

### 5.1. Coordinate System Definitions (Right-Handed)

  * **ArUco Grid System ($F_{grid}$):** Origin at the top-left corner of the first marker (ID 0). X-axis points right, Y-axis points **down**, Z-axis points **into** the page.
  * **User-Defined Base System ($F_{base}$):**
      * **Default:** Origin at the geometric page center. X-axis points right, Y-axis points **up**, Z-axis points **out of** the page.
      * **Customization:** The user can modify the default via translation inputs ($t_x, t_y, t_z$ in mm) and rotation inputs (Roll, Pitch, Yaw in degrees).

### 5.2. Required Output

The application will calculate and display the transformation from the base system to the grid system ($T_{grid \leftarrow base}$). This will be shown in the UI and on the PDF.

1.  **4x4 Homogeneous Transformation Matrix**
2.  **Translation Vector** (`[x, y, z]` in meters) and **Quaternion** (`[x, y, z, w]`)

## 6\. Technical Stack

  * ### Backend

      * **Web Framework:** **Flask**
      * **ArUco & Math:** `opencv-contrib-python`, `numpy`
      * **PDF Generation:** `reportlab` or `fpdf2 (pyfpdf)`
      * **WSGI Server:** Gunicorn (for production deployment)

  * ### Frontend

      * **Core:** HTML5, CSS3, vanilla JavaScript (ES6+)
      * **Layout:** CSS Flexbox and/or CSS Grid for responsiveness.
      * **API Communication:** `fetch` API for making asynchronous calls to the backend.

## 7\. API Endpoints

The Flask backend will expose the following endpoints:

### 7.1. `POST /api/generate`

  * **Purpose:** Generates the final PDF.
  * **Request Body (JSON):** An object containing all user-configured parameters.
    ```json
    {
      "paper_size": "A4",
      "orientation": "portrait",
      "dictionary": "DICT_6X6_250",
      "rows": 7,
      "cols": 5,
      "marker_size_mm": 30,
      "separation_mm": 8,
      "show_ids": true,
      "show_scale": true,
      "show_params": true,
      "base_translation": [0, 0, 0],
      "base_rotation": [0, 0, 0]
    }
    ```
  * **Success Response (200 OK):**
      * **Content-Type:** `application/pdf`
      * **Body:** The raw PDF file data.
  * **Error Response (400 Bad Request):** If input parameters are invalid.

### 7.2. `POST /api/preview` (Optional but Recommended)

  * **Purpose:** Generates a low-resolution image preview for the UI.
  * **Request Body (JSON):** Same as `/api/generate`.
  * **Success Response (200 OK):**
      * **Content-Type:** `image/png` or `image/svg+xml`
      * **Body:** The image file data.

## 8\. Proposed Project Structure

A typical Flask project structure would be suitable:

```
aruco-generator/
│
├── app.py                  # Main Flask application file with routes and logic
├── requirements.txt        # Python dependencies (flask, numpy, opencv, etc.)
│
├── static/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   └── js/
│       └── main.js         # Frontend JavaScript for UI and API calls
│
└── templates/
    └── index.html          # Main HTML page for the application
```