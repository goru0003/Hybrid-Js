const cacheName = "myCache";

window.addEventListener("DOMContentLoaded", () => {
  fetchImageList()
    .then((imageUrls) => {
      imageUrls.forEach((url) => {
        getImage(url)
          .then((imageBlob) => displayImage(imageBlob))
          .catch((err) => console.error("Error", err));
      });
    })
    .catch((err) => console.error(err));
});
function displayImage(imageBlob) {
  //display images
  const imageObjectURL = URL.createObjectURL(imageBlob);
  const imgElement = document.createElement("img");
  imgElement.src = imageObjectURL;
  document.getElementById("main").appendChild(imgElement);
}

async function fetchImageList() {
  // fetch images
  try {
    const response = await fetch(
      "https://picsum.photos/v2/list?page=2&limit=100"
    );
    if (!response.ok) {
      throw new Error("failed");
    }
    const data = await response.json();
    return data.map((image) => `https://picsum.photos/id/${image.id}/200/300`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchAndCacheImage(url) {
  // save images to the cache
  try {
    const cache = await caches.open(cacheName);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("error");
    }

    const clonedResponse = response.clone();
    cache.put(url, clonedResponse);
  } catch (error) {
    console.error("error", error);
    throw error;
  }
}

async function getImage(url) {
  //get image from cache
  try {
    const cache = await caches.open(cacheName);
    await fetchAndCacheImage(url);
    const newResponse = await cache.match(url);
    return newResponse.blob();
  } catch (error) {
    console.error("error when save picture", error);
    throw error;
  }
}
