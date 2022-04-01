export function defaultRules(): string {
  return `[GetTime]
what time is it
tell me the time

[GetWheater]
tell me the weather
what is the temperature

[Greet]
hello
hi
[very] good morning
[very] good afternoon
[very] good evening

[Debug]
debug
`;
}

export function defaultIntents(): string {
  return `# home assistant script example
  GetTime:
  speech:
    text: it is {{ as_local(now()).hour }} hours and {{ as_local(now()).minute }} minutes

GetWheater:
  speech:
    text: the weather is {{ states.weather.jaragua191.state }} and temperature is {{ states.weather.jaragua191.attributes.temperature }} celcius

Greet:
  speech:
    text: >
        {%- if as_local(now()).hour in [4, 5, 6, 7, 8, 9, 10, 11] -%}
          good morning
        {%- elif as_local(now()).hour in [12, 13, 14, 15, 16, 17] -%}
          good afternoon
        {%- elif as_local(now()).hour in [18, 19, 20, 21, 22, 23] -%}
          good evening
        {%- else -%}
          hello
        {%- endif -%}
    
Debug:
  speech:
    text: debug {{ as_local(now()).hour }} {{ as_local(now()).hour in [25] }} 
`;
}
