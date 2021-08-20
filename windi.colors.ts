interface OpacityVars {
   opacityVariable: string;
   opacityValue: number;
}

function createColor(variable: string) {
   return (config: OpacityVars) => {
      const { opacityValue, opacityVariable } = config;

      if (opacityValue !== undefined) {
         return `rgba(var(--${variable}), ${opacityValue})`;
      }
      if (opacityVariable !== undefined) {
         return `rgba(var(--${variable}), var(${opacityVariable}, 1))`;
      }
      return `rgb(var(--${variable}))`;
   };
}

export default {
   colors: {
      accent: '#6968DD'
   },

   textColor: {
      default: createColor('color-text-default'),
      inverse: createColor('color-text-inverse'),
   },

   backgroundColor: {
      inverse: createColor('color-bg-inverse'),
      default: createColor('color-bg-default'),
      'default-elevated': createColor('color-bg-default-elevated'),
   }
};
