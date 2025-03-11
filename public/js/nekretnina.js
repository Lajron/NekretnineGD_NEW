class Nekretnina {
    constructor(n = {}, v = {}, t = {}, o = "", s = [], id = "") {
        this.id = id; 
        this.nekretnina = n;
        this.vlasnik = v;
        this.tagovi = t;
        this.opis = o;
        this.slike = s;
    }
}

export default Nekretnina;

