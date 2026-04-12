import alibaba996Image from "./alibaba_996.webp";
import alibaba996Image960 from "./alibaba_996@960w.webp";
import alibaba996Image1440 from "./alibaba_996@1440w.webp";
import alibaba996DownloadImage from "./alibaba_996.png";
import antAlipayImage from "./ant_alipay.webp";
import antAlipayImage960 from "./ant_alipay@960w.webp";
import antAlipayImage1440 from "./ant_alipay@1440w.webp";
import antAlipayDownloadImage from "./ant_alipay.png";
import byteAstronautImage from "./byte_astronaut.webp";
import byteAstronautImage960 from "./byte_astronaut@960w.webp";
import byteAstronautImage1440 from "./byte_astronaut@1440w.webp";
import byteAstronautDownloadImage from "./byte_astronaut.png";
import bytedance99Image from "./bytedance_99.webp";
import bytedance99Image960 from "./bytedance_99@960w.webp";
import bytedance99Image1440 from "./bytedance_99@1440w.webp";
import bytedance99DownloadImage from "./bytedance_99.png";
import didiRiderImage from "./didi_rider.webp";
import didiRiderImage960 from "./didi_rider@960w.webp";
import didiRiderImage1440 from "./didi_rider@1440w.webp";
import didiRiderDownloadImage from "./didi_rider.png";
import dog996Image from "./dog_996.webp";
import dog996Image960 from "./dog_996@960w.webp";
import dog996Image1440 from "./dog_996@1440w.webp";
import dog996DownloadImage from "./dog_996.png";
import dogJdSmallImage from "./dog_jd_small.webp";
import dogJdSmallImage960 from "./dog_jd_small@960w.webp";
import dogJdSmallImage1440 from "./dog_jd_small@1440w.webp";
import dogJdSmallDownloadImage from "./dog_jd_small.png";
import gameAliImage from "./game_ali.webp";
import gameAliImage960 from "./game_ali@960w.webp";
import gameAliImage1440 from "./game_ali@1440w.webp";
import gameAliDownloadImage from "./game_ali.png";
import juhuaDancerImage from "./juhua_dancer.webp";
import juhuaDancerImage960 from "./juhua_dancer@960w.webp";
import juhuaDancerImage1440 from "./juhua_dancer@1440w.webp";
import juhuaDancerDownloadImage from "./juhua_dancer.png";
import kandaoTieziImage from "./kandao_tiezi.webp";
import kandaoTieziImage960 from "./kandao_tiezi@960w.webp";
import kandaoTieziImage1440 from "./kandao_tiezi@1440w.webp";
import kandaoTieziDownloadImage from "./kandao_tiezi.png";
import magicImage from "./magic.webp";
import magicImage960 from "./magic@960w.webp";
import magicImage1440 from "./magic@1440w.webp";
import magicDownloadImage from "./magic.png";
import nightOwlImage from "./night_owl.webp";
import nightOwlImage960 from "./night_owl@960w.webp";
import nightOwlImage1440 from "./night_owl@1440w.webp";
import nightOwlDownloadImage from "./night_owl.png";
import penguinMeituanImage from "./penguin_meituan.webp";
import penguinMeituanImage960 from "./penguin_meituan@960w.webp";
import penguinMeituanImage1440 from "./penguin_meituan@1440w.webp";
import penguinMeituanDownloadImage from "./penguin_meituan.png";
import tencent99Image from "./tencent_99.webp";
import tencent99Image960 from "./tencent_99@960w.webp";
import tencent99Image1440 from "./tencent_99@1440w.webp";
import tencent99DownloadImage from "./tencent_99.png";
import tencentPenguinBeerImage from "./tencent_penguin_beer.webp";
import tencentPenguinBeerImage960 from "./tencent_penguin_beer@960w.webp";
import tencentPenguinBeerImage1440 from "./tencent_penguin_beer@1440w.webp";
import tencentPenguinBeerDownloadImage from "./tencent_penguin_beer.png";
import workWorkerImage from "./work_worker.webp";
import workWorkerImage960 from "./work_worker@960w.webp";
import workWorkerImage1440 from "./work_worker@1440w.webp";
import workWorkerDownloadImage from "./work_worker.png";
import zooBossImage from "./zoo_boss.webp";
import zooBossImage960 from "./zoo_boss@960w.webp";
import zooBossImage1440 from "./zoo_boss@1440w.webp";
import zooBossDownloadImage from "./zoo_boss.png";

const PERSONA_IMAGE_SIZES = "(max-width: 640px) calc(100vw - 2rem), 448px";
const PERSONA_IMAGE_MAX_WIDTH = 1696;

type PersonaResponsiveImage = {
  src: string;
  srcSet: string;
  sizes: string;
};

type PersonaCharacterAssetConfig = PersonaResponsiveImage & {
  downloadSrc: string;
  downloadFilename: string;
};

