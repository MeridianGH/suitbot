// noinspection JSCheckFunctionSignatures,JSUnresolvedVariable,JSUnusedGlobalSymbols

import { Plugin, Structure } from 'erela.js'

export class FilterManager extends Plugin {
  load() {
    Structure.extend('Player', (Player) => class extends Player {
      constructor() {
        super(...arguments)
        this.filter = 'none'
        this.filters = {
          'none': {
            op: 'filters',
            guildId: this.guild
          },
          'bassboost': {
            op: 'filters',
            guildId: this.guild,
            equalizer: [
              { band: 0, gain: 0.6 },
              { band: 1, gain: 0.7 },
              { band: 2, gain: 0.8 },
              { band: 3, gain: 0.55 },
              { band: 4, gain: 0.25 },
              { band: 5, gain: 0 },
              { band: 6, gain: -0.25 },
              { band: 7, gain: -0.45 },
              { band: 8, gain: -0.55 },
              { band: 9, gain: -0.7 },
              { band: 10, gain: -0.3 },
              { band: 11, gain: -0.25 },
              { band: 12, gain: 0 },
              { band: 13, gain: 0 },
              { band: 14, gain: 0 }
            ]
          },
          'classic': {
            op: 'filters',
            guildId: this.guild,
            equalizer: [
              { band: 0, gain: 0.375 },
              { band: 1, gain: 0.350 },
              { band: 2, gain: 0.125 },
              { band: 3, gain: 0 },
              { band: 4, gain: 0 },
              { band: 5, gain: 0.125 },
              { band: 6, gain: 0.550 },
              { band: 7, gain: 0.050 },
              { band: 8, gain: 0.125 },
              { band: 9, gain: 0.250 },
              { band: 10, gain: 0.200 },
              { band: 11, gain: 0.250 },
              { band: 12, gain: 0.300 },
              { band: 13, gain: 0.250 },
              { band: 14, gain: 0.300 }
            ]
          },
          'eightd': {
            op: 'filters',
            guildId: this.guild,
            equalizer: [],
            rotation: { rotationHz: 0.2 }
          },
          'earrape': {
            op: 'filters',
            guildId: this.guild,
            equalizer: [
              { band: 0, gain: 0.6 },
              { band: 1, gain: 0.67 },
              { band: 2, gain: 0.67 },
              { band: 3, gain: 0 },
              { band: 4, gain: -0.5 },
              { band: 5, gain: 0.15 },
              { band: 6, gain: -0.45 },
              { band: 7, gain: 0.23 },
              { band: 8, gain: 0.35 },
              { band: 9, gain: 0.45 },
              { band: 10, gain: 0.55 },
              { band: 11, gain: 0.6 },
              { band: 12, gain: 0.55 },
              { band: 13, gain: 0 }
            ]
          },
          'karaoke': {
            op: 'filters',
            guildId: this.guild,
            equalizer: [],
            karaoke: {
              level: 1.0,
              monoLevel: 1.0,
              filterBand: 220.0,
              filterWidth: 100.0
            }
          },
          'nightcore': {
            op: 'filters',
            guildId: this.guild,
            equalizer: [],
            timescale: {
              speed: 1.3,
              pitch: 1.3
            }
          },
          'superfast': {
            op: 'filters',
            guildId: this.guild,
            equalizer: [],
            timescale: {
              speed: 1.3,
              pitch: 1.0
            }
          },
          'vaporwave': {
            op: 'filters',
            guildId: this.guild,
            timescale: {
              speed: 0.85,
              pitch: 0.90
            }
          }
        }
      }

      setFilter(filter) {
        if (!this.filters[filter]) {
          this.filter = 'none'
          return this.node.send(this.filters.noFilter)
        }
        this.filter = filter
        this.node.send(this.filters[filter])
      }

      get timescale() {
        return this.filters[this.filter].timescale?.speed ?? 1.0
      }
    })
  }
}
