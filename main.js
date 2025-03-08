import { TextEditor } from "./js/text-editor.js"
import { PhotoUploader } from "./js/photo-uploader.js"
import { Modal } from "./js/modal.js"
import { Utility } from "./js/utils.js";
// import { Data } from "./data.js";
import { View } from "./view.js";
import Nekretnina from "./js/nekretnina.js";

document.addEventListener("DOMContentLoaded", () => {
    // TextEditor.init();
    // PhotoUploader.init();
    // Modal.image();

    // console.log(Data);
    // Utility.setSelects();
    View.renderTagsAdd();
    // document.getElementById("add-nekretnina-btn")
    //         .addEventListener("click", function() {
    //             let nekretnina = new Nekretnina(
    //                 Utility.getNekretnina("#add-nekretnina .filter-child"),
    //                 Utility.getVlasnik("#add-vlasnik .filter-child"),
    //                 Utility.getTagovi(),
    //                 Utility.getOpis(),
    //                 Utility.getSlike()
    //             );
    //             console.log(nekretnina);
    //         });

    // document.getElementById("reset-nekretnina-btn")
    //         .addEventListener("click", function() {
    //             Utility.resetNekretnina()
    //         });

});