import "./style.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const gallery = document.querySelector("#gallery");
const loadMoreBtn = document.querySelector("#loadmore-btn");

const modal = document.querySelector("#modal");
const modalImage = document.querySelector("#modal-image");
const modalClose = document.querySelector("#modal-close");

const API_KEY = "50255605-43c5fe21985c67b1fcb87f4a7";
let page = 1;
let query = "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  query = input.value.trim();
  page = 1;
  gallery.innerHTML = "";

  if (!query) {
    showToast("error", "Ошибка", "Пожалуйста введите текст для поиска!");
    return;
  }

  await fetchImages();
});

loadMoreBtn.addEventListener("click", fetchImages);

async function fetchImages() {
  const url = `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=15`;

  try {
    const res = await fetch(url);
    const { hits } = await res.json();

    if (hits.length === 0 && page === 1) {
      showToast(
        "info",
        "Нет результатов",
        "Извините, ничего не найдено. Попробуйте снова!"
      );
      return;
    }

    renderImages(hits);
    page++;
  } catch (err) {
    console.error("Ошибка загрузки:", err);
    showToast("error", "Ошибка", "Не удалось загрузить изображения.");
  }
}

function renderImages(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <li class="gallery-item">
      <img src="${webformatURL}" data-large="${largeImageURL}" alt="${tags}" class="gallery-image" />
          <div class="info">
            ${renderInfo("Likes", likes)}
            ${renderInfo("Views", views)}
            ${renderInfo("Comments", comments)}
            ${renderInfo("Downloads", downloads)}
          </div>
        </li>`
    )
    .join("");

  gallery.insertAdjacentHTML("beforeend", markup);
}

function renderInfo(label, value) {
  return `
    <div class="info-block">
      <p>${label}</p>
      <p>${value}</p>
    </div>`;
}

function showToast(type, title, message) {
  iziToast[type]({
    title,
    message,
  });
}

gallery.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("gallery-image")) {
    modalImage.src = target.dataset.large || target.src;
    modalImage.alt = target.alt;
    modal.classList.remove("hidden");
  }
});

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  modalImage.src = "";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modalImage.src = "";
  }
});
