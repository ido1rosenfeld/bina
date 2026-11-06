// The numbers the figure moves by. Stoichiometry is the textbook mammalian one;
// rates are slowed far below the real ones (~100 turns/s) so the eye can follow.
export const MODEL = {
  hPerNadh: 10, // complex I 4 + complex III 4 + complex IV 2
  cRing: 8, // c-subunits in the mammalian c-ring: 8 H+ per full turn
  atpPerRev: 3, // three beta subunits, one ATP each per turn
  hTransportPerAtp: 1, // phosphate carrier brings Pi in with one H+
  // => (8 + 3) / 3 = 3.67 H+ per ATP, 10 / 3.67 = 2.7 ATP per NADH

  // simulated kinetics (figure time)
  nadhMax: 2.4, // NADH oxidised per second at full supply and no back-pressure
  dpStall: 250, // mV at which the pumps can no longer push (respiratory control)
  dpThreshold: 140, // mV below which ATP synthase does not turn forward
  dpSpan: 60,
  revMax: 1.8, // c-ring turns per second per dpSpan above threshold
  mvPerH: 1.2, // mV gained per proton pumped (membrane capacitance, figure units)
  gaugeMax: 250,
  start: { dp: 150, feed: 0.25 },
};
