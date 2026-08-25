let classData = [];

fetch("database.json")
  .then((response) => response.json())
  .then((data) => {
    classData = data;
    renderClasses(classData);
  });

const classGrid = document.getElementById("classGrid");
const searchInput = document.getElementById("searchInput");

function renderClasses(data) {
  classGrid.innerHTML = "";
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <div class="card-actions">
                <button class="btn btn-live" onclick="openLiveEditor(${item.id})">
                    <i class="fas fa-play"></i> Live Code
                </button>
                <a href="${item.downloadLink}" class="btn btn-dl" download>
                    <i class="fas fa-download"></i> Source
                </a>
            </div>
        `;

    // 3D Tilt Effect Logic
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = `transform 0.5s ease`;
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = `none`; // Remove transition during movement for smoothness
    });

    classGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = classData.filter(
    (item) =>
      item.title.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term),
  );
  renderClasses(filtered);
});

// Live Editor Logic
const modal = document.getElementById("editorModal");
const [htmlEditor, cssEditor, jsEditor] = [
  document.getElementById("htmlEditor"),
  document.getElementById("cssEditor"),
  document.getElementById("jsEditor"),
];
const livePreview = document.getElementById("livePreview");

window.openLiveEditor = function (id) {
  const item = classData.find((d) => d.id === id);
  if (!item) return;
  htmlEditor.value = item.htmlCode;
  cssEditor.value = item.cssCode;
  jsEditor.value = item.jsCode;
  updatePreview();
  modal.style.display = "block";
};

function updatePreview() {
  const html = htmlEditor.value;
  const css = `<style>${cssEditor.value}</style>`;
  const js = `<script>${jsEditor.value}<\/script>`;
  const iframeDoc =
    livePreview.contentDocument || livePreview.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write(html + css + js);
  iframeDoc.close();
}

[htmlEditor, cssEditor, jsEditor].forEach((editor) =>
  editor.addEventListener("keyup", updatePreview),
);
document
  .getElementById("closeModal")
  .addEventListener("click", () => (modal.style.display = "none"));

const fullScreenBtn = document.getElementById("fullScreenBtn");
const modalContent = document.getElementById("modalContent");
fullScreenBtn.addEventListener("click", () => {
  modalContent.classList.toggle("fullscreen-mode");
  fullScreenBtn.innerHTML = modalContent.classList.contains("fullscreen-mode")
    ? '<i class="fas fa-compress"></i> Exit Fullscreen'
    : '<i class="fas fa-expand"></i> Fullscreen';
});
