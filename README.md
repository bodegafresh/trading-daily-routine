# trading-daily-routine

Automatización de rutina diaria de trading vía Telegram + Google Apps Script.
Permite iniciar y cerrar una sesión de trading con comandos, realiza preguntas guiadas y registra todo en Google Sheets.

## Objetivo

- `/trade start`: inicia sesión y captura:
  - estado emocional (1–10)
  - energía (bajo/medio/alto)
  - calidad de sueño (bajo/medio/alto)
  - recordatorio de lectura (identidad del trader + reglas mentales)
  - regla: si emoción ≤ 3 → **NO OPERAR**
- `/trade stop`: cierra sesión y captura:
  - cumplimiento de reglas (sí/no)
  - emoción dominante
  - operaciones (ganadas / perdidas / empatadas)
  - observaciones breves

## Tech stack

- Google Apps Script (runtime V8)
- Telegram Bot API (webhook)
- Google Sheets como almacenamiento

## Estructura

- `src/telegram`: webhook, router y cliente Telegram
- `src/trade`: comandos y flujo conversacional
- `src/persistence`: escritura/lectura en Sheets y estado en PropertiesService
- `docs/`: esquema de la hoja, comandos y máquina de estados

```md
trading-routine-bot/
├─ src/
│ ├─ main.gs
│ ├─ config/
│ │ ├─ env.gs
│ │ └─ constants.gs
│ ├─ telegram/
│ │ ├─ webhook.gs
│ │ ├─ router.gs
│ │ └─ telegram_client.gs
│ ├─ trade/
│ │ ├─ trade_commands.gs
│ │ ├─ trade_flow.gs
│ │ ├─ trade_state.gs
│ │ └─ trade_validation.gs
│ ├─ persistence/
│ │ ├─ sheet_repository.gs
│ │ └─ properties_store.gs
│ └─ utils/
│ ├─ date_utils.gs
│ ├─ text_utils.gs
│ └─ logger.gs
├─ scripts/
│ ├─ setup.sh
│ └─ deploy.sh
├─ docs/
│ ├─ sheet_schema.md
│ ├─ commands.md
│ └─ state_machine.md
├─ .clasp.json.example
├─ .gitignore
├─ appsscript.json
└─ README.md
```

## Requisitos

- Un bot de Telegram (token)
- Un Google Sheet para registrar sesiones
- Un proyecto de Apps Script desplegado como Web App (para webhook)
- (Opcional) `clasp` para sincronizar el repo con Apps Script

## Configuración (rápida)

1. Crear Google Sheet y copiar el `SPREADSHEET_ID`
2. Definir variables en `src/config/env.gs`:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID` (o permitir multi-chat)
   - `SPREADSHEET_ID`
   - `SHEET_NAME` (por ejemplo: `trading_sessions`)
3. Desplegar como Web App:
   - Ejecutar como: tu usuario
   - Acceso: cualquiera con el link
4. Configurar webhook de Telegram apuntando al URL del Web App

## Comandos

- `/trade start`
- `/trade stop`
- `/trade status`
- `/trade cancel` (opcional, para abortar flujo)

Detalles en `docs/commands.md`.

## Estado conversacional

El bot guía preguntas secuenciales y guarda estado intermedio en `PropertiesService`
para saber en qué pregunta va cada sesión.

Ver `docs/state_machine.md`.

## License

MIT
