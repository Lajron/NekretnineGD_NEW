// import { Data } from "../data.js";

export const Utility = {
    getNekretnina: (parent) => {
        const formElements = document.querySelectorAll(parent);
        const formattedData = {};

        formElements.forEach(element => {
            const label = element.querySelector('label');
            const input = element.querySelector('input, select');
            
            if (label && input) {
                const labelName = label.getAttribute('for');
                const inputValue = input.value;

                // Push an object with 'labelFor' (the id of the input/select) and 'inputValue'
                formattedData[labelName] = inputValue;
            }
        });
        return formattedData;
    },

    getVlasnik: function(parent) {
        return this.getNekretnina(parent);
    },

    getTagovi: () => {
        const checkboxElements = document.querySelectorAll("input[type='checkbox']");
        const formattedData = {};

        checkboxElements.forEach(checkbox => {
            const name = checkbox.name;  // The 'name' attribute of the checkbox
            formattedData[name] = checkbox.checked;
    });
    return formattedData;
    },

    getOpis: () => {
        return window.quill.root.innerHTML;
    },

    getSlike: () => {
        const imgElements = document.querySelectorAll("#photo-uploader img");
        return Array.from(imgElements).map(img => img.dataset.fullsize);
    },

    resetNekretnina: function() {
        document.querySelectorAll("input, select").forEach(el => {
            if (el.type === "checkbox") {
                el.checked = false; // Uncheck checkboxes/radios
            } else {
                el.value = ""; // Clear text fields and selects
            } 
        });
    
        // Reset Quill editor if used
        if (window.quill) {
            window.quill.setContents([]);
        }
        
        this.populateSelectMOL();
        
        // Reset uploaded images
        document.querySelectorAll("#photo-uploader .image-wrapper").forEach(img => img.remove());
    },

    populateSelect: (id, options) => {
        const selectElement = document.getElementById(id);

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    },

    populateSelectMOL: function(m = "", o = "", l = "") {
        const mesto = document.getElementById("mesto");
        const opstina = document.getElementById("opstina");
        const lokacija = document.getElementById("lokacija");

        mesto.innerHTML = opstina.innerHTML = lokacija.innerHTML = ""

        this.populateSelect("mesto", Object.keys(Data["mesto"]));
        if (m.length) mesto.value = m;

        this.populateSelect("opstina", Object.keys(Data["mesto"][mesto.value]));
        if (o.length) opstina.value = o;

        this.populateSelect("lokacija", Data["mesto"][mesto.value][opstina.value]);
        if (l.length) lokacija.value = l;

        mesto.addEventListener('change', () => {
            opstina.innerHTML = "";
            this.populateSelect("opstina", Object.keys(Data["mesto"][mesto.value]));

            lokacija.innerHTML = "";
            this.populateSelect("lokacija", Data["mesto"][mesto.value][opstina.value])
        });

        opstina.addEventListener('change', () => {
            lokacija.innerHTML = "";
            this.populateSelect("lokacija", Data["mesto"][mesto.value][opstina.value])
        });
    },

    setSelects: function(m = "", o = "", l = "") {
        Object.keys(Data).forEach(key => {
            if (key !== "mesto") {
                this.populateSelect(key, Data[key]);
            }
        });

        this.populateSelectMOL(m, o, l);
    }
} 