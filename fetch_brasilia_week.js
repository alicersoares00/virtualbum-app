const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(__dirname, "brasilia_week.json");
const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-15.7939&longitude=-47.8828&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America%2FSao_Paulo&forecast_days=7";

const WEATHER_THEMES = {
  "Ceu limpo": {
    emoji: "🌙",
    condition: "tempo seco e aberto",
    recommendation: "Boa janela para um dia leve e sem interrupcoes do tempo.",
    palette: {
      background: "#FFF5D9",
      border: "#E9D38B",
      accent: "#B88827",
    },
    actions: ["caminhada noturna", "fotos do ceu", "musica ao ar livre", "leitura curta", "passeio tranquilo"],
  },
  Ensolarado: {
    emoji: "🌤️",
    condition: "sol agradavel com poucas nuvens",
    recommendation: "Dia excelente para sair e aproveitar atividades ao ar livre.",
    palette: {
      background: "#FFF2CC",
      border: "#E8C96B",
      accent: "#A77412",
    },
    actions: ["caminhada", "jardim", "parque", "fotografia", "sketch", "cafe ao ar livre"],
  },
  "Sol forte": {
    emoji: "☀️",
    condition: "calor e sol intenso",
    recommendation: "Prefira programas externos curtos e hidrate-se bem ao longo do dia.",
    palette: {
      background: "#FFE1B8",
      border: "#F0B45D",
      accent: "#B55A18",
    },
    actions: ["piquenique", "sorvete", "passeio", "foto", "skate", "sunset rapido"],
  },
  "Chuva leve": {
    emoji: "🌦️",
    condition: "garoa ou chuva fraca em alguns periodos",
    recommendation: "Clima bom para desacelerar sem perder a chance de sair se abrir uma janela seca.",
    palette: {
      background: "#DDEBFF",
      border: "#9CBCE8",
      accent: "#416BA8",
    },
    actions: ["filmes", "leitura", "cafe", "Discord", "criacao", "playlist relaxante"],
  },
  Chuvoso: {
    emoji: "🌧️",
    condition: "chuva consistente ao longo do dia",
    recommendation: "Vale priorizar programas internos e confortaveis.",
    palette: {
      background: "#D4E0F5",
      border: "#93A8CC",
      accent: "#34527A",
    },
    actions: ["series", "chamadas", "jogos", "receita", "arte", "escrita"],
  },
  Fresco: {
    emoji: "🧥",
    condition: "temperaturas mais amenas e clima confortavel",
    recommendation: "Um dia bom para atividades calmas e ambientes aconchegantes.",
    palette: {
      background: "#E7E2FF",
      border: "#B8ACE8",
      accent: "#5A4BA2",
    },
    actions: ["museu", "chocolate quente", "board game", "diario", "cafe", "livraria"],
  },
  "Parcialmente nublado": {
    emoji: "⛅",
    condition: "sol entre nuvens",
    recommendation: "Dia flexivel que combina saidas leves com pausas em lugares fechados.",
    palette: {
      background: "#E7F2E5",
      border: "#A9C8A5",
      accent: "#4F7A53",
    },
    actions: ["cafe", "trilha", "hobby", "mercado", "documentario", "passeio curto"],
  },
};

function getFetch() {
  if (typeof fetch === "function") {
    return fetch;
  }

  return (...args) =>
    import("node-fetch").then(({ default: nodeFetch }) => nodeFetch(...args));
}

function hashFromDate(dateString) {
  return dateString.split("-").reduce((total, part) => total + Number(part), 0);
}

function pickActions(dateString, actionPool, amount = 3) {
  const seed = hashFromDate(dateString);
  const available = [...actionPool];
  const selected = [];

  for (let index = 0; index < amount && available.length > 0; index += 1) {
    const nextIndex = (seed + index * 7) % available.length;
    selected.push(available.splice(nextIndex, 1)[0]);
  }

  return selected;
}

function classifyClimate(weatherCode, maxTemp, minTemp, rainMm) {
  if (rainMm >= 4 || [63, 65, 80, 81, 82].includes(weatherCode)) {
    return "Chuvoso";
  }

  if (rainMm > 0 || [51, 53, 55, 56, 57, 61].includes(weatherCode)) {
    return "Chuva leve";
  }

  if ([1, 2, 3, 45, 48].includes(weatherCode)) {
    if (minTemp <= 16 && maxTemp <= 24) {
      return "Fresco";
    }

    if (weatherCode === 2 || weatherCode === 3) {
      return "Parcialmente nublado";
    }

    return "Ensolarado";
  }

  if (weatherCode === 0) {
    if (maxTemp >= 30) {
      return "Sol forte";
    }

    if (minTemp <= 14) {
      return "Ceu limpo";
    }

    return "Ensolarado";
  }

  if (maxTemp <= 23) {
    return "Fresco";
  }

  return "Parcialmente nublado";
}

function toDisplayDate(dateString) {
  const date = new Date(`${dateString}T12:00:00-03:00`);

  return date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function buildForecastItem(dateString, weatherCode, maxTemp, minTemp, rainMm) {
  const climateLabel = classifyClimate(weatherCode, maxTemp, minTemp, rainMm);
  const theme = WEATHER_THEMES[climateLabel] || WEATHER_THEMES["Parcialmente nublado"];
  const actions = pickActions(dateString, theme.actions);

  return {
    date: dateString,
    displayDate: toDisplayDate(dateString),
    emoji: theme.emoji,
    climateLabel,
    condition: theme.condition,
    temperatureMax: Number(maxTemp.toFixed(1)),
    temperatureMin: Number(minTemp.toFixed(1)),
    rainVolume: Number(rainMm.toFixed(1)),
    recommendation: theme.recommendation,
    suggestedActions: actions,
    palette: theme.palette,
  };
}

async function main() {
  const fetchFn = getFetch();
  const response = await fetchFn(API_URL);

  if (!response.ok) {
    throw new Error(`Open-Meteo retornou ${response.status}`);
  }

  const payload = await response.json();
  const days = payload.daily.time.map((dateString, index) =>
    buildForecastItem(
      dateString,
      payload.daily.weather_code[index],
      payload.daily.temperature_2m_max[index],
      payload.daily.temperature_2m_min[index],
      payload.daily.precipitation_sum[index]
    )
  );

  const output = {
    location: {
      city: "Brasilia",
      latitude: -15.7939,
      longitude: -47.8828,
    },
    source: "Open-Meteo",
    generatedAt: new Date().toISOString(),
    timezone: payload.timezone,
    forecast: days,
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Arquivo salvo em ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error("Falha ao gerar brasilia_week.json");
  console.error(error);
  process.exit(1);
});
