export const MODE_VARIABLE_LOOKUP = {
  auto:       "trans_auto_total",
  taxi:       "trans_taxi",
  bus:        "trans_public_bus",
  subway:     "trans_public_subway",
  railroad:   "trans_public_rail",
  walk:       "trans_walk",
  ferry:      "trans_public_ferry",
  streetcar:  "trans_public_streetcar",
  bicycle:    "trans_bicycle",
  motorcycle: "trans_motorcycle",
  other:      "trans_other"
}

export function censusTractVariableForMode(mode) {  
  return MODE_VARIABLE_LOOKUP[mode];
}
