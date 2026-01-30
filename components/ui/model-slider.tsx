"use client";

import Model from "@/components/ui/model";

export type ModelItem = {
  url: string;
  bg: string;

  // NEW: per-model text content
  title: string;
  tagline: string;
  description: string;
  breadcrumbs: [string, string];
};

export const MODELS: ModelItem[] = [
  {
    url: "/models/tiger_new_draco.glb",
    bg: "/bg-images/workshop-new-bg.jpg",
    title: "FORGED GUARDIAN",
    tagline: "Primal Fury, Engineered for Glory.",
    description:
      "A roaring steampunk jaguar bust featuring intricate brass armor, gears, and a vintage bronze finish.",
    breadcrumbs: ["Collection", "Statue"],
  },
  {
    url: "/models/owl_draco.glb",
    bg: "/bg-images/owl-bg.jpg",
    title: "FROST SAGE",
    tagline: "Wisdom carved in winter.",
    description:
      "A mystic owl bust with etched patterns and a cold patina, inspired by quiet mountain legends.",
    breadcrumbs: ["Collection", "Statue"],
  },
  {
    url: "/models/jesus_draco.glb",
    bg: "/bg-images/jesus-bg.jpg",
    title: "DIVINE CRAFT",
    tagline: "Grace shaped in metal.",
    description:
      "An ornate sculpted bust with sacred detailing and a refined finish, designed to feel timeless and iconic.",
    breadcrumbs: ["Collection", "Statue"],
  },

  //can add more models here
];

export const MODELS_COUNT = MODELS.length;

type Props = {
  index: number;
  visible: boolean;
};

export default function ModelSlider({ index, visible }: Props) {
  return <Model url={MODELS[index].url} visible={visible} />;
}
