import { NekretninaPage } from "./view.js";

document.addEventListener("DOMContentLoaded", () => {
    NekretninaPage.render();
    document.getElementById("add-nekretnina-btn")
            .addEventListener("click", function() {
                NekretninaPage.getData();
            });

    document.getElementById("reset-nekretnina-btn")
            .addEventListener("click", function() {
                NekretninaPage.reset();
                // NekretninaPage.update();
            });
});