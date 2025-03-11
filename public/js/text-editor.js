export const TextEditor = {
    init: () => {
        window.quill = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'header': 1 }, { 'header': 2 }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                ]
            }
        })
    },

    destroy: () => {
        if (window.quill) {
            window.quill.root.innerHTML = "";   // Clear content
            window.quill.off();                 // Remove all event listeners
            window.quill = null;                // Set the Quill instance to null
        }

        // Remove the editor container and its toolbar
        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
            const parent = document.getElementById('text-editor');

            // Remove the toolbar if it exists
            const toolbar = parent.querySelector('.ql-toolbar');
            if (toolbar) {
                toolbar.remove();
            }

            // Remove the editor container
            editorContainer.remove();

            // Re-create the editor container
            const newEditorContainer = document.createElement("div");
            newEditorContainer.id = "editor-container";
            parent.appendChild(newEditorContainer);
        }
    }
}