const $form = document.querySelector("#form-search");
const $sectionProblem = document.querySelector("#section-problem");
const $main = document.querySelector(".main");
const $header = document.querySelector(".header");
const $progress = document.querySelector("#scroll");
let totalProblem = [];

class Problem {
  constructor(problem) {
    this.title = problem.title;
    this.id = problem.id;
    this.level = problem.level;
    this.partTitle = problem.partTitle;
  }

  draw() {
    const ul = document.createElement("ul");
    const li_title = document.createElement("li");
    const a = document.createElement("a");
    const h2 = document.createElement("h2");
    const li_level = document.createElement("li");
    const span_level = document.createElement("li");
    const li_partTitle = document.createElement("li");
    const span_partTitle = document.createElement("li");
    ul.classList.add("list-problem");
    h2.textContent = this.title;
    a.setAttribute("href", `https://school.programmers.co.kr/learn/courses/30/lessons/${this.id}`);
    a.setAttribute("target", "_blank");
    span_level.textContent = `Level : ${this.level}`;
    span_partTitle.textContent = this.partTitle;
    a.append(h2);
    li_title.append(a);
    li_level.append(span_level);
    li_partTitle.append(span_partTitle);
    ul.append(li_title, li_level, li_partTitle);
    return ul;
  }
}

async function getData() {
  try {
    const data = await fetch(
      "https://school.programmers.co.kr/api/v1/school/challenges/?page=1&perPage=20&levels[]=0&levels[]=1&levels[]=2&levels[]=3&levels[]=4&levels[]=5&languages[]=javascript&order=acceptance_desc"
    );
    const { result: problemList, totalPages } = await data.json();
    for (let i = 2; i < totalPages; i++) {
      let page = await fetch(
        `https://school.programmers.co.kr/api/v1/school/challenges/?page=${i}&perPage=20&levels[]=0&levels[]=1&levels[]=2&levels[]=3&levels[]=4&levels[]=5&languages[]=javascript&order=acceptance_desc`
      );
      const { result } = await page.json();
      problemList.push(...result);
    }
    const $frag = new DocumentFragment();
    problemList.forEach((problem) => {
      $frag.append(new Problem(problem).draw());
    });
    totalProblem = [...problemList];
    $sectionProblem.append($frag);
  } catch (error) {
    console.log(error);
  }
}

function search(event) {
  event.preventDefault();
  const $input = $form.querySelector("input");
  const $frag = new DocumentFragment();
  const re = new RegExp($input.value);
  const searched = totalProblem.filter((problem) => re.test(problem.title));

  searched.forEach((problem) => {
    $frag.append(new Problem(problem).draw());
  });

  $sectionProblem.innerHTML = "";
  $sectionProblem.append($frag);
}

function changeProgress() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  $progress.value = scrolled;
}

function init() {
  getData();
  let debouncer;
  $form.addEventListener("submit", search);

  window.addEventListener("scroll", () => {
    if (debouncer) {
      clearTimeout(debouncer);
    }
    debouncer = setTimeout(() => {
      changeProgress();
    }, 50);
  });
}

init();
