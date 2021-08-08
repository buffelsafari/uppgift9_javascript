"use strict";

window.addEventListener("load", (event)=>
{   
    new ShoppingListHandler();
});

// minimalt med global nedsmutsning
// verkar fungera hyffsat, men på mobila enheter är det nästan omöjligt att ändra storleken på listorna(drag i hörnet),
// dessutom fungerar drag funktionen inte så bra när skärmen insisterar på att scrolla.
