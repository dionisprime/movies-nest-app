export enum ERROR_MESSAGE {
  INCORRECT_VALUE = 'некорректное значение',
  ENTER_CORRECT_VALUE = 'Введите корректное значение',
  PROFILE_NOT_FOUND = 'Профиль не найден.',
  AN_ERROR_OCCURRED = 'Произошла ошибка!',

  INVALID_CREDENTIALS = 'Неверные учетные данные',

  MOVIE_NOT_FOUND = 'Фильм не найден',

  GENRE_NOT_FOUND = 'Жанр не найден',

  DIRECTOR_NOT_FOUND = 'Режиссер не найден',

  USER_NOT_FOUND = 'Пользователь не найден',

  AUTH_HEADER_MISSING = 'Authorization header отсутствует',
  NOT_ADMIN = 'Доступ только для админа!',

  PLAYLIST_NOT_FOUND = 'Плейлист не найден',
  MOVIE_EXIST = 'Фильм уже присутствует в списке',

  NO_PERMISSIONS = 'У Вас нет прав на выполнение этого действия',

  USER_ALREADY_EXIST = 'Пользователь с этим адресом электронной почты уже существует',
}

export enum MESSAGE {}

export enum ROLES {
  ADMIN = 'admin',
  USER = 'user',
}
