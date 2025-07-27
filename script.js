// script.js

// --- Modal Functions (unchanged from previous interaction) ---
function openModal(imageSrc) {
    let modal = document.getElementById("myModal");
    let modalImg = document.getElementById("modalImage");
    let modalAuthorName = document.getElementById("modalAuthorName");
    let modalAuthorEmail = document.getElementById("modalAuthorEmail");

    const allImages = document.querySelectorAll('.gallery-item img');
    let clickedImageElement = null;
    for (const img of allImages) {
        if (img.src === imageSrc) {
            clickedImageElement = img;
            break;
        }
    }

    if (clickedImageElement) {
        const authorName = clickedImageElement.dataset.authorName;
        const authorEmail = clickedImageElement.dataset.authorEmail;

        modal.style.display = "block";
        modalImg.src = imageSrc;
        modalAuthorName.textContent = `Author: ${authorName || 'N/A'}`;
        modalAuthorEmail.textContent = `Email: ${authorEmail || 'N/A'}`;
    } else {
        console.error("Could not find the clicked image element.");
        modal.style.display = "block";
        modalImg.src = imageSrc;
        modalAuthorName.textContent = 'Author: N/A';
        modalAuthorEmail.textContent = 'Email: N/A';
    }
}

function closeModal() {
    let modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// --- Image Submission Functions ---

document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.querySelector('.gallery'); // Get the gallery container
    const imageUploadInput = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');
    const imageUrlInput = document.getElementById('imageUrl');

    // Event listener for image file selection
    imageUploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0]; // Get the selected file

        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert("Please select an image file.");
                imageUploadInput.value = ''; // Clear the input
                imagePreview.style.display = 'none';
                return;
            }

            // Read the file as a Data URL (base64 encoded string)
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result; // Set the preview image source
                imagePreview.style.display = 'block'; // Show the preview
                imageUrlInput.value = ''; // Clear URL input if file is chosen
            };
            reader.readAsDataURL(file); // Start reading the file
        } else {
            imagePreview.style.display = 'none'; // Hide preview if no file selected
            imagePreview.src = '';
        }
    });

    // Event listener for image URL input (clear file input if URL is typed)
    imageUrlInput.addEventListener('input', function() {
        if (imageUrlInput.value) {
            imageUploadInput.value = ''; // Clear file input
            imagePreview.style.display = 'block'; // Assume URL is valid for preview
            imagePreview.src = imageUrlInput.value;
        } else {
            imagePreview.style.display = 'none';
            imagePreview.src = '';
        }
    });
});

// Function to handle image submission (called by the "Submit Image" button)
function submitImage() {
    const authorEmail = document.getElementById('authorEmail').value.trim();
    const authorName = document.getElementById('authorName').value.trim();
    const imageAlt = document.getElementById('imageAlt').value.trim();
    const imageFile = document.getElementById('imageUpload').files[0]; // The actual file object
    const imageUrl = document.getElementById('imageUrl').value.trim();

    // Basic client-side validation
    if (!authorEmail || !authorName || !imageAlt || (!imageFile && !imageUrl)) {
        alert("Please fill in author email, name, image description, and either upload a file or provide an image URL.");
        return;
    }
    if (!authorEmail.includes('@') || !authorEmail.includes('.')) {
        alert("Please enter a valid email address.");
        return;
    }

    let finalImageSrc = '';

    if (imageFile) {
        // Option 1: User uploaded a file
        // IMPORTANT: In a real application, you would send this file to a server
        // The server would save it and return a permanent URL.
        // For this purely front-end example, we'll use FileReader to get a Data URL
        // but this Data URL is temporary and not shareable/persistent.

        const reader = new FileReader();
        reader.onload = function(e) {
            finalImageSrc = e.target.result; // Data URL for preview

            // Now, add the image to the gallery DOM
            addGalleryItemToDOM(finalImageSrc, imageAlt, authorName, authorEmail);
            alert("Image added to gallery (client-side only)! In a real app, this would be uploaded to a server.");
            resetForm(); // Clear the form fields
        };
        reader.readAsDataURL(imageFile); // Read the file
    } else if (imageUrl) {
        // Option 2: User provided a URL
        finalImageSrc = imageUrl;

        // Now, add the image to the gallery DOM
        addGalleryItemToDOM(finalImageSrc, imageAlt, authorName, authorEmail);
        alert("Image added to gallery (via URL)! Note: Server-side validation recommended for external URLs.");
        resetForm(); // Clear the form fields
    }
}

// Helper function to add a new gallery item to the DOM
function addGalleryItemToDOM(imageSrc, imageAlt, authorName, authorEmail) {
    const galleryContainer = document.querySelector('.gallery'); // Get the gallery container

    // 1. Create the main container for the gallery item
    const galleryItemDiv = document.createElement('div');
    galleryItemDiv.classList.add('gallery-item'); // Add a class for styling

    // 2. Create the image element
    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    imgElement.alt = imageAlt;
    imgElement.setAttribute('onclick', `openModal('${imageSrc}')`); // Re-add onclick
    // Add data attributes for author info for modal to use later
    imgElement.setAttribute('data-author-name', authorName);
    imgElement.setAttribute('data-author-email', authorEmail);

    // 3. Append the image to the gallery item div
    galleryItemDiv.appendChild(imgElement);

    // No need to add author name/email directly under the image in the gallery view
    // as it's only shown in the modal. If you want it there, uncomment these:
    /*
    const authorNameElement = document.createElement('h3');
    authorNameElement.textContent = authorName;
    const authorEmailElement = document.createElement('p');
    authorEmailElement.textContent = authorEmail;
    galleryItemDiv.appendChild(authorNameElement);
    galleryItemDiv.appendChild(authorEmailElement);
    */

    // 4. Append the complete gallery item to the main gallery container
    galleryContainer.appendChild(galleryItemDiv);
}

// Function to reset the form fields after submission
function resetForm() {
    document.getElementById('authorEmail').value = '';
    document.getElementById('authorName').value = '';
    document.getElementById('imageAlt').value = '';
    document.getElementById('imageUpload').value = ''; // Clear file input
    document.getElementById('imageUrl').value = ''; // Clear URL input
    document.getElementById('imagePreview').style.display = 'none'; // Hide preview
    document.getElementById('imagePreview').src = ''; // Clear preview src
}

// Your original 'verify' function for the initial form (if still needed)
// renamed to avoid conflict if you decide to keep both forms.
// If the 'Add Your Image' form replaces the 'Enter your data here' form,
// you can remove this function or adapt it.
function verifyInitialForm() {
    let email = document.getElementById("email").value; // Assuming these are different IDs for old form
    let name = document.getElementById("name").value;
    let message = document.getElementById("message").value;

    if (email === "" || name === "" || message === "") {
        alert("Please fill in all fields for the original form.");
        return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert("Please enter a valid email address for the original form.");
        return false;
    }

    alert(`Original Form Submitted!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
    return true;
}