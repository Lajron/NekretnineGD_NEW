import Nekretnina from './js/nekretnina.js';
import { Mesto, NekretninaHTML, VlasnikHTML, TagoviHTML } from './data.js';
import { TextEditor } from "./js/text-editor.js"
import { PhotoUploader } from "./js/photo-uploader.js"
import { Modal } from "./js/modal.js";


export const NekretninaPage = {
    renderElements:{
        input: (name, placeholder, type = "text", value = "") => {
            return `<input type="${type}" name="${name}" id="${name}" value="${value}" />`;
        },

        select: (name, options) => {
            let optionsHtml = `<option value="">- Izaberite...</option>`;
            optionsHtml += options.map(option => `<option value="${option}">${option}</option>`).join('');
            return `<select name="${name}" id="${name}">${optionsHtml}</select>`;
        },

        checkbox: (name, label) => {
            return `<label for="${name}"><input type="checkbox" name="${name}" id="${name}" /> ${label}</label>`;
        },

        multiInput: (fields) => {
            return fields.map(field => {
                return `
                    <div>
                        <label for="${field.id}">${field.label}</label>
                        ${NekretninaPage.renderElements.input(field.id, field.label, field.type)}
                    </div>
                `;
            }).join('');
        },
    },

    populateElements: {
        select: (id, options) => {
            const selectElement = document.getElementById(id);
    
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.textContent = option;
                selectElement.appendChild(optionElement);
            });
        },

        mol: (m = "", o = "", l = "") => {
            const mesto = document.getElementById("mesto");
            const opstina = document.getElementById("opstina");
            const lokacija = document.getElementById("lokacija");
    
            mesto.innerHTML = opstina.innerHTML = lokacija.innerHTML = ""
    
            NekretninaPage.populateElements.select("mesto", Object.keys(Mesto));
            if (m.length) mesto.value = m;
    
            NekretninaPage.populateElements.select("opstina", Object.keys(Mesto[mesto.value]));
            if (o.length) opstina.value = o;
    
            NekretninaPage.populateElements.select("lokacija", Mesto[mesto.value][opstina.value]);
            if (l.length) lokacija.value = l;
    
            mesto.addEventListener('change', () => {
                opstina.innerHTML = "";
                NekretninaPage.populateElements.select("opstina", Object.keys(Mesto[mesto.value]));
    
                lokacija.innerHTML = "";
                NekretninaPage.populateElements.select("lokacija", Mesto[mesto.value][opstina.value])
            });
    
            opstina.addEventListener('change', () => {
                lokacija.innerHTML = "";
                NekretninaPage.populateElements.select("lokacija", Mesto[mesto.value][opstina.value])
            });
        },
    },

    renderComponents: {
        nekretnina: () => {
            const container = document.querySelector('#add-nekretnina');
    
            NekretninaHTML.forEach(item => {
                let content = '';
                if (item.type === "text" || item.type === "number") {
                    content = NekretninaPage.renderElements.input(item.id, item.label, item.type);
                } else if (item.type === "select") {
                    content = NekretninaPage.renderElements.select(item.id, item.options);
                } else if (item.type === "multi") {
                    content = NekretninaPage.renderElements.multiInput(item.fields);
                }
    
                const filterChild = document.createElement('div');
                filterChild.className = 'filter-child';
                if (item.type === "multi") {
                    filterChild.classList.add('two-line');
                    filterChild.innerHTML = `${content}`;
                }  else
                    filterChild.innerHTML = `<label for="${item.id}">${item.label}</label>${content}`;
                container.appendChild(filterChild);
            });
        },
    
        vlasnik: () => {
            const container = document.querySelector('#add-vlasnik');
    
            VlasnikHTML.forEach(item => {
                const content = NekretninaPage.renderElements.input(item.id, "", item.type);
                const filterChild = document.createElement('div');
                filterChild.className = 'filter-child';
                filterChild.innerHTML = `<label for="${item.id}">${item.label}</label>${content}`;
                container.appendChild(filterChild);
            });
        },
    
        tags: () => {
            const container = document.querySelector('#add-tags .checkbox-column');
    
            TagoviHTML.forEach(tag => {
                const content = NekretninaPage.renderElements.checkbox(tag.id, tag.label);
                const filterChild = document.createElement('div');
                filterChild.className = 'filter-checkbox-child';
                filterChild.innerHTML = content;
                container.appendChild(filterChild);
            });
        },
    },
    
    render: () => {
        NekretninaPage.renderComponents.nekretnina();
        document.getElementById("aktivan_oglas").selectedIndex = 1;
        NekretninaPage.renderComponents.vlasnik();
        NekretninaPage.renderComponents.tags();
        TextEditor.init();
        PhotoUploader.init();
        Modal.image();
        NekretninaPage.populateElements.mol();
    },

    reset: () => {
        // Clear the content of the main sections
        document.querySelector('#add-nekretnina').innerHTML = '';
        document.querySelector('#add-vlasnik').innerHTML = '';
        document.querySelector('#add-tags .checkbox-column').innerHTML = '';
        PhotoUploader.init();
        TextEditor.destroy();

        // Re-render the page
        NekretninaPage.render();
    },

    update: (nekretnina) => {
            NekretninaPage.reset();
            for (const key in nekretnina.nekretnina) {
                const element = document.getElementById(key);
                if (element) {
                    element.value = nekretnina.nekretnina[key];
                }
            }

            NekretninaPage.populateElements.mol(nekretnina.nekretnina["mesto"], nekretnina.nekretnina["opstina"], nekretnina.nekretnina["lokacija"])

            for (const key in nekretnina.vlasnik) {
                const element = document.getElementById(key);
                if (element) {
                    element.value = nekretnina.vlasnik[key];
                }
            }

            for (const key in nekretnina.vlasnik) {
                const element = document.getElementById(key);
                if (element) {
                    element.value = nekretnina.vlasnik[key];
                }
            }

            if (window.quill) {
                window.quill.root.innerHTML = nekretnina.opis;
            }

            const previewContainer = document.getElementById('photo-uploader');
            nekretnina.slike.forEach(slika => {
                PhotoUploader.addImage(previewContainer, slika);
            });
    },

    getData: () => {
        const nekretninaData = {};
        NekretninaHTML.forEach(item => {
            if (item.type === "multi") {
                item.fields.forEach(field => {
                    const element = document.getElementById(field.id);
                    if (element) {
                        nekretninaData[field.id] = element.value;
                    }
                });
            } else {
                const element = document.getElementById(item.id);
                if (element) {
                    nekretninaData[item.id] = element.value;
                }
            }
        });

        const vlasnikData = {};
        VlasnikHTML.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                vlasnikData[item.id] = element.value;
            }
        });

        const tagoviData = {};
        TagoviHTML.forEach(tag => {
            const element = document.getElementById(tag.id);
            if (element) {
                tagoviData[tag.id] = element.checked;
            }
        });

        const opisData = window.quill ? window.quill.root.innerHTML : "";

        const imgElements = document.querySelectorAll("#photo-uploader img");
        const slikeData = Array.from(imgElements).map(img => img.dataset.fullsize);

        const nekretnina = new Nekretnina(nekretninaData, vlasnikData, tagoviData, opisData, slikeData);
        console.log(nekretnina);

        return nekretnina;

    },
};
