# Maria Digital Lab — статический лендинг (GitHub Pages)

Тёмный modern‑neon лендинг‑портфолио для digital/AI/vibe‑coding специалиста.

Требования соблюдены:
- без React / Vite
- без npm / Node.js
- без внешних библиотек и CDN
- открывается двойным кликом по `index.html` и работает на GitHub Pages

## Структура

- `index.html` — вся разметка (8 блоков по ТЗ) + комментарии, где менять тексты/ссылки/контакты
- `style.css` — стили (glass, glow, grid, адаптив)
- `script.js` — анимации и интерактив (reveal‑появление, моб. меню, “pipeline” в hero)
- `README.md` — инструкция

## Как открыть локально

1) Откройте папку проекта.
2) Дважды кликните `index.html`.

Важно: сайт **не требует сервера** — всё работает через `file://`.

## Как загрузить на GitHub

1) Создайте новый репозиторий на GitHub (например, `maria-digital-lab`).
2) Загрузите в репозиторий файлы:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`

Можно через веб‑интерфейс GitHub: **Add file → Upload files**.

## Как включить GitHub Pages

1) Откройте репозиторий на GitHub → **Settings**.
2) Слева выберите **Pages**.
3) В разделе **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` (или `master`)
   - **Folder**: `/ (root)`
4) Сохраните. GitHub покажет публичную ссылку на сайт.

## Где менять ссылки на проекты

В `index.html` найдите блок **“Проекты”** (секция `id="projects"`).
Там 4 кнопки с `href="#"` — замените `#` на реальные ссылки GitHub Pages ваших проектов.

Подсказка: в коде рядом есть комментарий:
`ВАЖНО: ссылки сейчас заглушки "#". Менять ссылки ... href="..."`

## Где менять контакты

В `index.html` найдите секцию `id="contacts"` и замените:
- Telegram: `https://t.me/your_username`
- Email: `mailto:yourmail@example.com`
- VK: `https://vk.com/your_page`

