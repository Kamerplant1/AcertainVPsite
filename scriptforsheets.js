function filterSheets() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const sheets = document.querySelectorAll('.sheet');

    sheets.forEach(sheet => {
        const text = sheet.textContent.toLowerCase();
        if (text.includes(filter)) {
            sheet.style.display = ""; // Show the sheet
        } else {
            sheet.style.display = "none"; // Hide the sheet
        }
    });
}

document.querySelectorAll('.sheet').forEach(item => {
    item.addEventListener('click', function() {
        const filePath = this.getAttribute('data-file'); // Get the data-file attribute

        // Fetch the content of the text file
        fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(text => {
                document.getElementById('file-content').textContent = text; // Set content to the textbox
                const textbox = document.getElementById('textbox');

                textbox.style.display = 'block'; // Show the textbox

                // Enable dragging
                dragElement(textbox);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                alert('Failed to load the file. Please try again later.');
            });
    });
});

// Close button functionality
document.getElementById('close-btn').addEventListener('click', function() {
    const textbox = document.getElementById('textbox');
    textbox.style.display = 'none'; // Hide the textbox
});

// Copy button functionality
document.getElementById('copy-btn').addEventListener('click', function() {
    const content = document.getElementById('file-content').textContent;
    navigator.clipboard.writeText(content).then(() => {
        const copyBtn = document.getElementById('copy-btn');
        copyBtn.textContent = 'Copied!'; // Change button text
        setTimeout(() => {
            copyBtn.textContent = 'Copy'; // Reset button text after 2 seconds
        }, 2000);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});

function dragElement(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        // Prevent dragging if mouse is down on the resize handle
        if (e.target.classList.contains('resize-handle')) {
            return; // Exit the function if resizing
        }

        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos4 = e.clientY;
        pos3 = e.clientX;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

        // Update the position of the resize handle
        const resizeHandle = elmnt.querySelector('.resize-handle');
        resizeHandle.style.bottom = '5px';
        resizeHandle.style.right = '5px';
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Enable resizing
const resizeHandle = document.querySelector('.resize-handle');

resizeHandle.addEventListener('mousedown', initResize);

function initResize(e) {
    e.preventDefault();
    window.addEventListener('mousemove', elementResize);
    window.addEventListener('mouseup', stopResize);
}

function elementResize(e) {
    const textbox = document.getElementById('textbox');
    const newWidth = e.clientX - textbox.getBoundingClientRect().left;
    const newHeight = e.clientY - textbox.getBoundingClientRect().top;

    textbox.style.width = newWidth + 'px';
    textbox.style.height = newHeight + 'px';

    // Update the position of the resize handle
    const resizeHandle = textbox.querySelector('.resize-handle');
    resizeHandle.style.bottom = '5px';
    resizeHandle.style.right = '5px';
}

function stopResize() {
    window.removeEventListener('mousemove', elementResize);
    window.removeEventListener('mouseup', stopResize);
}