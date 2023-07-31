export const copyDefinedValues = (current: any, incoming: any) => {
  for (const key of Object.keys(incoming)) {
    if (incoming[key] !== undefined) {
      current[key] = incoming[key];
    }
  }
};
