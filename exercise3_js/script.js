
//Letar upp element
let header = document.querySelector('h2');
let subheader = document.querySelector('h3');
let imageContainer = document.querySelector('#imagecontainer');
let image = document.querySelector('#imagecontainer img');
let selectionDiv = document.querySelector('#selection');
let galleryDiv = document.querySelector('#allpictures');

// --------------Funktion som hanterar rubrikerna ------------------------------
function setHeaderAndSubHeader() {
  let hash = window.location.hash;

  //Kod för index-sidan
  if(hash === ''){
    header.textContent = 'Random dog';
    header.style.textTransform = 'none';
  }
  //Kod för subbreed-sidan
  else if(hash.includes('_')) {
    let hashArray = hash.split('_'); //Splittar strängen
    let breed = hashArray[0].substring(1);
    header.textContent = breed;
    header.style.textTransform = 'capitalize';
    let subbreed = hashArray[1];
    subheader.textContent = subbreed;
    subheader.style.textTransform = 'capitalize';

  }
  //Kod för breed-sidan
  else {
    header.textContent = hash.substring(1);
    header.style.textTransform = 'capitalize';

    //Om det finns en underrubrik, ta bort den
    if(subheader.textContent !== '') {
      subheader.textContent = '';
    }
  }
}

// ------------- Funktion som kallar på showRandomImage, showRandomImageByBreed eller showRandomImageBySubBreed ------------------
function setRandomImage(){
  //Skapar variabler
  let hash = window.location.hash;
  let hashArray;
  let breed;
  let subbreed;

  //Kod för index-sidan
  if(hash === ''){
    showRandomImage();
  }
  //Kod för subbreed-sidan
  else if(hash.includes('_')) {
    hashArray = hash.split('_');
    breed = hashArray[0].substring(1);
    subbreed = hashArray[1];
    showRandomImageBySubBreed(breed, subbreed);
  }
  //Kod för breed-sidan
  else {
    breed = hash.substring(1);
    showRandomImageByBreed(breed);
  }
}

// ------------- Funktion som visar en slumpad bild (alla raser) ------------------
function showRandomImage() {
  //GET request
  let request = new XMLHttpRequest();
  request.addEventListener('load', function() {
    return new Promise((resolve, reject) => {
      if(this.status >= 200 && this.status < 300) {
        resolve(this.responseText);
      }
    })
    .then(parseJSON)
    .then(function(object){
      image.setAttribute('src', object.message);
    })
  });
  request.open('GET', 'https://dog.ceo/api/breeds/image/random');
  request.send();
}

// ------------- Funktion som visar en slumpad bild av en viss ras ------------------
function showRandomImageByBreed(breed) {
  let urlString;

  //GET request
  let request = new XMLHttpRequest();
  request.addEventListener('load', function() {
    return new Promise((resolve, reject) => {
      if(this.status >= 200 && this.status < 300) {
        resolve(this.responseText);
      }
    })
    .then(parseJSON)
    .then(function(object){
      image.setAttribute('src', object.message);
    })
  });
  request.open('GET', 'https://dog.ceo/api/breed/' + breed + '/images/random');
  request.send();
}

//---------------Funktion som visar en slumpad bild av en viss underras ------------
function showRandomImageBySubBreed(breed, subbreed) {
  let urlString;

  //GET request
  let request = new XMLHttpRequest();
  request.addEventListener('load', function() {
    new Promise((resolve, reject) => {
      if(this.status >= 200 && this.status < 300) {
        resolve(this.responseText);
      }
    })
    .then(parseJSON)
    .then(function(object){
      image.setAttribute('src', object.message);
    })
  });
  urlString = 'https://dog.ceo/api/breed/' + breed + '/' + subbreed + '/images/random';
  request.open('GET', urlString);
  request.send();
}

// ------------- Funktion som parsar JSON ------------------
function parseJSON(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
    return parsed;
  }
  catch {
    console.error('Invalid JSON string.');
  }
}

