import mem from "mem";
import { getInterleaveConfig } from "./utils";

const interleaveMap = getInterleaveConfig();
export const hasExternalizedModuleViaJson = mem(moduleResource => {
  if (!moduleResource || !interleaveMap) return;
  const interleaveKeys = Object.keys(interleaveMap || {});

  if (interleaveKeys) {
    const foundMatch = interleaveKeys.find(item =>
      moduleResource.includes(item)
    );
    return interleaveMap[foundMatch] || false;
  }
});

export function interleaveConfig({ testPath, manifestName }) {
  return {
    test(module) {
      // check if module has a resource path (not virtual modules)
      if (module.resource) {
        return (
          module.resource.includes(testPath) &&
          !!hasExternalizedModuleViaJson(module.resource, manifestName)
        );
      }
    },
    name(module) {
      // Check if module is listed in the interleave interface
      const foundValue = hasExternalizedModuleViaJson(
        module.resource,
        manifestName
      );

      if (foundValue) return foundValue;
    },
    // force module into a chunk regardless of how its used
    enforce: true

    // might need for next.js
    // reuseExistingChunk: false,
  };
}

export function interleaveStyleConfig({ manifestName }) {
  return {
    test(module) {
      // check if module has a resource path (not virtual modules)
      if (module.constructor.name === "CssModule") {
        return !!hasExternalizedModuleViaJson(
          module.identifier(),
          manifestName
        );
      }
    },
    // eslint-disable-next-line no-unused-vars
    name(module, chunks, cacheGroupKey) {
      // Check if module is listed in the interleave interface
      if (!module.resource) {
        const foundValue = hasExternalizedModuleViaJson(
          module.resource || module.identifier(),
          manifestName
        );

        if (foundValue) return `${foundValue}-style`;
      }

      return "styles";
    },
    // force module into a chunk regardless of how its used
    chunks: "all",
    enforce: true,
    reuseExistingChunk: false
  };
}
export function interleaveStyleJsConfig({ manifestName }) {
  return {
    test(module) {
      if (
        module.request &&
        module.request.match(/\\(style-loader|css-loader|sass-loader)$/)
      ) {
        return true;
      }

      if (module.constructor.name === "CssModule") {
        return false;
      }

      if (module.resource && module.resource.match(/\.(scss|css)$/)) {
        return true;
      }

      return false;
    },
    name(module, chunks) {
      console.log("interleaveStyleJsConfig", chunks);
      return `${manifestName}-stylejs`;
    },
    chunks: "all",
    enforce: true,
    reuseExistingChunk: false
  };
}
