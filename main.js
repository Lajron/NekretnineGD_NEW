import { NekretninaPage, FilterPage, NekretninaItem } from "./view.js";
import Nekretnina from "./js/nekretnina.js";

document.addEventListener("DOMContentLoaded", () => {
    //Prikaz i filtriranje nekretnina
    FilterPage.render();
    const pretraga = document.getElementById("pretraga");
    const nekretnine = document.getElementById("nekretnine");
    const addNekretnina = document.getElementById("dodaj-modul");
    // pretraga.style.display = 'none';
    // nekretnine.style.display = 'none';
    // addNekretnina.style.display = 'block';

    // NekretninaItem.render(nekretninaData);
    document.getElementById("dodaj-btn")
            .addEventListener("click", function() {
                pretraga.style.display = 'none';
                nekretnine.style.display = 'none';
                addNekretnina.style.display = 'block';
                window.scrollTo(0, 0)
            });
    document.getElementById("nazad-btn")
            .addEventListener("click", function() {
                pretraga.style.display = 'block';
                nekretnine.style.display = 'block';
                addNekretnina.style.display = 'none';
                window.scrollTo(0, 0)
            });

    //Dodavanje i rad sa nekretnima
    NekretninaPage.render();


    // document.getElementById("add-nekretnina-btn")
    //         .addEventListener("click", function() {
    //             NekretninaPage.getData();
    //         });

    // document.getElementById("reset-nekretnina-btn")
    //         .addEventListener("click", function() {
    //             NekretninaPage.reset();
    //             // NekretninaPage.update();
    //         });
});