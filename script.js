document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const qrTypeSelect = document.getElementById('qrType');
    const dynamicInputsContainer = document.getElementById('dynamicInputs');
    const textInput = document.getElementById('textInput'); // Corrected ID reference
    const qrSizeInput = document.getElementById('qrSize');
    const qrFgColorInput = document.getElementById('qrFgColor');
    const qrBgColorInput = document.getElementById('qrBgColor');
    const qrMarginInput = document.getElementById('qrMargin');
    const qrErrorCorrectionInput = document.getElementById('qrErrorCorrection');
    const generateBtn = document.getElementById('generateBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrcodeContainer = document.getElementById('qrcode-container');
    const qrMessage = document.getElementById('qr-message');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyTextBtn = document.getElementById('copyTextBtn');
    const copyFeedback = document.getElementById('copyFeedback');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const qrHistoryList = document.getElementById('qrHistoryList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    let qrCodeInstance = null;
    let debounceTimer;

    // --- History Management ---
    const QR_HISTORY_KEY = 'qrCodeHistory';

    function getHistory() {
        try {
            const history = JSON.parse(localStorage.getItem(QR_HISTORY_KEY)) || [];
            return history;
        } catch (e) {
            console.error("Error parsing QR history from localStorage:", e);
            return [];
        }
    }

    function saveHistory(historyItem) {
        let history = getHistory();
        // Add new item to the beginning
        history.unshift(historyItem);
        // Limit history to 10 items
        history = history.slice(0, 10);
        localStorage.setItem(QR_HISTORY_KEY, JSON.stringify(history));
        renderHistory();
    }

    function removeHistoryItem(index) {
        let history = getHistory();
        if (index >= 0 && index < history.length) {
            history.splice(index, 1);
            localStorage.setItem(QR_HISTORY_KEY, JSON.stringify(history));
            renderHistory();
        }
    }

    function renderHistory() {
        const history = getHistory();
        qrHistoryList.innerHTML = ''; // Clear existing list

        if (history.length === 0) {
            qrHistoryList.innerHTML = '<li class="history-placeholder">No QR codes generated yet.</li>';
            clearHistoryBtn.classList.add('hidden');
        } else {
            clearHistoryBtn.classList.remove('hidden');
            history.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="history-item-content">
                        <strong>Type: ${item.type}</strong>
                        <span>${item.displayData.length > 50 ? item.displayData.substring(0, 50) + '...' : item.displayData}</span>
                        <span style="font-size: 0.8em; color: #888;">${new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div class="history-item-actions">
                        <button class="copy-history-item" data-index="${index}" title="Copy data to input">
                            <i class="fas fa-paste"></i>
                        </button>
                        <button class="delete-history-item" data-index="${index}" title="Delete from history">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                li.addEventListener('click', (e) => {
                    // Only trigger if not clicking the buttons
                    if (!e.target.closest('.history-item-actions button')) {
                        loadHistoryItem(index);
                    }
                });
                qrHistoryList.appendChild(li);
            });

            // Add event listeners for delete buttons
            qrHistoryList.querySelectorAll('.delete-history-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent li click
                    const index = parseInt(e.currentTarget.dataset.index);
                    removeHistoryItem(index);
                });
            });

            // Add event listeners for copy history item buttons
            qrHistoryList.querySelectorAll('.copy-history-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent li click
                    const index = parseInt(e.currentTarget.dataset.index);
                    copyHistoryItemDataToInput(index);
                });
            });
        }
    }

    function loadHistoryItem(index) {
        const history = getHistory();
        if (index >= 0 && index < history.length) {
            const item = history[index];

            qrTypeSelect.value = item.type;
            updateDynamicInputs(); // Show correct section

            // Populate main input fields
            qrSizeInput.value = item.options.size;
            qrFgColorInput.value = item.options.fgColor;
            qrBgColorInput.value = item.options.bgColor;
            qrMarginInput.value = item.options.margin;
            qrErrorCorrectionInput.value = item.options.errorCorrection;

            // Populate type-specific fields
            switch (item.type) {
                case 'text': // Corrected case name to match new HTML ID
                    textInput.value = item.inputData.text;
                    break;
                case 'wifi':
                    document.getElementById('wifiSsid').value = item.inputData.ssid;
                    document.getElementById('wifiPassword').value = item.inputData.password;
                    document.getElementById('wifiEncryption').value = item.inputData.encryption;
                    break;
                case 'contact':
                    document.getElementById('contactName').value = item.inputData.name;
                    document.getElementById('contactPhone').value = item.inputData.phone;
                    document.getElementById('contactEmail').value = item.inputData.email;
                    document.getElementById('contactOrg').value = item.inputData.org;
                    break;
                case 'email':
                    document.getElementById('emailTo').value = item.inputData.to;
                    document.getElementById('emailSubject').value = item.inputData.subject;
                    document.getElementById('emailBody').value = item.inputData.body;
                    break;
                case 'sms':
                    document.getElementById('smsNumber').value = item.inputData.number;
                    document.getElementById('smsMessage').value = item.inputData.message;
                    break;
                case 'geo':
                    document.getElementById('geoLat').value = item.inputData.lat;
                    document.getElementById('geoLon').value = item.inputData.lon;
                    break;
                case 'tel':
                    document.getElementById('telNumber').value = item.inputData.number;
                    break;
                case 'event':
                    document.getElementById('eventTitle').value = item.inputData.title;
                    document.getElementById('eventLocation').value = item.inputData.location;
                    document.getElementById('eventDescription').value = item.inputData.description;
                    document.getElementById('eventStart').value = item.inputData.start;
                    document.getElementById('eventEnd').value = item.inputData.end;
                    break;
            }
            generateQRCode(true); // Generate QR code without saving to history again
        }
    }

    function copyHistoryItemDataToInput(index) {
        const history = getHistory();
        if (index >= 0 && index < history.length) {
            const item = history[index];
            let textToCopy = '';
            switch (item.type) {
                case 'text': // Corrected case name
                    textToCopy = item.inputData.text;
                    break;
                case 'wifi':
                    textToCopy = `SSID: ${item.inputData.ssid}, Password: ${item.inputData.password}, Encryption: ${item.inputData.encryption}`;
                    break;
                case 'contact':
                    textToCopy = `Name: ${item.inputData.name || 'N/A'}, Phone: ${item.inputData.phone || 'N/A'}, Email: ${item.inputData.email || 'N/A'}`;
                    break;
                case 'email':
                    textToCopy = `To: ${item.inputData.to}, Subject: ${item.inputData.subject}, Body: ${item.inputData.body}`;
                    break;
                case 'sms':
                    textToCopy = `Number: ${item.inputData.number}, Message: ${item.inputData.message}`;
                    break;
                case 'geo':
                    textToCopy = `Lat: ${item.inputData.lat}, Lon: ${item.inputData.lon}`;
                    break;
                case 'tel':
                    textToCopy = `Number: ${item.inputData.number}`;
                    break;
                case 'event':
                    textToCopy = `Title: ${item.inputData.title}, Location: ${item.inputData.location}, Start: ${item.inputData.start}`;
                    break;
                default:
                    textToCopy = 'No specific data to copy.';
            }
            navigator.clipboard.writeText(textToCopy)
                .then(() => showCopyFeedback('History data copied!'))
                .catch(err => {
                    console.error('Failed to copy history data: ', err);
                    showCopyFeedback('Failed to copy history data.');
                });
        }
    }


    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all history?')) {
            localStorage.removeItem(QR_HISTORY_KEY);
            renderHistory();
            resetQrCodeUI(); // Also reset main UI
            showCopyFeedback('History cleared!');
        }
    });

    // --- Theme Toggle Functionality ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.classList.add(currentTheme);
        if (currentTheme === 'dark-theme') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    // --- Initial Animation for Container ---
    document.querySelector('.container').classList.add('animate-in');

    // --- Dynamic Input Fields ---
    const inputSections = document.querySelectorAll('.input-section');

    function updateDynamicInputs() {
        const selectedType = qrTypeSelect.value;
        inputSections.forEach(section => {
            // Corrected ID matching for text input
            if (section.id === `${selectedType}-inputs`) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        // Clear any previous validation messages when changing type
        document.querySelectorAll('.input-feedback').forEach(el => el.textContent = '');
        document.querySelectorAll('input.invalid, textarea.invalid, select.invalid').forEach(el => el.classList.remove('invalid'));

        // Trigger QR code update for real-time preview
        debounceGenerateQRCode();
    }

    qrTypeSelect.addEventListener('change', updateDynamicInputs);

    // --- QR Code Data Formatting ---
    function getQRCodeDataAndDisplayString() {
        const type = qrTypeSelect.value;
        let qrData = '';
        let displayData = '';
        let inputData = {}; // Store raw input for history

        // Clear all previous validation errors
        document.querySelectorAll('.input-feedback').forEach(el => el.textContent = '');
        document.querySelectorAll('input, textarea, select').forEach(el => el.classList.remove('invalid'));

        let isValid = true;

        switch (type) {
            case 'text': // Corrected case name to match new HTML ID
                const text = textInput.value.trim();
                if (!text) {
                    showInputFeedback(textInput, 'Required field');
                    isValid = false;
                }
                qrData = text;
                displayData = text || "No data entered";
                inputData = { text: text };
                break;
            case 'wifi':
                const ssid = document.getElementById('wifiSsid').value.trim();
                const password = document.getElementById('wifiPassword').value.trim();
                const encryption = document.getElementById('wifiEncryption').value;
                if (!ssid) {
                    showInputFeedback(document.getElementById('wifiSsid'), 'SSID is required');
                    isValid = false;
                }
                qrData = `WIFI:S:${ssid};T:${encryption};P:${password};;`;
                displayData = `SSID: ${ssid}, Enc: ${encryption}`;
                inputData = { ssid, password, encryption };
                break;
            case 'contact':
                const name = document.getElementById('contactName').value.trim();
                const phone = document.getElementById('contactPhone').value.trim();
                const email = document.getElementById('contactEmail').value.trim();
                const org = document.getElementById('contactOrg').value.trim();
                if (!name && !phone && !email && !org) {
                    showInputFeedback(document.getElementById('contactName'), 'At least one field is required');
                    isValid = false;
                }
                qrData = `BEGIN:VCARD\nVERSION:3.0\n${name ? `FN:${name}\n` : ''}${phone ? `TEL:${phone}\n` : ''}${email ? `EMAIL:${email}\n` : ''}${org ? `ORG:${org}\n` : ''}END:VCARD`;
                displayData = `${name || 'No Name'} (${phone || 'No Phone'})`;
                inputData = { name, phone, email, org };
                break;
            case 'email':
                const emailTo = document.getElementById('emailTo').value.trim();
                const emailSubject = document.getElementById('emailSubject').value.trim();
                const emailBody = document.getElementById('emailBody').value.trim();
                if (!emailTo) {
                    showInputFeedback(document.getElementById('emailTo'), 'Recipient is required');
                    isValid = false;
                } else if (!isValidEmail(emailTo)) {
                    showInputFeedback(document.getElementById('emailTo'), 'Invalid email format');
                    isValid = false;
                }
                qrData = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                displayData = `To: ${emailTo}, Subj: ${emailSubject.substring(0, 20)}`;
                inputData = { to: emailTo, subject: emailSubject, body: emailBody };
                break;
            case 'sms':
                const smsNumber = document.getElementById('smsNumber').value.trim();
                const smsMessage = document.getElementById('smsMessage').value.trim();
                if (!smsNumber) {
                    showInputFeedback(document.getElementById('smsNumber'), 'Phone number is required');
                    isValid = false;
                } else if (!isValidPhone(smsNumber)) {
                    showInputFeedback(document.getElementById('smsNumber'), 'Invalid phone number format');
                    isValid = false;
                }
                qrData = `smsto:${smsNumber}:${smsMessage}`;
                displayData = `SMS to: ${smsNumber}`;
                inputData = { number: smsNumber, message: smsMessage };
                break;
            case 'geo':
                const geoLat = document.getElementById('geoLat').value.trim();
                const geoLon = document.getElementById('geoLon').value.trim();
                if (!geoLat || !geoLon) {
                    showInputFeedback(document.getElementById('geoLat'), 'Latitude and Longitude are required');
                    showInputFeedback(document.getElementById('geoLon'), 'Latitude and Longitude are required');
                    isValid = false;
                } else if (isNaN(parseFloat(geoLat)) || isNaN(parseFloat(geoLon))) {
                    showInputFeedback(document.getElementById('geoLat'), 'Must be numbers');
                    showInputFeedback(document.getElementById('geoLon'), 'Must be numbers');
                    isValid = false;
                }
                qrData = `geo:${geoLat},${geoLon}`;
                displayData = `Lat: ${geoLat}, Lon: ${geoLon}`;
                inputData = { lat: geoLat, lon: geoLon };
                break;
            case 'tel':
                const telNumber = document.getElementById('telNumber').value.trim();
                if (!telNumber) {
                    showInputFeedback(document.getElementById('telNumber'), 'Phone number is required');
                    isValid = false;
                } else if (!isValidPhone(telNumber)) {
                    showInputFeedback(document.getElementById('telNumber'), 'Invalid phone number format');
                    isValid = false;
                }
                qrData = `tel:${telNumber}`;
                displayData = `Call: ${telNumber}`;
                inputData = { number: telNumber };
                break;
            case 'event':
                const eventTitle = document.getElementById('eventTitle').value.trim();
                const eventLocation = document.getElementById('eventLocation').value.trim();
                const eventDescription = document.getElementById('eventDescription').value.trim();
                const eventStart = document.getElementById('eventStart').value;
                const eventEnd = document.getElementById('eventEnd').value;

                if (!eventTitle) {
                    showInputFeedback(document.getElementById('eventTitle'), 'Event title is required');
                    isValid = false;
                }
                if (!eventStart) {
                    showInputFeedback(document.getElementById('eventStart'), 'Start date/time is required');
                    isValid = false;
                }
                if (eventStart && eventEnd && new Date(eventStart) > new Date(eventEnd)) {
                    showInputFeedback(document.getElementById('eventEnd'), 'End time must be after start time');
                    isValid = false;
                }

                // Format dates to YYYYMMDDTHHMMSS for iCalendar
                const formatISODate = (isoString) => {
                    if (!isoString) return '';
                    const date = new Date(isoString);
                    return date.getFullYear().toString() +
                        (date.getMonth() + 1).toString().padStart(2, '0') +
                        date.getDate().toString().padStart(2, '0') + 'T' +
                        date.getHours().toString().padStart(2, '0') +
                        date.getMinutes().toString().padStart(2, '0') +
                        date.getSeconds().toString().padStart(2, '0');
                };

                const formattedStart = formatISODate(eventStart);
                const formattedEnd = formatISODate(eventEnd);

                qrData = `BEGIN:VEVENT\nVERSION:2.0\n${eventTitle ? `SUMMARY:${eventTitle}\n` : ''}${eventLocation ? `LOCATION:${eventLocation}\n` : ''}${eventDescription ? `DESCRIPTION:${eventDescription}\n` : ''}${formattedStart ? `DTSTART:${formattedStart}\n` : ''}${formattedEnd ? `DTEND:${formattedEnd}\n` : ''}END:VEVENT`;
                displayData = `Event: ${eventTitle || 'Untitled'} at ${eventLocation || 'N/A'}`;
                inputData = { title: eventTitle, location: eventLocation, description: eventDescription, start: eventStart, end: eventEnd };
                break;
            default:
                qrData = '';
                displayData = '';
                inputData = {};
                isValid = false;
                break;
        }
        return { qrData, displayData, inputData, isValid };
    }

    // --- Validation Helpers ---
    function showInputFeedback(inputElement, message) {
        inputElement.classList.add('invalid');
        const feedbackElement = inputElement.nextElementSibling;
        if (feedbackElement && feedbackElement.classList.contains('input-feedback')) {
            feedbackElement.textContent = message;
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^\+?[0-9\s\-()]{7,20}$/.test(phone); // Basic phone number validation
    }


    // --- QR Code Generation Function ---
    function generateQRCode(fromHistory = false) {
        const { qrData, displayData, inputData, isValid } = getQRCodeDataAndDisplayString();

        if (!isValid || !qrData) {
            resetQrCodeUI();
            return;
        }

        // Get customization options
        const size = parseInt(qrSizeInput.value, 10);
        const fgColor = qrFgColorInput.value;
        const bgColor = qrBgColorInput.value;
        const margin = parseInt(qrMarginInput.value, 10);
        const errorCorrection = qrErrorCorrectionInput.value;

        // Clear previous QR code if exists
        qrcodeDiv.innerHTML = '';
        qrCodeInstance = null;

        qrMessage.style.opacity = '0';
        qrMessage.style.pointerEvents = 'none';

        qrcodeContainer.style.borderColor = 'var(--primary-color)';
        qrcodeContainer.style.backgroundColor = 'var(--input-bg)';

        qrCodeInstance = new QRCode(qrcodeDiv, {
            text: qrData,
            width: size,
            height: size,
            colorDark: fgColor,
            colorLight: bgColor,
            correctLevel: QRCode.CorrectLevel[errorCorrection],
            margin: margin
        });

        setTimeout(() => {
            qrcodeDiv.classList.add('show');
            downloadBtn.classList.remove('hidden');
            downloadBtn.classList.add('show');
            copyTextBtn.classList.remove('hidden');
            copyTextBtn.classList.add('show');
            qrcodeContainer.style.borderColor = 'var(--secondary-color)';
        }, 100);

        if (!fromHistory) { // Only save if not loaded from history
            saveHistory({
                type: qrTypeSelect.value,
                qrData: qrData, // Raw QR data string
                displayData: displayData, // User-friendly display for history
                inputData: inputData, // Raw input data for loading
                options: {
                    size: size,
                    fgColor: fgColor,
                    bgColor: bgColor,
                    margin: margin,
                    errorCorrection: errorCorrection
                },
                timestamp: new Date().toISOString()
            });
        }
    }

    // --- Debounce Function for Real-time Preview ---
    function debounceGenerateQRCode() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            generateQRCode();
        }, 500); // Generate after 500ms of no input
    }

    // --- Event Listeners for Real-time Preview ---
    document.querySelectorAll('#dynamicInputs input, #dynamicInputs textarea, #dynamicInputs select').forEach(input => {
        input.addEventListener('input', debounceGenerateQRCode);
        input.addEventListener('change', debounceGenerateQRCode); // For selects, datetime-local
    });
    document.querySelectorAll('.customization-options input, .customization-options select').forEach(input => {
        input.addEventListener('input', debounceGenerateQRCode);
        input.addEventListener('change', debounceGenerateQRCode); // For color pickers
    });


    generateBtn.addEventListener('click', generateQRCode); // Explicit generate on button click

    // --- Clear All Button ---
    clearAllBtn.addEventListener('click', () => {
        // Reset dynamic inputs
        qrTypeSelect.value = 'text';
        updateDynamicInputs(); // Activates textInput section

        // Clear all dynamic input fields
        document.querySelectorAll('#dynamicInputs input, #dynamicInputs textarea').forEach(input => input.value = '');
        document.querySelectorAll('#dynamicInputs select').forEach(select => {
            // Reset selects to default option or first option
            select.selectedIndex = 0;
        });

        // Clear customization options to defaults
        qrSizeInput.value = '200';
        qrFgColorInput.value = '#333333';
        qrBgColorInput.value = '#ffffff';
        qrMarginInput.value = '4';
        qrErrorCorrectionInput.value = 'H';

        // Clear any validation feedback
        document.querySelectorAll('.input-feedback').forEach(el => el.textContent = '');
        document.querySelectorAll('input.invalid, textarea.invalid, select.invalid').forEach(el => el.classList.remove('invalid'));

        resetQrCodeUI(); // Reset QR code display
        showCopyFeedback('All fields cleared!');
    });


    // --- Download Functionality ---
    downloadBtn.addEventListener('click', () => {
        if (qrCodeInstance) {
            const qrCanvas = qrcodeDiv.querySelector('canvas');
            if (qrCanvas) {
                // To download a higher resolution image, we can scale the canvas
                const scale = 4; // Scale factor for higher resolution
                const scaledCanvas = document.createElement('canvas');
                scaledCanvas.width = qrCanvas.width * scale;
                scaledCanvas.height = qrCanvas.height * scale;
                const ctx = scaledCanvas.getContext('2d');
                ctx.scale(scale, scale);
                ctx.drawImage(qrCanvas, 0, 0);

                const a = document.createElement('a');
                a.href = scaledCanvas.toDataURL("image/png");
                a.download = 'qrcode.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } else {
            alert('Please generate a QR code first!');
        }
    });

    // --- Copy-to-Clipboard Functionality for Input Text ---
    copyTextBtn.addEventListener('click', () => {
        const { qrData, isValid } = getQRCodeDataAndDisplayString();
        if (isValid && qrData) {
            navigator.clipboard.writeText(qrData)
                .then(() => {
                    showCopyFeedback('QR data copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    showCopyFeedback('Failed to copy text.');
                });
        } else {
            showCopyFeedback('No valid data to copy.');
        }
    });

    function showCopyFeedback(message) {
        copyFeedback.textContent = message;
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    }

    // --- Helper function to reset QR code display and buttons ---
    function resetQrCodeUI() {
        qrcodeDiv.classList.remove('show');
        qrMessage.style.opacity = '1';
        qrMessage.style.pointerEvents = 'auto';
        qrcodeContainer.style.borderColor = 'var(--border-color)';
        qrcodeContainer.style.backgroundColor = 'var(--card-bg)';
        downloadBtn.classList.remove('show');
        downloadBtn.classList.add('hidden');
        copyTextBtn.classList.remove('show');
        copyTextBtn.classList.add('hidden');
        if (qrCodeInstance) {
            qrcodeDiv.innerHTML = '';
            qrCodeInstance = null;
        }
    }

    // --- Initial Setup ---
    updateDynamicInputs(); // Initialize dynamic inputs on load
    renderHistory(); // Load and display history on load
});