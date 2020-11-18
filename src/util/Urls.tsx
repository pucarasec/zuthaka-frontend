const baseUrl = process.env.REACT_APP_BASE_URL as string

export default {
  c2: `${baseUrl}/c2`,
  c2_types: `${baseUrl}/c2/types`,
  launcher: `${baseUrl}/launchers`,
  launcher_type: `${baseUrl}/launchers/types`,
//   lauchers:
  listeners: `${baseUrl}/listeners`,
  listeners_types: `${baseUrl}/listeners/types`,

  agents: `${baseUrl}/agents`,
}