function buildResponsiveImage(
  image960: string,
  image1440: string,
  imageFull: string,
  downloadSrc: string,
  downloadFilename: string,
): PersonaCharacterAssetConfig {
  return {
    src: image1440,
    srcSet: `${image960} 960w, ${image1440} 1440w, ${imageFull} ${PERSONA_IMAGE_MAX_WIDTH}w`,
    sizes: PERSONA_IMAGE_SIZES,
    downloadSrc,
    downloadFilename,
  };
}

const personaCharacterMap: Record<string, PersonaCharacterAssetConfig> = {
  "penguin-water": buildResponsiveImage(
    penguinMeituanImage960,
    penguinMeituanImage1440,
    penguinMeituanImage,
    penguinMeituanDownloadImage,
    "penguin_meituan.png",
  ),
  "heartless-ant": buildResponsiveImage(
    antAlipayImage960,
    antAlipayImage1440,
    antAlipayImage,
    antAlipayDownloadImage,
    "ant_alipay.png",
  ),
  "wechat-dog": buildResponsiveImage(
    dogJdSmallImage960,
    dogJdSmallImage1440,
    dogJdSmallImage,
    dogJdSmallDownloadImage,
    "dog_jd_small.png",
  ),
  "chrysanthemum-dancer": buildResponsiveImage(
    juhuaDancerImage960,
    juhuaDancerImage1440,
    juhuaDancerImage,
    juhuaDancerDownloadImage,
    "juhua_dancer.png",
  ),
  "didi-delivery": buildResponsiveImage(
    didiRiderImage960,
    didiRiderImage1440,
    didiRiderImage,
    didiRiderDownloadImage,
    "didi_rider.png",
  ),
  "slash-bro": buildResponsiveImage(
    kandaoTieziImage960,
    kandaoTieziImage1440,
    kandaoTieziImage,
    kandaoTieziDownloadImage,
    "kandao_tiezi.png",
  ),
  "zoo-director": buildResponsiveImage(
    zooBossImage960,
    zooBossImage1440,
    zooBossImage,
    zooBossDownloadImage,
    "zoo_boss.png",
  ),
  "gacha-weeb": buildResponsiveImage(
    nightOwlImage960,
    nightOwlImage1440,
    nightOwlImage,
    nightOwlDownloadImage,
    "night_owl.png",
  ),
  "blessed-puppy": buildResponsiveImage(
    dog996Image960,
    dog996Image1440,
    dog996Image,
    dog996DownloadImage,
    "dog_996.png",
  ),
  "gaming-ali": buildResponsiveImage(
    gameAliImage960,
    gameAliImage1440,
    gameAliImage,
    gameAliDownloadImage,
    "game_ali.png",
  ),
  "starry-eyes": buildResponsiveImage(
    byteAstronautImage960,
    byteAstronautImage1440,
    byteAstronautImage,
    byteAstronautDownloadImage,
    "byte_astronaut.png",
  ),
  "happy-drunk": buildResponsiveImage(
    tencentPenguinBeerImage960,
    tencentPenguinBeerImage1440,
    tencentPenguinBeerImage,
    tencentPenguinBeerDownloadImage,
    "tencent_penguin_beer.png",
  ),
  "chosen-one": buildResponsiveImage(
    workWorkerImage960,
    workWorkerImage1440,
    workWorkerImage,
    workWorkerDownloadImage,
    "work_worker.png",
  ),
  magician: buildResponsiveImage(
    magicImage960,
    magicImage1440,
    magicImage,
    magicDownloadImage,
    "magic.png",
  ),
  "pure-ali": buildResponsiveImage(
    alibaba996Image960,
    alibaba996Image1440,
    alibaba996Image,
    alibaba996DownloadImage,
    "alibaba_996.png",
  ),
  "pure-byte": buildResponsiveImage(
    bytedance99Image960,
    bytedance99Image1440,
    bytedance99Image,
    bytedance99DownloadImage,
    "bytedance_99.png",
  ),
  "pure-goose": buildResponsiveImage(
    tencent99Image960,
    tencent99Image1440,
    tencent99Image,
    tencent99DownloadImage,
    "tencent_99.png",
  ),
};

export type PersonaCharacterAsset = {
  src: string | null;
  srcSet: string | null;
  sizes: string | null;
  downloadSrc: string | null;
  downloadFilename: string | null;
  alt: string | null;
};

export function getPersonaCharacterAsset(
  personaId: string,
  displayName: string,
): PersonaCharacterAsset {
  const asset = personaCharacterMap[personaId];

  if (!asset) {
    return {
      src: null,
      srcSet: null,
      sizes: null,
      downloadSrc: null,
      downloadFilename: null,
      alt: null,
    };
  }

  return {
    src: asset.src,
    srcSet: asset.srcSet,
    sizes: asset.sizes,
    downloadSrc: asset.downloadSrc,
    downloadFilename: asset.downloadFilename,
    alt: `${displayName}角色插画`,
  };
}
