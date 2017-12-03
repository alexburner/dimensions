export type LayerName = 'points' | 'lines' | 'circles' | 'spheres'

export type LayerVisibility = { [name in LayerName]: boolean }
