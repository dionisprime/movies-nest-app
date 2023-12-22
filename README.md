### 25 Export

Добавил возможность экспорта, пока осилил только джсон..
Например запросом Get на http://localhost:3000/movie/export/json в браузере прилетает файл movies.json со всеми фильмами из базы. Тоже самое и с http://localhost:3000/user/export/json

### 24 Права и роли

Добавил декоратор Roles, проверки прав, которого у меня не было, теперь функция isAdmin ненужна которая использовалась ранее
Добавил логику прав и ролей, enums.
Убран токен из базы, изменена генерация токена, как для высылки ссылки
так же можно получить токен в постмане передав в теле емейл и пароль по роуту /login

---

### 23 Транзакции

Были опробованы транзакции, применил для удаления фильма и его id из всех плейлистов где он мог быть.
Была ошибка при запросе "Transaction numbers are only allowed on a replica set member or mongos" при использовании локальной БД, подключаясь к Atlas этой ошибки нет. Как сделать для локальной? И надо ли?))

---

### 22 Кэш

добавлено кеширование node-cache для запроса всех фильмов, и сброс кеша при изменении или удалении фильма

---

### 20 Волшебная ссылка

добавлена возможность восстанавливать доступ, на почту приходит волшебная ссылка с токеном для входа

---

### 19 Дамп

Научились делать дамп базы и восстановление, как локально так и удаленно, попробовали атлас и удаленное подключение к облачной монге

---

### 18 X

Добавил плейлистам свойство entriesCount, которое считает количество вхождений, когда плейлист кто-то себе добавляет, или удаляет.
Добавил вывод на основе этого свойства top-50 популярных списков.

---

### 4.17 Расписание

добавил логирование при помощи node-shedule каждые 2 минуты,
в базу записывается количество фильмов, списков и юзеров.

---

### 4.16 Х

добавлено копирование плейлистов юзерам

---

### 4.13 Другие роуты

Доделал всё по спискам, наконец-то!! Единственное, тесты идут лесом пока)))

---

### 4.15 Документация

Добавил в проект Swagger

---

### 4.13 Другие роуты

Доделал всё по спискам, наконец-то
++ По-умолчанию, созданный список является приватным.
++ Все публичные списки должны быть доступны всем пользователям (даже тем, кто без токена).
++ Все приватные списки доступны для чтения и редактирования только их владельцам.
++ Списки не могут включать один и тот же фильм более одного раза (что логично).
++ Списки могут иметь одинаковые имена.
++ Пользователь может иметь несколько списков.

---

### 4.11 Безопасность

включил cors, создал и начал использовать декоратор @Public() публичных роутов, остальные по умолчанию закрыты

---

###4.10 Токены

Не простая задача была и объемная, по внедрению использования токенов веб-аутентификации в своем приложении.
Использовалась библиотека PassportJS https://www.passportjs.org/
В купе с поступающей инфой по TS и Nest за последние дни, это была просто чрезвычайно экстремальная нагрузка на мозг)))

---

###4.9 Авторизация

В качестве практики:

- изменил модель User, добавил roles: [String], и password
- создал роут и сервис для создания пользователей (принимаем email и пароль и храним их в базе)
- создал пару пользователей
- создал роут и сервис для аутентификации юзеров (при запросе принимать email и пароль)
- нахожу юзера по email и сравниваю пароль с тем, что записан в базе
- отдаю клиенту строку вида `${email} ${password}`

- сделал в сервисе юзера _authenticate_ для проверки пользователя и получения строки вида `${user.email} ${user.password}` и _isAuth_ для проверки перед каждым нужным запросом
- реализовал проверку isAuth в movie controller для post, patch и delete

---

###4.6 Nest

В качестве практики создал ресурсы, определил сущности, прописал для сущностей CRUD.
TDD для меня пока по прежнему кажется лишним усложнением и увеличением времени написания кода, хотя вроде как наоборот, как говорят менторы TDD - не усложняет, а скорее ускоряет разработку. Чтож, буду пытаться тоже вникать лучше в TDD))

---

###4.4 Nest

## В качестве практики:

1.

- Создал схему для фильмов,
- добавил несколько произвольных полей,
- глянул статью по монге из доки неста https://docs.nestjs.com/techniques/mongodb

2.

- Создал DTO для создания фильма,
- отдельную DTO в отдельном файле для обновления фильма,
- еще одну для удаления фильма

3.

- добавил модель в сервис MovieService
- добавиле методы для обновления и удаления фильма из базы

---

Проверил тесты: все три прошли. После теста создаётся фильм в БД (бонус тоже сделал, очистка коллекции после теста)
Проект запускается, активное отслеживание работает, постманом работают все 4 запроса
_GET_

- выдаёт все фильмы,
- фильм по его id
  _POST_ Создаёт фильм в БД
  _PATCH_ изменяет фильм по его id
  _DELETE_ удаляет фильм по его id

---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
