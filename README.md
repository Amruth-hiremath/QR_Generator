

# Ultimate QR Code Generator

A versatile and user-friendly web application for generating various types of QR codes with extensive customization options, real-time preview, and a history feature.

-----

## 🌟 Overview

The Ultimate QR Code Generator is a dynamic tool built with modern web technologies that allows you to effortlessly create QR codes for a wide range of data. Whether you need a simple URL, Wi-Fi credentials, contact information, or even a calendar event, this generator has you covered. It boasts a clean, responsive interface with a dark mode toggle and real-time feedback, making the QR code generation process both efficient and enjoyable.

-----

## ✨ Features

  * **Multiple QR Code Types:** Generate QR codes for:
      * **Text / URL:** Any plain text or website link.
      * **Wi-Fi Access:** Connect directly to a Wi-Fi network (SSID, password, encryption).
      * **Contact (vCard):** Share contact details (Name, Phone, Email, Organization).
      * **Email:** Pre-fill recipient, subject, and body for an email.
      * **SMS Message:** Create an SMS with a pre-set number and message.
      * **Geolocation:** Embed latitude and longitude coordinates.
      * **Phone Call:** Generate a QR code to dial a specific phone number.
      * **Calendar Event:** Add events to calendars with title, location, description, and time.
  * **Extensive Customization:**
      * Adjust **Size** (in pixels).
      * Set **Foreground** and **Background Colors**.
      * Control **Margin** (quiet zone around the QR code).
      * Choose **Error Correction Level** (L, M, Q, H) for resilience.
  * **Real-time Preview:** See your QR code update instantly as you type and adjust settings.
  * **Download Functionality:** Download generated QR codes as high-resolution PNG images.
  * **Copy Data:** Quickly copy the raw data encoded in the QR code to your clipboard.
  * **Generation History:** Keep track of your recently generated QR codes, with the ability to:
      * **Reload** previous QR codes directly into the generator.
      * **Copy** the raw data of a history item.
      * **Delete** individual history items or clear all history.
  * **Theme Toggle:** Switch between beautiful light and dark modes for comfortable viewing.
  * **Input Validation:** Provides immediate feedback for required or invalid input fields.
  * **Responsive Design:** Works seamlessly across various devices and screen sizes.

-----

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You only need a modern web browser (like Chrome, Firefox, Edge, Safari, Brave, etc.).

### Installation

1.  **Clone the repository (or download the ZIP):**
    ```bash
    git clone https://github.com/your-username/ultimate-qr-code-generator.git
    ```
    (Replace `your-username` with your actual GitHub username if you fork it)
2.  **Navigate to the project directory:**
    ```bash
    cd ultimate-qr-code-generator
    ```

### Usage

Open the `index.html` file in your web browser. That's it\! The application runs entirely client-side.

-----

## 💡 How to Use

1.  **Select QR Code Type:** Use the "QR Code Type" dropdown to choose the kind of information you want to encode.
2.  **Enter Data:** Fill in the dynamic input fields that appear based on your selected type. Pay attention to any validation messages.
3.  **Customize (Optional):** Adjust the `Size`, `Foreground Color`, `Background Color`, `Margin`, and `Error Correction` in the "Customize QR Code" section.
4.  **Generate:** As you type and change settings, the QR code will automatically update in the "Your QR code will appear here." section. You can also click the **"Generate QR Code"** button for an explicit generation.
5.  **Actions:**
      * **Download QR Code:** Click this button to save the generated QR code as a PNG image.
      * **Copy Input Text:** Copies the formatted data that was used to generate the QR code to your clipboard.
6.  **History:** The "Recent QR Codes" section displays your last 10 generated QR codes.
      * Click on any history item to **load its data** back into the generator and preview its QR code.
      * Use the **paste icon** to copy the data of a specific history item.
      * Use the **X icon** to delete a specific history item.
      * Click **"Clear History"** to remove all saved QR codes.
7.  **Clear All:** The **"Clear All"** button resets all input fields and customization options to their default values.
8.  **Theme Toggle:** Use the moon/sun icon in the top right corner to switch between light and dark themes.

-----

## 🛠️ Technologies Used

  * **HTML5:** For the basic structure of the web page.
  * **CSS3:** For styling, layout (including Flexbox and Grid), responsiveness, and theming (using CSS Variables).
  * **JavaScript (ES6+):** For all interactive functionalities, form handling, data formatting, and QR code generation logic.
  * **`qrcode.js`:** A client-side JavaScript library for generating QR codes.
      * [GitHub Repository](https://github.com/davidshimjs/qrcodejs)
  * **Font Awesome:** For icons (theme toggle, download, copy, history, etc.).
      * [Official Website](https://fontawesome.com/)

-----

## 📁 Project Structure

```
.
├── index.html          # The main HTML file for the application interface.
├── style.css           # Contains all the CSS rules for styling and layout.
├── script.js           # Contains all the JavaScript logic for QR code generation, UI interactions, and history management.
├── README.md           # This file.
└── (qrcode.min.js)     # The qrcode.js library is typically linked from a CDN or included in the project.
```

-----

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information (if you create a separate LICENSE file, otherwise, state it directly here).

-----
