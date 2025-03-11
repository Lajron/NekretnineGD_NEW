export const PhotoUploader = {
    init: () => {
        PhotoUploader.destroy();
        PhotoUploader.create();
        
        const fileInput = document.getElementById('img-input');
        const previewContainer = document.getElementById('photo-uploader');
        
        previewContainer.addEventListener('dragover', function(event) {
            event.preventDefault();
            previewContainer.style.backgroundColor = '#f0f0f0'; // Change background color on drag over
        });

        // Drag-leave event listener: Revert background color
        previewContainer.addEventListener('dragleave', function() {
            previewContainer.style.backgroundColor = '#ffffff'; // Reset background color
        });

        previewContainer.addEventListener('drop', function(event) {
            event.preventDefault();
            previewContainer.style.backgroundColor = '#ffffff'; // Reset background color

            const files = event.dataTransfer.files;
            handleFiles(files);
        });

        
        // File input change event: Handle file selection
        fileInput.addEventListener('change', function(event) {
            const files = fileInput.files;
            handleFiles(files);
        });

        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) { // Only process image files
                    const reader = new FileReader();
                    reader.readAsDataURL(file);

                    reader.onload = function(e) {
                        const img = new Image();
                        img.src = e.target.result;

                        img.onload = function() {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');

                            const maxWidth = 800;  // Resize width
                            const maxHeight = 800; // Resize height
                            let width = img.width;
                            let height = img.height;

                            // Scale down if larger than max dimensions
                            if (width > maxWidth || height > maxHeight) {
                                const scale = Math.min(maxWidth / width, maxHeight / height);
                                width *= scale;
                                height *= scale;
                            }

                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);

                            // Convert to compressed Base64
                            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality (0.7 = 70%)

                            // Create image wrapper
                            PhotoUploader.addImage(previewContainer, compressedBase64);
                        };
                    };
                } else {
                    alert("Please select an image file.");
                }
            });
        }
    },
    
    addImage: (parent, data) => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('image-wrapper');

        const previewImg = document.createElement('img');
        previewImg.src = data;
        previewImg.dataset.fullsize = data;

        const deleteBtn = document.createElement('span');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = "✖"; // Trash icon (🗑)

        deleteBtn.addEventListener('click', function() {
            imgContainer.remove();
        });

        imgContainer.appendChild(previewImg);
        imgContainer.appendChild(deleteBtn);
        parent.appendChild(imgContainer);
    },

    clear: () => {
        document.querySelectorAll("#photo-uploader .image-wrapper").forEach(img => img.remove());
    },

    destroy: () => {
        const uploader = document.getElementById('photo-uploader').remove();
        if (uploader) {
            uploader.remove();
        }
    },

    create: () => {
        const uploader = document.createElement('div');
        uploader.id = 'photo-uploader';

        const input = document.createElement('input');
        input.id = 'img-input';
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.style.display = 'none';

        const label = document.createElement('label');
        label.htmlFor = 'img-input';
        label.classList.add('plus-btn');
        label.innerHTML = '＋';

        uploader.appendChild(label);
        uploader.appendChild(input);

        const parent = document.querySelector("#add-description");
        if (parent) parent.appendChild(uploader);

    }
}