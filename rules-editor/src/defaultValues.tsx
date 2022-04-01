export function defaultRules(): string {
  return `[SetLightColor]
colors = (red | green | blue)
set the light to <colors>

[GetLightColor]
is the light <SetLightColor.colors>`;
}
