const FROM_EMAIL = 'ваша почта';
const MAIL_SERVER = 'адрес почтового сервера';
const MAIL_TOKEN = 'ваш токен';
export const SETTINGS = {
  host: MAIL_SERVER,
  port: 465,
  secure: true,
  logger: true,
  auth: {
    user: FROM_EMAIL,
    pass: MAIL_TOKEN,
  },
};
