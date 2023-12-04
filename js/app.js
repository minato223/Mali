let allProject = document.querySelectorAll(".project");
let nextBtn = document.querySelector(".navigation-next");
let prevBtn = document.querySelector(".navigation-prev");
let counterContainer = document.querySelector(".counter");
let currentIndex = 0;
const timeout = 200;

//Functions
function getTranslateX(project, index, multiplier = 0) {
  return `${project.clientWidth * 1.1 * (index + multiplier)}px`;
}
function translateProjectX(
  project,
  index,
  multiplier,
  key = "--project-translateX"
) {
  project.style.setProperty(key, getTranslateX(project, index, multiplier));
}
function updateSlider() {
  document.documentElement.style.setProperty(
    "--slider-ratio",
    currentIndex / allProject.length
  );
  counterContainer.querySelectorAll("span").forEach((span, index) => {
    let width = span.clientWidth;
    let translateX = width * index - width * currentIndex;
    span.style.transform = `translate3d(${translateX}px, 0, 0)`;
  });
}
function setupAnimation() {
  allProject.forEach((project, index) => {
    translateProjectX(project, index);
    project.style.setProperty("--project-left", `50%`);
    let span = document.createElement("span");
    span.innerHTML = String(index + 1).padStart(2, "0");
    counterContainer.appendChild(span);
    translateProjectX(span, index, 0, "--counter-translateX");
  });
  setTimeout(() => {
    counterContainer.classList.add("visible");
  }, timeout * 5);
}
function goNext() {
  let inactiveProjects = document.querySelectorAll(".project:not(.active)");
  if (inactiveProjects.length > 0) {
    currentIndex++;
  }
  let currentProject = inactiveProjects[0];
  let content = currentProject?.querySelector(".content");
  content?.classList.add("hide");
  setTimeout(() => {
    currentProject?.classList.add("active");
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < content.children.length; index++) {
      let span = document.createElement("span");
      span.classList.add("slideAnimation");
      span.innerHTML = content.children[index].outerHTML;
      fragment.appendChild(span);
    }
    content.innerHTML = "";
    content.append(fragment);
    content?.classList.add("display");
    setTimeout(() => {
      content.querySelectorAll(".slideAnimation").forEach((element, index) => {
        element.querySelectorAll(".hiddable").forEach((el, ind) => {
          el.classList.add("visible");
        });
        element.classList.add("reveal");
      });
    }, timeout * 3.5);
    document
      .querySelectorAll(".project:not(.active)")
      .forEach((project, index) => {
        translateProjectX(project, index);
      });
    let activeProjects = document.querySelectorAll(".project.active");
    let latestActiveProject = activeProjects[activeProjects.length - 2];
    latestActiveProject?.classList.add("fade-out");
    updateSlider();
    setTimeout(() => {
      latestActiveProject?.classList.remove("fade-out");
    }, timeout * 5);
  }, timeout);
}
function goPrev() {
  if (currentIndex <= 0) {
    return;
  }
  currentIndex--;
  document
    .querySelectorAll(".project:not(.active)")
    .forEach((project, index) => {
      translateProjectX(project, index, 1);
    });
  let activeProjects = document.querySelectorAll(".project.active");
  let currentProject = activeProjects[activeProjects.length - 1];
  let content = currentProject?.querySelector(".content");
  content.querySelectorAll(".slideAnimation").forEach((element) => {
    element.classList.remove("reveal");
    setTimeout(() => {
      let child = element.firstElementChild;
      element.parentElement.appendChild(child);
      element.remove();
    }, timeout);
  });
  updateSlider();
  setTimeout(() => {
    content.style.opacity = "0";
    content.classList.remove("display");
    content.querySelectorAll(".hiddable").forEach((el, ind) => {
      el.classList.remove("visible");
    });
    currentProject?.classList.remove("active");
    setTimeout(() => {
      content.style.opacity = "1";
      setTimeout(() => {
        currentProject?.querySelector(".content").classList.remove("hide");
      }, timeout);
    }, timeout * 3.5);
  }, timeout);
}
// Call functions
setupAnimation();
window.addEventListener(
  "resize",
  (e) => {
    // Azy trop la flemme ...Osef
    document.location.reload();
  },
  true
);
nextBtn.addEventListener("click", goNext);
prevBtn.addEventListener("click", goPrev);
document.addEventListener("keydown", (event) => {
  const { key } = event;
  if (key === "ArrowLeft") {
    goPrev();
  }
  if (key === "ArrowRight") {
    goNext();
  }
});
document.querySelector(".burger").addEventListener("click", () => {
  document.querySelector(".navigation").classList.toggle("active");
});
