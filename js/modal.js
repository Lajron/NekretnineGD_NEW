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

    novaNekretnina: () => {

    }
}