# Автоматизация процессов и цифровые системы

Коммерческий сайт-портфолио разработчика цифровых систем для автоматизации формализуемых процессов.

Главная идея проекта:

> Если процесс можно описать — его можно автоматизировать.

Сайт показывает не просто портфолио, а систему лидогенерации для заявок на автоматизацию процессов: заявки, документы, файлы, статусы, админ-панели, личные кабинеты, рассылки, отчётность и workflow.

## Технологии

- Astro
- TypeScript
- Tailwind CSS
- Yandex Metrika
- Yandex Cloud API Gateway
- Yandex Cloud Functions
- Telegram Bot API

## Структура проекта

```text
public/
  scripts/
  robots.txt
  sitemap.xml
  favicon.svg
  og-image.svg
  site.webmanifest

src/
  components/
  data/
  pages/
  styles/
  utils/

functions/
  shared/
  lead/
  brief/
  lead-magnet/

cloud/
  api-gateway.yaml
  ydb-schema.sql
  deploy.md

docs/
  seo-checklist.md
  production-checklist.md