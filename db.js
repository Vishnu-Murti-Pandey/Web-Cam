// Steps & Flow to follow ->
// Open database
// Create objectStore
// Make transactions

let db;
let openRequest = indexedDB.open("myDatabase");

openRequest.addEventListener("success", (e) => {
    // db success
    db = openRequest.result;
});
openRequest.addEventListener("error", (e) => {
    // db error
    db = openRequest.result;
});
openRequest.addEventListener("upgradeneeded", (e) => {
    // triggers if the client had no database also performs initialization
    db = openRequest.result;

    db.createObjectStore("video", { keyPath: "id" });
    db.createObjectStore("image", { keyPath: "id" });

});