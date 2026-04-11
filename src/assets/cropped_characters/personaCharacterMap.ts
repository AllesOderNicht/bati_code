import alibaba996Image from "./alibaba_996.png";
import antAlipayImage from "./ant_alipay.png";
import byteAstronautImage from "./byte_astronaut.png";
import bytedance99Image from "./bytedance_99.png";
import didiRiderImage from "./didi_rider.png";
import dog996Image from "./dog_996.png";
import dogJdSmallImage from "./dog_jd_small.png";
import gameAliImage from "./game_ali.png";
import juhuaDancerImage from "./juhua_dancer.png";
import kandaoTieziImage from "./kandao_tiezi.png";
import magicImage from "./magic.png";
import nightOwlImage from "./night_owl.png";
import penguinMeituanImage from "./penguin_meituan.png";
import tencent99Image from "./tencent_99.png";
import tencentPenguinBeerImage from "./tencent_penguin_beer.png";
import workWorkerImage from "./work_worker.png";
import zooBossImage from "./zoo_boss.png";

const personaCharacterMap: Record<string, string> = {
  "penguin-water": penguinMeituanImage,
  "heartless-ant": antAlipayImage,
  "wechat-dog": dogJdSmallImage,
  "chrysanthemum-dancer": juhuaDancerImage,
  "didi-delivery": didiRiderImage,
  "slash-bro": kandaoTieziImage,
  "zoo-director": zooBossImage,
  "gacha-weeb": nightOwlImage,
  "blessed-puppy": dog996Image,
  "gaming-ali": gameAliImage,
  "starry-eyes": byteAstronautImage,
  "happy-drunk": tencentPenguinBeerImage,
  "chosen-one": workWorkerImage,
  magician: magicImage,
  "pure-ali": alibaba996Image,
  "pure-byte": bytedance99Image,
  "pure-goose": tencent99Image,
};

export type PersonaCharacterAsset = {
  src: string | null;
  alt: string | null;
};

export function getPersonaCharacterAsset(
  personaId: string,
  displayName: string,
): PersonaCharacterAsset {
  const src = personaCharacterMap[personaId];

  if (!src) {
    return {
      src: null,
      alt: null,
    };
  }

  return {
    src,
    alt: `${displayName}角色插画`,
  };
}
