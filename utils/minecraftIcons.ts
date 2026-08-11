import adventure from "~/assets/mc-icons/adventure.png";
import announce from "~/assets/mc-icons/announce.png";
import apply from "~/assets/mc-icons/apply.png";
import build from "~/assets/mc-icons/build.png";
import chest from "~/assets/mc-icons/chest.png";
import event from "~/assets/mc-icons/event.png";
import explore from "~/assets/mc-icons/explore.png";
import guide from "~/assets/mc-icons/guide.png";
import history from "~/assets/mc-icons/history.png";
import nekoAvatar from "~/assets/mc-icons/neko-avatar.png";
import pack from "~/assets/mc-icons/pack.png";
import redstone from "~/assets/mc-icons/redstone.png";
import resource from "~/assets/mc-icons/resource.png";
import rules from "~/assets/mc-icons/rules.png";
import server from "~/assets/mc-icons/server.png";
import sign from "~/assets/mc-icons/sign.png";
import wiki from "~/assets/mc-icons/wiki.png";

const iconUrls: Record<string, string> = {
  adventure,
  announce,
  apply,
  build,
  chest,
  event,
  explore,
  guide,
  history,
  lobby: explore,
  "neko-avatar": nekoAvatar,
  pack,
  redstone,
  resource,
  rules,
  server,
  sign,
  wiki
};

export function minecraftIconUrl(name: string) {
  return iconUrls[name] || iconUrls.server;
}
