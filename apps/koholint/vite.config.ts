import { guideConfig } from "@game-guides/core/vite";
import { brand } from "./src/guide/brand.ts";

export default guideConfig(import.meta.dirname, brand);
