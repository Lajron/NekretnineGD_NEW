export const Modal = {
    image: () => {
        const previewContainer = document.getElementById('photo-uploader');
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        const closeModal = document.getElementById('close-modal');

        previewContainer.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() === 'img') {
                modal.style.display = 'flex';
                modalImg.src = e.target.src;  // Set modal image to clicked image
            }
        });

        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target === modal)
                modal.style.display = 'none';
        });
    },

    imageSlider: (container) => {
        console.log("Image slider initialized");
        const modal = document.getElementById('slider-modal');
        const modalImg = document.getElementById('slider-modal-img');
        const closeModal = document.getElementById('slider-close-modal');
        const prevBtn = document.getElementById('slider-prev-btn');
        const nextBtn = document.getElementById('slider-next-btn');
        let currentIndex = 0;
        let images = [];

        container.addEventListener('click', function(e) {
            if (e.target.closest('.photo') && e.target.tagName.toLowerCase() === 'img') {
                console.log("Image clicked");                
                images = Array.from(e.target.closest('.photo').querySelectorAll('img'));
                currentIndex = images.indexOf(e.target);
                modal.style.display = 'flex';
                modalImg.src = e.target.src;
            }
        });

        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            modalImg.src = images[currentIndex].src;
        });

        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            modalImg.src = images[currentIndex].src;
        });
    }
}
