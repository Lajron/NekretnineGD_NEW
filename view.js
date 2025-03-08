import { Mesto, Nekretnina, Vlasnik, Tagovi } from './data.js';
    

export const View = {
    renderInput: (name, placeholder, type = "text", value = "") => {
        return `<input type="${type}" name="${name}" id="${name}" placeholder="${placeholder}" value="${value}" />`;
    },

    renderSelect: (name, options) => {
        let optionsHtml = `<option value="">- Izaberite...</option>`;
        optionsHtml += options.map(option => `<option value="${option}">${option}</option>`).join('');
        return `<select name="${name}" id="${name}">${optionsHtml}</select>`;
    },

    renderCheckbox: (name, label) => {
        return `<label for="${name}"><input type="checkbox" name="${name}" id="${name}" /> ${label}</label>`;
    },

    renderMultiInput: (fields) => {
        return fields.map(field => {
            if (field.type === "text" || field.type === "number") {
                return `<div>${View.renderInput(field.id, field.label, field.type)}</div>`;
            } else if (field.type === "select") {
                return `<div>${View.renderSelect(field.id, field.options)}</div>`;
            }
        }).join('');
    },

    renderNekretninaAdd: () => {
        const container = document.querySelector('#add-nekretnina');

        Nekretnina.forEach(item => {
            let content = '';
            if (item.type === "text" || item.type === "number") {
                content = View.renderInput(item.id, item.label, item.type);
            } else if (item.type === "select") {
                content = View.renderSelect(item.id, item.options);
            } else if (item.type === "multi") {
                content = View.renderMultiInput(item.fields);
            }

            const filterChild = document.createElement('div');
            filterChild.className = 'filter-child';
            if (item.type === "multi") {
                filterChild.classList.add('two-line');
            }
            filterChild.innerHTML = `<label for="${item.id}">${item.label}</label>${content}`;
            container.appendChild(filterChild);
        });
    },

    renderVlasnikAdd: () => {
        const container = document.querySelector('#add-vlasnik');

        Vlasnik.forEach(item => {
            const content = View.renderInput(item.id, item.label, item.type);
            const filterChild = document.createElement('div');
            filterChild.className = 'filter-child';
            filterChild.innerHTML = `<label for="${item.id}">${item.label}</label>${content}`;
            container.appendChild(filterChild);
        });
    },

    renderTagsAdd: () => {
        const container = document.querySelector('#add-tags .checkbox-column');

        Tagovi.forEach(tag => {
            const content = View.renderCheckbox(tag.id, tag.label);
            const filterChild = document.createElement('div');
            filterChild.className = 'filter-checkbox-child';
            filterChild.innerHTML = content;
            container.appendChild(filterChild);
        });
    }
};
