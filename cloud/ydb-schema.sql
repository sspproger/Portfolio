-- Заготовка таблицы для будущего хранения заявок.
-- Синтаксис Json / Datetime может отличаться в зависимости от режима YDB.
-- Перед применением в реальном облаке проверьте схему под конкретную конфигурацию YDB.

CREATE TABLE leads (
  request_id Utf8,
  form_type Utf8,
  page_url Utf8,
  page_title Utf8,
  client_id Utf8,
  fields_json Json,
  utm_json Json,
  created_at Datetime,
  PRIMARY KEY (request_id)
);