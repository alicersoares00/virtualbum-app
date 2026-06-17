import bot from "./bot.jpg";
import bronze from "./bronze.jpg";
import ceram from "./ceram.jpg";
import cianot from "./cianot.jpg";
import cromatica from "./cromatica.jpg";
import jan from "./jan.jpg";
import textil from "./textil.jpg";
import logo from "./logo.png";

const PHOTO_ASSETS = {
  bot,
  bronze,
  ceram,
  cianot,
  cromatica,
  jan,
  textil,
};

const PHOTO_SEQUENCE = [
  { key: "bot", label: "Botanica" },
  { key: "bronze", label: "Bronze" },
  { key: "ceram", label: "Ceramica" },
  { key: "cianot", label: "Cianotipia" },
  { key: "cromatica", label: "Cromatica" },
  { key: "jan", label: "Janeiro" },
  { key: "textil", label: "Textil" },
];

export function pickPhotoAsset(index = 0) {
  return PHOTO_SEQUENCE[index % PHOTO_SEQUENCE.length];
}

export function resolvePhotoSource(item) {
  if (item?.assetKey && PHOTO_ASSETS[item.assetKey]) {
    return PHOTO_ASSETS[item.assetKey];
  }

  if (item?.url) {
    return { uri: item.url };
  }

  return logo;
}

export function resolveThumbnailSource(item) {
  if (item?.assetKey && PHOTO_ASSETS[item.assetKey]) {
    return PHOTO_ASSETS[item.assetKey];
  }

  if (item?.thumbnailUrl) {
    return { uri: item.thumbnailUrl };
  }

  return resolvePhotoSource(item);
}
