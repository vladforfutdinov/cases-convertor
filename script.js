{
  const transforms = [
    {
      title: 'camel case',
      fn: (arr) =>
        arr.map((item, i) => (i === 0 ? item : capitalize(item))).join(''),
    },
    {
      title: 'kebab case',
      fn: (arr) => arr.join('-'),
    },
    {
      title: 'pascal case',
      fn: (arr) => arr.map((item, i) => capitalize(item)).join(''),
    },
    {
      title: 'constant case',
      fn: (arr) => arr.map((item, i) => item.toUpperCase()).join('_'),
    },
    {
      title: 'snake case',
      fn: (arr) => arr.join('_'),
    },
    {
      title: 'dot case',
      fn: (arr) => arr.join('.'),
    },
  ];

  const form = document.querySelector('#form');
  form.addEventListener('keyup', renderResults);
  form.addEventListener('change', renderResults);

  const filters = form.querySelector('.each');
  filters.innerHTML = getFiltersHTML(transforms);

  const allCheckbox = form.querySelector('[name=all]');
  allCheckbox.addEventListener('change', allCheckboxHandler);

  const eachContainer = form.querySelector('.each');
  eachContainer.addEventListener('change', checkAll);

  const outputEl = document.querySelector('#output');
  outputEl.addEventListener('click', copyToClipboard);

  function checkAll() {
    const data = getState();

    const allCheckbox = form.querySelector('[name=all]');
    allCheckbox.checked = transforms.every(({ title }) => !!data[title]);
  }

  function getFiltersHTML(data) {
    const { all } = getState();

    return data
      .map(
        (item) =>
          `<label><input type="checkbox" name="${item.title}" ${
            all && 'checked'
          }/>${item.fn.call(null, getWords(item.title))}</label>`
      )
      .join('');
  }

  function getState() {
    return Object.fromEntries(new FormData(document.querySelector('#form')));
  }

  function allCheckboxHandler(e) {
    const { all } = getState();

    const filters = form
      .querySelector('.each')
      .querySelectorAll('[type=checkbox]');

    [...filters].forEach((el) => (el.checked = !!all));
  }

  function renderResults() {
    const data = getState();
    const { input } = data;
    const words = input && getWords(input).filter((item) => item);

    const activeTrans = transforms.filter(({ title }) => !!data[title]);

    console.log(data, activeTrans);

    const output =
      words &&
      activeTrans
        .map(
          (item) =>
            `<fieldset class="result"><legend>${item.fn.call(
              null,
              getWords(item.title)
            )}</legend><p class="text">${item.fn.call(
              null,
              words
            )}</p></fieldset>`
        )
        .join('');

    const outputEl = document.querySelector('#output');
    outputEl.innerHTML = output;
  }

  function getWords(string) {
    const normalized = string
      .replace(/([A-Z])/g, ' $1')
      .replace(/\./g, ' ')
      .replace(/_/g, ' ')
      .replace(/-/g, ' ');
    const spitted = normalized.toLowerCase().split(' ');

    return spitted;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function copyToClipboard(e) {
    const target = e.target;
    const isOutput = target.id === 'output';

    if (isOutput) {
      return;
    }

    const isResult = target.classList.contains('result');
    const resultEl = isResult ? target : target.closest('.result');
    const text = resultEl.querySelector('.text').innerText;

    navigator.clipboard.writeText(text).then(() => console.log('copied'));
  }
}
