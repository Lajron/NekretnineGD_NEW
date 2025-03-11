import { NekretninaPage, FilterPage, NekretninaItem, NekretninaList } from "./view.js";
import Nekretnina from "./js/nekretnina.js";
import { API } from './api.js';
import { Modal } from "./js/modal.js"; // Ensure Modal is imported

document.addEventListener("DOMContentLoaded", async () => {
    window.scrollTo(0, 0); // Ensure the page scrolls to the top when it is loaded
    const toggleFilter = document.getElementById('toggleFilter');
    const filter = document.getElementById('filter');
    const filterCheckbox = document.getElementById('filter-checkbox');

    // Retrieve the state from localStorage
    const filterState = localStorage.getItem('filterState') === 'true';
    const filterCheckboxState = localStorage.getItem('filterCheckboxState') === 'true';

    // Set the initial state based on localStorage
    if (!filterState) {
        filter.classList.add('hide');
        toggleFilter.innerHTML = '▲ Pretraga nekretnine';
    }
    if (!filterCheckboxState) {
        filterCheckbox.classList.add('hide');
    }

    toggleFilter.addEventListener('click', function() {
        filter.classList.toggle('hide');
        filterCheckbox.classList.toggle('hide');

        // Update the inner HTML based on the visibility state
        if (filter.classList.contains('hide')) {
            toggleFilter.innerHTML = '▲ Pretraga nekretnine';
        } else {
            toggleFilter.innerHTML = '▼ Pretraga nekretnine';
        }

        // Save the state to localStorage
        localStorage.setItem('filterState', !filter.classList.contains('hide'));
        localStorage.setItem('filterCheckboxState', !filterCheckbox.classList.contains('hide'));
    });
    //Prikaz i filtriranje nekretnina
    FilterPage.render();

    const filterResult = FilterPage.getData();
    let nekretninaItems;
    try {
        nekretninaItems = await API.filterNekretnina(filterResult);
        nekretninaItems = applyRangeFilters(nekretninaItems);
        nekretninaItems = applySorting(nekretninaItems);
        NekretninaList.render(nekretninaItems);
    } catch (error) {
        if (error.code === 'permission-denied') {
            await API.signOut();
            window.location.href = "login.html";
        } else {
            console.error("Error fetching nekretnina items:", error);
        }
    }

    document.getElementById("filter-btn")
            .addEventListener("click", async function() {
                const filterResult = FilterPage.getData();
                console.log("Filter result:", filterResult);
                let nekretninaItems = await API.filterNekretnina(filterResult);
                nekretninaItems = applyRangeFilters(nekretninaItems);
                nekretninaItems = applySorting(nekretninaItems);
                console.log("Filtered nekretnina items:", nekretninaItems);
                NekretninaList.render(nekretninaItems);
            });

    document.getElementById("reset-btn")
            .addEventListener("click", function() {
                FilterPage.reset();
            });
    const pretraga = document.getElementById("pretraga");
    const nekretnine = document.getElementById("nekretnine");
    const addNekretnina = document.getElementById("dodaj-modul");

    //DODAJ NEKRETNINU MODUL
    document.getElementById("dodaj-btn")
            .addEventListener("click", function() {
                pretraga.style.display = 'none';
                nekretnine.style.display = 'none';
                addNekretnina.style.display = 'block';
                window.scrollTo(0, 0);
            });

    //NAZAD
    document.getElementById("nazad-btn")
            .addEventListener("click", function() {
                pretraga.style.display = 'block';
                nekretnine.style.display = 'block';
                addNekretnina.style.display = 'none';
                window.scrollTo(0, 0);

                NekretninaPage.reset();

                const dodajBtn = document.getElementById("add-nekretnina-btn");
                const izmeniBtn = document.getElementById("izmeni-nekretnina-btn");
                const resetBtn = document.getElementById("reset-nekretnina-btn");
                dodajBtn.style.display = "block";
                resetBtn.style.display = "block";
                izmeniBtn.style.display = "none";
            });

    //Dodavanje i rad sa nekretnima
    NekretninaPage.render();

    document.getElementById("add-nekretnina-btn")
            .addEventListener("click", async function() {
                const nekretninaData = NekretninaPage.getData();
                await API.createNekretnina(nekretninaData);
                alert("Nekretnina je uspešno dodata!");
                window.location.reload();
            });

    document.getElementById("izmeni-nekretnina-btn")
            .addEventListener("click", async function() {
                const naslov = document.querySelector('#dodaj-grid h3:nth-of-type(1)').textContent;
                const id = naslov.split(" ")[0];
                console.log(id);
                const nekretninaData = NekretninaPage.getData();
                await API.updateNekretnina(id, nekretninaData);
                alert("Nekretnina je uspešno ažurirana!");
                window.location.reload();
            });

    document.getElementById("reset-nekretnina-btn")
            .addEventListener("click", async function() {
                NekretninaPage.reset();
            });
    
    const logoutButton = document.getElementById("logout-btn");
    const mainContent = document.querySelector("main");

    logoutButton.addEventListener("click", async () => {
        await API.signOut();
    });

    API.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                mainContent.style.display = "block";
                logoutButton.style.display = "none";
            } catch (error) {
                if (error.code === 'permission-denied') {
                    await API.signOut();
                    window.location.href = "login.html";
                } else {
                    console.error("Error checking permissions:", error);
                }
            }
        } else {
            window.location.href = "login.html";
        }
    });
});

