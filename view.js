import Nekretnina from './js/nekretnina.js';
import { Mesto, NekretninaHTML, VlasnikHTML, TagoviHTML, FilterHTML } from './data.js';
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

            for (const key in Mesto) {
                if (Mesto.hasOwnProperty(key)) {
                  const defaultOption = { "- Izaberite...": ["- Izaberite..."] };
                  Mesto[key] = { ...defaultOption, ...Mesto[key] };
                }
              }
        },

        mol: (m = "", o = "", l = "", mId = "mesto", oId = "opstina", lId = "lokacija") => {
            const mesto = document.getElementById(mId);
            const opstina = document.getElementById(oId);
            const lokacija = document.getElementById(lId);
    
            mesto.innerHTML = opstina.innerHTML = lokacija.innerHTML = ""
    
            NekretninaPage.populateElements.select(mId, Object.keys(Mesto));
            if (m.length) mesto.value = m;
    
            NekretninaPage.populateElements.select(oId, Object.keys(Mesto[mesto.value]));
            if (o.length) opstina.value = o;
    
            NekretninaPage.populateElements.select(lId, Mesto[mesto.value][opstina.value]);
            if (l.length) lokacija.value = l;
    
            mesto.addEventListener('change', () => {
                opstina.innerHTML = "";
                NekretninaPage.populateElements.select(oId, Object.keys(Mesto[mesto.value]));
    
                lokacija.innerHTML = "";
                NekretninaPage.populateElements.select(lId, Mesto[mesto.value][opstina.value])
            });
    
            opstina.addEventListener('change', () => {
                lokacija.innerHTML = "";
                NekretninaPage.populateElements.select(lId, Mesto[mesto.value][opstina.value])
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
        NekretninaPage.populateElements.mol("Niš", "Crveni Krst", "Branko Bjegović");
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

export const FilterPage = { 
    renderElements: {
        input: (name, placeholder, type = "text", value = "") => {
            return `<input type="${type}" name="${name}" id="${name}" value="${value}" placeholder="${placeholder}" />`;
        },

        select: (name, options) => {
            let optionsHtml = `<option value="">- Izaberite...</option>`;
            optionsHtml += options.map(option => `<option value="${option}">${option}</option>`).join('');
            return `<select name="${name}" id="${name}">${optionsHtml}</select>`;
        },

        checkbox: (name, label) => {
            return `<div class="filter-checkbox-child">
                        <input type="checkbox" name="${name}" id="${name}" />
                        <label for="${name}">${label}</label>
                    </div>`;
        },

        range: (fields) => {
            return fields.map(field => {
                return `${FilterPage.renderElements.input(field.id, field.placeholder, field.type)}`;
            }).join('');
        },
    },

    renderFilter: () => {
        const container = document.querySelector('#filter');

        FilterHTML.inputs.forEach(item => {
            let content = '';
            if (item.type === "text" || item.type === "number") {
                content = FilterPage.renderElements.input(item.id, item.label, item.type);
            } else if (item.type === "select") {
                content = FilterPage.renderElements.select(item.id, item.options);
            } else if (item.type === "range") {
                content = `<div class="filter-range">${FilterPage.renderElements.range(item.fields)}</div>`;
            }

            const filterChild = document.createElement('div');
            filterChild.className = 'filter-child';
            filterChild.innerHTML = `<label for="${item.id}">${item.label}</label>${content}`;
            container.appendChild(filterChild);
        });

        const checkboxContainer = document.querySelectorAll('#filter-checkbox .checkbox-column');

        FilterHTML.checkboxes.forEach((item, index) => {
            const content = FilterPage.renderElements.checkbox(item.id, item.label);
            const columnIndex = index % checkboxContainer.length;
            checkboxContainer[columnIndex].innerHTML += content;
        });

        NekretninaPage.populateElements.mol("Niš", "", "", "f-mesto", "f-opstina", "f-lokacija");

    },

    render: () => {
        FilterPage.renderFilter();
    }
}

export const NekretninaItem = {
    renderTop: (data) => {
        return `
            <div class="nekretnina-top">
                <div class="nekretnina-top-aktivnost">
                    <h3>${data.nekretnina.cena}€</h3>
                </div>
                <div class="nekretnina-top-naslov">
                    <h3>${data.id}, ${data.nekretnina.usluga}, ${data.nekretnina.tip_nekretnine}, ${data.nekretnina.lokacija}</h3>
                </div>
                <div class="nekretnina-top-opcije">
                    <button type="button" id="edit-btn" class="btn secondary">Izmeni</button>
                    <button type="button" id="remove-btn" class="btn secondary">⨉</button>
                </div>
            </div>
            <hr>
        `;
    },

    renderMiddle: (data) => {
        const imagesHtml = data.slike.map((src, index) => `<img src="${src}" alt="Nekretnina Photo" data-index="${index}" class="${index === 0 ? 'active' : 'hidden'}">`).join('');
        return `
            <div class="nekretnina-middle">
                <div class="photo" id="slideshow-modal">
                    ${imagesHtml}
                </div>
                <div class="nekretnina-middle-info">
                    <h4>Nekretnina</h4>
                    <ul>
                        <li>${data.nekretnina.tip_nekretnine}</li>
                        <li>${data.nekretnina.kvadratura} m2, ${data.nekretnina.plac} ar</li>
                        <li>${data.nekretnina.namestenost}</li>
                        <li>${data.nekretnina.sprat} / ${data.nekretnina.br_spratova}</li>
                        <li>${data.nekretnina.mesto} - ${data.nekretnina.opstina} - ${data.nekretnina.lokacija}</li>
                        <li>${data.nekretnina.adresa}</li>
                    </ul>
                </div>
                <div class="nekretnina-middle-karakteristike">
                    <h4>Karakteristike</h4>
                    <ul>
                        <li>${data.nekretnina.polozaj_nekretnine}</li>
                        <li>${data.nekretnina.tip_objekta} - ${data.nekretnina.stanje_nekretnine}</li>
                        <li>${data.nekretnina.dokumentacija}</li>
                        <li>Sobe: ${data.nekretnina.br_soba}, kupatila: ${data.nekretnina.br_kupatila}</li>
                        <li>Lift: ${data.nekretnina.br_lift}, terasa: ${data.nekretnina.br_terasa}</li>
                        <li>${data.nekretnina.grejanje}</li>
                    </ul>
                </div>
                <div class="nekretnina-middle-klijent">
                    <h4>Klijent</h4>
                    <ul>
                        <li>${data.vlasnik.imePrezime}</li>
                        <li>${data.vlasnik.brojTelefona1}</li>
                        <li>${data.vlasnik.email}</li>
                        <li>${data.vlasnik.d_lokacija}</li>
                    </ul>
                </div>
            </div>
        `;
    },

    renderBottom: (data) => {
        const tags = [...Object.keys(data.tagovi).filter(tag => data.tagovi[tag]).map(tag => tag.toUpperCase())];
        const tagsHtml = tags.map(tag => `<a class="tag">${tag}</a>`).join('');
        return `
            <div class="nekretnina-bottom">
                <section class="nekretnina-bottom-info">
                    ${data.opis}
                </section>
                <div class="nekretnina-bottom-tags">
                    ${tagsHtml}
                </div>
            </div>
        `;
    },

    render: (data, parent = "nekretnine") => {
        const container = document.getElementById(parent);

        const nekretninaItem = document.createElement('article');
        nekretninaItem.className = 'nekretnina';
        nekretninaItem.innerHTML = `
            ${NekretninaItem.renderTop(data)}
            ${NekretninaItem.renderMiddle(data)}
            ${NekretninaItem.renderBottom(data)}
        `;
        container.appendChild(nekretninaItem);
        console.log("in render");
        Modal.imageSlider();
    }
};