//---------------Funktion som hanterar refresh-knappen och eventlyssnaren på denna -----
function setRefreshButton() {
  //Letar upp hashtag
  let hash = window.location.hash;

  //Letar upp refresh-knappen
  let refreshButton = document.querySelector('#refreshbutton');

  //Skapar variabler
  let hashArray;
  let breed;
  let subbreed;
  let newRefreshButton;

  // -- << Kod för index-sidan >> --
  if(hash === ''){
    //Om det inte finns någon refresh-knapp, så skapa en och lägg till eventlyssnare
    if(refreshButton === null){
      //Skapar knappen
      createRefreshButton();

      //Letar upp knappen och lägger till eventlyssnare
      refreshButton = document.querySelector('#refreshbutton');
      refreshButton.addEventListener('click', showRandomImage);
    }
    //Om det redan finns en knapp, klona den (för att få bort tidigare eventlyssnare)
    else {
      //Klonar knappen
      newRefreshButton = refreshButton.cloneNode(true);
      imageContainer.replaceChild(newRefreshButton, refreshButton);

      //Lägger till eventlyssnare
      newRefreshButton.addEventListener('click', showRandomImage);
    }
  }
  // -- << Kod för subbreed-sidan >> --
  else if(hash.includes('_')){
    //Om det inte finns någon refresh-knapp, så skapa en
    if(refreshButton === null){
      //Skapar knapp
      createRefreshButton();

      //Letar upp knappen och lägger till eventlyssnare
      refreshButton = document.querySelector('#refreshbutton');
      refreshButton.addEventListener('click', function(){
        hashArray = hash.split('_'); //Splittar strängen
        breed = hashArray[0].substring(1); //Breed är första delen av strängen, utan hashtag
        subbreed = hashArray[1]; //Subbreed är andra delen av strängen
        showRandomImageBySubBreed(breed, subbreed); //Skickar in breed och subbreed i showRandomImageBySubBreed
      });
    }
    //Om det redan finns en knapp, klona den (för att få bort tidigare eventlyssnare)
    else {
      //Klonar knappen
      newRefreshButton = refreshButton.cloneNode(true);
      imageContainer.replaceChild(newRefreshButton, refreshButton);

      //Lägger till eventlyssnare
      newRefreshButton.addEventListener('click', function(){
        hashArray = hash.split('_'); //Splittar strängen
        breed = hashArray[0].substring(1); //Breed är första delen av strängen, utan hashtag
        subbreed = hashArray[1]; //Subbreed är andra delen av strängen
        showRandomImageBySubBreed(breed, subbreed); //Skickar in breed och subbreed i showRandomImageBySubBreed
      });
    }
  }
  // -- << Kod för breed-sidan >> --
  else {
    //Om det inte finns någon refresh-knapp, så skapa en ny
    if(refreshButton === null){
      //Skapar en refresh-knapp
      createRefreshButton();

      //Letar upp knappen och lägger till eventlyssnare
      refreshButton = document.querySelector('#refreshbutton');
      refreshButton.addEventListener('click', function(){
        breed = hash.substring(1); //Tar bort hashtag
        showRandomImageByBreed(breed);
      });
    }
    //Om det redan finns en knapp, klona den (för att få bort tidigare eventlyssnare)
    else {
      //Klonar knappen
      newRefreshButton = refreshButton.cloneNode(true);
      imageContainer.replaceChild(newRefreshButton, refreshButton);

      //Lägger till eventlyssnare
      newRefreshButton.addEventListener('click', function(){
        breed = hash.substring(1); //Tar bort hashtag
        showRandomImageByBreed(breed);
      });
    }
  }
}

// -------------------Funktion som skapar en refresh-knapp-----------------------
function createRefreshButton() {
  let refreshButton = document.createElement('button');
  refreshButton.id = 'refreshbutton';
  refreshButton.textContent = 'New picture';
  imageContainer.appendChild(refreshButton);
}