function applyRangeFilters(nekretninaItems) {
    const cenaMinInput = document.getElementById('f-cenaMin');
    const cenaMaxInput = document.getElementById('f-cenaMax');
    const kvadraturaMinInput = document.getElementById('f-kvadraturaMin');
    const kvadraturaMaxInput = document.getElementById('f-kvadraturaMax');

    const cenaMin = cenaMinInput && cenaMinInput.value !== "" ? parseFloat(cenaMinInput.value) : null;
    const cenaMax = cenaMaxInput && cenaMaxInput.value !== "" ? parseFloat(cenaMaxInput.value) : null;
    const kvadraturaMin = kvadraturaMinInput && kvadraturaMinInput.value !== "" ? parseFloat(kvadraturaMinInput.value) : null;
    const kvadraturaMax = kvadraturaMaxInput && kvadraturaMaxInput.value !== "" ? parseFloat(kvadraturaMaxInput.value) : null;

    return nekretninaItems.filter(item => {
        const cena = parseFloat(item.nekretnina.cena);
        const kvadratura = parseFloat(item.nekretnina.kvadratura);

        const isCenaValid = (cenaMin === null || cena >= cenaMin) && (cenaMax === null || cena <= cenaMax);
        const isKvadraturaValid = (kvadraturaMin === null || kvadratura >= kvadraturaMin) && (kvadraturaMax === null || kvadratura <= kvadraturaMax);

        return isCenaValid && isKvadraturaValid;
    });
}

function applySorting(nekretninaItems) {
    const sortSelect = document.getElementById("sortirajPo");
    const sortValue = sortSelect.value;

    switch (sortValue) {
        case "Datum - Opadajuci":
            return nekretninaItems.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
        case "Datum - Rastuci":
            return nekretninaItems.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
        case "Cena - Rastuca":
            return nekretninaItems.sort((a, b) => a.nekretnina.cena - b.nekretnina.cena);
        case "Cena - Opadajuca":
            return nekretninaItems.sort((a, b) => b.nekretnina.cena - a.nekretnina.cena);
        case "Kvadratura - Rastuca":
            return nekretninaItems.sort((a, b) => a.nekretnina.kvadratura - b.nekretnina.kvadratura);
        case "Kvadratura - Opadajuca":
            return nekretninaItems.sort((a, b) => b.nekretnina.kvadratura - a.nekretnina.kvadratura);
        default:
            return nekretninaItems;
    }
}