
class Nekretnina {
    constructor(n = {}, v = {}, t = {}, o = "", s = [], id = "") {
        this.id = id; 
        this.nekretnina = n;
        this.vlasnik = v;
        this.tagovi = t;
        this.opis = o;
        this.slike = s;

        delete this.nekretnina.id;
    }

    addNekretnina() {}

    addVlasnik() {}

    addTagovi() {}

    addOpis() {}

    addSlike() {}

    display() {}
}

export default Nekretnina;

