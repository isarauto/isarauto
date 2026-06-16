/* ===== Shared data for Isar Auto Location ===== */
window.PHONE = "212616070870";
window.PHONE_DISPLAY = "+212 616 070 870";

/* ---- Google Maps -------------------------------------------------------
   Paste your Google Maps Embed API key between the quotes below.
   Get one at: https://console.cloud.google.com/  (enable "Maps Embed API")
   While it's empty, the site falls back to the keyless embed automatically. */
window.MAPS_API_KEY = "";
window.MAPS_PLACE   = "Q45W+H6W, Tanger";   // agency location (plus code)
window.MAPS_COORDS  = "35.758938,-5.854562";
window.MAPS_LINK    = "https://www.google.com/maps?q=" + encodeURIComponent("Q45W+H6W, Tanger");
window.MAPS_EMBED   = window.MAPS_API_KEY
  ? `https://www.google.com/maps/embed/v1/place?key=${window.MAPS_API_KEY}&q=${encodeURIComponent(window.MAPS_PLACE)}&zoom=14`
  : `https://maps.google.com/maps?q=${encodeURIComponent(window.MAPS_PLACE)}&z=14&hl=fr&output=embed`;

/* 7 cars. Six are Automatique / Essence. The BLUE Peugeot 208 is Manuelle / Diesel. */
window.CARS = [
  { slug:"peugeot-208-grey",  model:"Peugeot 208", line:"208", color:{fr:"Gris",ar:"رمادي",en:"Grey",de:"Grau",es:"Gris",nl:"Grijs"},  hex:"#8A8E92", trans:"auto", fuel:"essence", seats:5, doors:4, price:350 },
  { slug:"peugeot-208-blue",  model:"Peugeot 208", line:"208", color:{fr:"Bleu",ar:"أزرق",en:"Blue",de:"Blau",es:"Azul",nl:"Blauw"},   hex:"#2b5e9e", trans:"manual", fuel:"diesel", seats:5, doors:4, price:350 },
  { slug:"peugeot-208-black", model:"Peugeot 208", line:"208", color:{fr:"Noir",ar:"أسود",en:"Black",de:"Schwarz",es:"Negro",nl:"Zwart"}, hex:"#15151a", trans:"auto", fuel:"essence", seats:5, doors:4, price:350 },
  { slug:"renault-clio-grey", model:"Renault Clio", line:"Clio", color:{fr:"Gris",ar:"رمادي",en:"Grey",de:"Grau",es:"Gris",nl:"Grijs"},  hex:"#8A8E92", trans:"auto", fuel:"essence", seats:5, doors:4, price:350 },
  { slug:"renault-clio-white",model:"Renault Clio", line:"Clio", color:{fr:"Blanc",ar:"أبيض",en:"White",de:"Weiß",es:"Blanco",nl:"Wit"},  hex:"#ECEAE4", trans:"auto", fuel:"essence", seats:5, doors:4, price:350 },
  { slug:"dacia-logan-grey",  model:"Dacia Logan", line:"Logan", color:{fr:"Gris",ar:"رمادي",en:"Grey",de:"Grau",es:"Gris",nl:"Grijs"},  hex:"#8A8E92", trans:"auto", fuel:"essence", seats:5, doors:4, price:300 },
  { slug:"dacia-logan-black", model:"Dacia Logan", line:"Logan", color:{fr:"Noir",ar:"أسود",en:"Black",de:"Schwarz",es:"Negro",nl:"Zwart"}, hex:"#15151a", trans:"auto", fuel:"essence", seats:5, doors:4, price:300 },
];

window.carName = (c, lang) => `${c.model} · ${(c.color[lang]||c.color.fr)}`;
window.waLink = (text) => `https://wa.me/${window.PHONE}?text=${encodeURIComponent(text)}`;