//------------- Funktion som hanterar tillbaka-knappen och eventlyssnaren på den -----
function setGoBackButton() {
  //Letar upp hashtag
  let hash = window.location.hash;

 //Skapar variabler
  let hashArray;
  let breed;
  let subbreed;

  //Letar upp tillbaka-knappen, om det finns någon
  let goBackButton = document.querySelector('#gobackbutton');

  // -- << Kod för index-sidan >> --
  //Tar bort tillbaka-knappen om det finns någon
  if(hash === ''){
    if(goBackButton){
      imageContainer.removeChild(goBackButton);
    }
  }
  // -- << Kod för subbreed-sidan >> --
  else if(hash.includes('_')){
      hashArray = hash.split('_'); //Splittar strängen
      breed = hashArray[0].substring(1); //Breed är första delen av strängen, utan hashtag

      //Skapar en tillbaka-knapp om det inte finns någon
      if(goBackButton === null) {
        goBackButton = document.createElement('button');
        goBackButton.textContent = 'Back';
        goBackButton.id = 'gobackbutton';
        imageContainer.appendChild(goBackButton);
      }

      //Tar bort eventlyssnaren som leder till indexsidan
      goBackButton.removeEventListener('click', onClickGoToIndexPage);

      //Lyssnar på knappen
      goBackButton.addEventListener('click', onClickGoToBreed);
  }
  // -- << Kod för breed-sidan >> --
  else {
    //Skapar en tillbaka-knapp om det inte finns någon
    if(goBackButton === null) {
      goBackButton = document.createElement('button');
      goBackButton.textContent = 'Back';
      goBackButton.id = 'gobackbutton';
      imageContainer.appendChild(goBackButton);
    }

    //Tar bort eventlyssnaren som leder till breed-sidan
    goBackButton.removeEventListener('click', onClickGoToBreed);

    //Lyssnar på knappen
    goBackButton.addEventListener('click', onClickGoToIndexPage);
  }
}

// ------------------- Funktion som skapar en lista med raser eller underraser ------------
//                    < Om det redan finns en lista så tar den bort den först >
function renderList() {

  //Skapar variabler
  let hash = window.location.hash;
  let urlString;

  //Tömmer listan
  while(selectionDiv.firstChild){
    selectionDiv.removeChild(selectionDiv.firstChild);
  }

  //Ändrar urlString, beroende på vilken sida man befinner sig på
  // -- << Kod för indexsidan >> --
  if(hash === ''){
    urlString = 'https://dog.ceo/api/breeds/list/all';
  }
  // -- << Kod för subbreed-sidan >> --
  //Subbreed-sidan ska inte ha någon lista - går ur funktionen
  else if(hash.includes('_')){
    return;
  }
  // -- << Kod för breed-sidan >> --
  else {
    urlString = 'https://dog.ceo/api/breed/' + hash.slice(1) + '/list';
  }

  //Gör GET-anrop
  let request = new XMLHttpRequest();
  request.addEventListener('load', function() {
    return new Promise((resolve, reject) => {
      if(this.status >= 200 && this.status < 300) {
        resolve(this.responseText);
      }
    })
    .then(parseJSON)
    .then(function(object){
      let breedObject;
      let subbreedArray;
      let link;
      //Skapar en ny a-tagg för varje ras/underras, samt lägger till en eventlyssnare
      // -- << Kod för index-sidan >> --
      //Använder en for-in-loop, eftersom raserna ligger i ett objekt
      if(hash === ''){
        breedObject = object.message;
        for(let key in breedObject) {
          link = document.createElement('a');
          link.textContent = key;
          link.style.textTransform = 'capitalize';
          link.addEventListener('click', function(e){
            let breed = e.target.textContent;
            goToBreed(breed);
          });
          selectionDiv.appendChild(link);
        }
        //Stylar kolumnerna med raser
        selectionDiv.style.alignContent = 'normal';
      }
      // -- << Kod för breed-sidan >> --
      //Använder en for-of-loop, eftersom underraserna ligger i en array
      else {
        subbreedArray = object.message;
        for(let subbreed of subbreedArray) {
          link = document.createElement('a');
          link.textContent = subbreed;
          link.style.textTransform = 'capitalize';
          link.addEventListener('click', onClickGoToSubBreed);
          selectionDiv.appendChild(link);
        }
        //Stylar kolumnerna med raser
        selectionDiv.style.alignContent = 'center';
      }
    })
  });
  request.open('GET', urlString);
  request.send();
}

// ------------------- Funktion som hanterar bildgalleriet ------------
function setPictureGallery() {
    //Letar upp hashtag
    let hash = window.location.hash;

   //Skapar variabler
    let hashArray;
    let breed;
    let subbreed;

    //Alla bilder i gallery div rensas bort
    while(galleryDiv.firstChild){
      galleryDiv.removeChild(galleryDiv.firstChild);
    }

    // -- << Kod för index-sidan >> --
    if(hash === ''){
      return;
    }
    // -- << Kod för subbreed-sidan >> --
    //Kallar på showAllPictures med två argument
    else if(hash.includes('_')){
      hashArray = hash.split('_'); //Splittar strängen
      breed = hashArray[0].substring(1); //Breed är första delen av strängen, utan hashtag
      subbreed = hashArray[1]; //Subbreed är andra delen av strängen
      showAllPictures(breed, subbreed);
    }
    // -- << Kod för breed-sidan >> --
    //Kallar på showAllPictures med ett argument
    else {
      breed = hash.substring(1); //Tar bort hashtag
      showAllPictures(breed);
    }
}

