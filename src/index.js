import axios from 'axios';
import { load } from 'js-yaml';
import './style.css';

import {defaultBooks, statusesRu, translateEn} from './const';

const result = document.querySelector('#repos');
const booksBlock = document.querySelector('#books');

const parseYaml = (obj) => {
  let books = structuredClone(defaultBooks);
  obj.forEach((element) => {
    books[element.identifier] = {...books[element.identifier], ...element};
  });
  return books;
};

const showStatus = (repo) => {
  axios
    .get('https://git.door43.org/' + repo + '/raw/branch/master/progress.yaml')
    .then((res) => {
      const yaml = load(res.data);
      const books = parseYaml(yaml.projects);
      booksBlock.innerHTML = '';
      for (const book in books) {
        if (Object.hasOwnProperty.call(books, book)) {
          const el = books[book];
          const div = document.createElement('div');
          const name = document.createElement('b');
          const date = document.createElement('small');
          const plan_date = document.createElement('small');
          const chapters = document.createElement('span');
          name.textContent = translateEn[book] + ' | ' + statusesRu[el.status] + ' | ';
          if (el.date_start) {
            date.textContent = el.date_start + ' - ' + (el.date_end || '--.--.--') + ' | ';
          }
          if (el.date_plan_start) {
            plan_date.textContent =
              el.date_plan_start +
              ' - ' +
              (el.date_plan_end || '--.--.--') +
              ' | ';
          }
          chapters.textContent = '(' + el.progress + '/' + el.chapters + ')';
          div.classList.add(el.status);
          div.appendChild(name);
          div.appendChild(date);
          div.appendChild(plan_date);
          div.appendChild(chapters);
          booksBlock.appendChild(div);
        }
      }
    })
    .catch((error) => console.log(error));
};

axios
  .get(
    'https://git.door43.org/api/catalog/v5/search?owner=Viktor&subject=Bible,Aligned%20Bible&limit=10000'
  )
  .then((res) => {
    res.data.data.forEach((el) => {
      const repo = document.createElement('div');
      const name = `${el.title} (${el.owner}/${el.name})`;
      result.appendChild(repo);
      repo.textContent = name;
      repo.addEventListener('click', () =>
        showStatus(`${el.owner}/${el.name}`)
      );
    });
  })
  .catch((error) => console.log(error));
