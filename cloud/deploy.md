# Deploy backend for automation portfolio

Этот документ описывает примерный порядок подключения backend-части:
Yandex Cloud Functions, API Gateway и Telegram-уведомлений.

## 1. Создать Telegram-бота

1. Откройте Telegram.
2. Найдите `@BotFather`.
3. Выполните команду `/newbot`.
4. Задайте имя бота.
5. Задайте username бота.
6. Сохраните токен.

Токен нужно записать в переменную окружения Cloud Function:

```env
TELEGRAM_BOT_TOKEN=...