// ------------------- Funktion som lägger till bilder i bildgalleriet ------------
//                   << Visar alla bilder av underrasen om man skickar in argumenten breed+subbreed  >>
//                   << Visar alla bilder av rasen om man bara skickar in argumentet breed >>
function showAllPictures(breed, subbreed) {
  let urlString;

  //Ändrar urlString beroende på om det är bilder på en ras eller en underras som ska visas
  if(subbreed === undefined){
    urlString = 'https://dog.ceo/api/breed/' + breed + '/images';
  }
  else{
    urlString = 'https://dog.ceo/api/breed/' + breed + '/' + subbreed + '/images';
  }

  //Gör GET-anrop
  let request = new XMLHttpRequest();
  request.addEventListener('load', function() {
    return new Promise((resolve, reject) => {
      if(this.status >= 200 && this.status < 300) {
        resolve(this.responseText);
      }
    })
    .then(parseJSON)
    .then(function(object){
      let imageArray = object.message;
      let image;

      //Loopar igenom array:n och skapar en ny img för varje värde
      for(let imageUrl of imageArray) {
        image = document.createElement('img');
        image.setAttribute('src', imageUrl);
        galleryDiv.appendChild(image);
      }
    })
  });
  request.open('GET', urlString);
  request.send();
}

//----------------Funktion som dirigerar användaren till index-sidan ---------
//                 < Ändrar hashtaggen och uppdaterar sedan innehållet >
function onClickGoToIndexPage(e){
  //Ändrar hashtag
  window.location.hash = '';

  //Setting header
  setHeaderAndSubHeader();

  //Setting random image
  setRandomImage();

  //Setting event listener for refresh button
  setRefreshButton();

  //Setting go-back-button
  setGoBackButton();

  //Rendering list with breeds or sub-breeds
  renderList();

  //Setting picture gallery
  setPictureGallery();
}

//--------------- Funktion som kallar på goToBreed ---------------------------
//               < Används när man går tillbaka från subbreed-sidan >
//               < Behöver kunna tas bort från eventlyssnaren och ligger därför i en separat funktion >
function onClickGoToBreed(){
  let breed = header.textContent;
  goToBreed(breed);
}

//----------------Funktion som dirigerar användaren till rätt undersida med raser ---------
//                 < Ändrar hashtaggen och uppdaterar sedan innehållet >
function goToBreed(breed) {
  //Ändrar hashtag
  window.location.hash = '#' + breed;

  //Uppdaterar header
  setHeaderAndSubHeader();

  //Uppdaterar random image
  setRandomImage();

  //Uppdaterar refresh-knappen
  setRefreshButton();

  //Uppdaterar tillbaka-knappen
  setGoBackButton();

  //Uppdaterar listan
  renderList();

  //Uppdaterar bildgalleriet
  setPictureGallery();
}

//----------------Funktion som dirigerar användaren till rätt undersida med underraser ---------
//                 < Ändrar hashtaggen och uppdaterar sedan innehållet >
function onClickGoToSubBreed(e) {
  //Subbreed är texten i listan som man klickade på
  let subbreed = e.target.textContent;

  //Breed är texten i h2
  let breed = header.textContent;

  //Ändrar hashtag
  window.location.hash = '#' + breed + '_' + subbreed;

  //Uppdaterar header
  setHeaderAndSubHeader();

  //Uppdaterar random image
  setRandomImage();

  //Uppdaterar refresh-knappen
  setRefreshButton();

  //Uppdaterar tillbaka-knappen
  setGoBackButton();

  //Uppdaterar listan
  renderList();

  //Uppdaterar bildgalleriet
  setPictureGallery();
}

//Tar fram headers
setHeaderAndSubHeader();

//Tar fram bilden
setRandomImage();

//Tar fram refresh-knappen
setRefreshButton();

//Skapar tillbaka-knappen (om den ska finnas)
setGoBackButton();

//Skapar listan
renderList();

//Tar fram alla bilder i bildgalleriet
setPictureGallery();
