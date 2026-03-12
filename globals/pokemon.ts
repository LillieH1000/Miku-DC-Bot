import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, ContainerBuilder, SectionBuilder, SeparatorBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js"
import LZString from "lz-string"

// Species Interface

interface speciesData {
    base_happiness?: number
    capture_rate?: number
    is_baby: boolean
    is_legendary: boolean
    is_mythical: boolean
    varieties: [{
        is_default: boolean
        pokemon: {
            name: string
            url: string
        }
    }]
}

// Pokemon Interface

interface pokemonData {
    abilities: [{
        ability: {
            name: string
        }
        is_hidden: boolean
    }]
    base_experience: number
    height: number
    id: number
    name: string
    species: {
        url: string
    }
    sprites: {
        other: {
            home: {
                front_default?: string
                front_female?: string
                front_shiny?: string
                front_shiny_female?: string
            }
        }
    }
    stats: [{
        base_stat: number
        effort: number
        stat: {
            name: string
        }
    }]
    types: [{
        type: {
            name: string
            url: string
        }
    }]
    weight: number
}

// Types Interface

interface typesData {
    damage_relations: {
        double_damage_from?: [{
            name: string
        }]
        half_damage_from?: [{
            name: string
        }]
        no_damage_from?: [{
            name: string
        }]
    }
}

// Weakness Interface

interface weaknessType {
    normal: number,
    fire: number,
    water: number,
    electric: number,
    grass: number,
    ice: number,
    fighting: number,
    poison: number,
    ground: number,
    flying: number,
    psychic: number,
    bug: number,
    rock: number,
    ghost: number,
    dragon: number,
    dark: number,
    steel: number,
    fairy: number
}

async function request(name: string, species: string | undefined, position: number, shiny: boolean, message: string | null): Promise<ContainerBuilder | undefined> {
    // Species Request

    const res1: Response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
    let speciesData: speciesData
    if (!res1.ok) {
        const res1: Response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        if (!res1.ok) return undefined
        const pokemonData: pokemonData = await res1.json()

        const res2: Response = await fetch(pokemonData.species.url)
        if (!res2.ok) return undefined
        speciesData = await res2.json()
    } else {
        speciesData = await res1.json()
    }
    
    // Pokemon Request
    
    const speciesVariety: speciesData["varieties"][0] | undefined = speciesData.varieties.find(variety => (variety.is_default && !species) || (species == variety.pokemon.name))
    if (!speciesVariety) return undefined
    
    const res2: Response = await fetch(speciesVariety.pokemon.url)
    if (!res2.ok) return undefined
    const pokemonData: pokemonData = await res2.json()

    // Types & Weaknesses

    const weakness = {
        normal: 1,
        fire: 1,
        water: 1,
        electric: 1,
        grass: 1,
        ice: 1,
        fighting: 1,
        poison: 1,
        ground: 1,
        flying: 1,
        psychic: 1,
        bug: 1,
        rock: 1,
        ghost: 1,
        dragon: 1,
        dark: 1,
        steel: 1,
        fairy: 1
    }
    
    let typescount = 0
    let types = ""
    for (const type of pokemonData.types) {
        // Type Info
        const res1 = await fetch(type.type.url)
        const data1:typesData = await res1.json()

        if (data1.damage_relations.double_damage_from) {
            for (const double of data1.damage_relations.double_damage_from) {
                weakness[double.name as keyof weaknessType] *= 2
            }
        }
        if (data1.damage_relations.half_damage_from) {
            for (const half of data1.damage_relations.half_damage_from) {
                weakness[half.name as keyof weaknessType] *= 0.5
            }
        }
        if (data1.damage_relations.no_damage_from) {
            for (const none of data1.damage_relations.no_damage_from) {
                weakness[none.name as keyof weaknessType] = 0
            }
        }

        // Type Name
        types += type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
        typescount += 1
        if (pokemonData.types.length != typescount) {
            types += ", "
        }
    }

    let weaknessescount = 0
    let weaknesses = ""
    for (const weaknessobject in weakness) {
        weaknesses += `${weaknessobject.charAt(0).toUpperCase()}${weaknessobject.slice(1)}: ${weakness[weaknessobject as keyof weaknessType]}x`
        weaknessescount += 1
        if (Object.keys(weakness).length != weaknessescount) {
            weaknesses += "\n"
        }
    }

    // Abilities

    let abilitiescount = 0
    let abilities = ""
    for (const ability of pokemonData.abilities) {
        abilities += ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)
        if (ability.is_hidden == true) {
            abilities += " (Hidden)"
        }
        abilitiescount += 1
        if (pokemonData.abilities.length != abilitiescount) {
            abilities += ", "
        }
    }
    
    // Stats

    let basestatscount = 0
    let basestats = ""
    for (const basestat of pokemonData.stats) {
        basestats += basestat.stat.name.charAt(0).toUpperCase() + basestat.stat.name.slice(1) + ": " + basestat.base_stat.toString()
        basestatscount += 1
        if (pokemonData.stats.length != basestatscount) {
            basestats += "\n"
        }
    }

    // Container

    const container = new ContainerBuilder()
        .setAccentColor(+Deno.env.get("ACCENT")!)

    const section = new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(bold(pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1))),
        )

    if (pokemonData.sprites.other.home.front_default == undefined) return
    
    if (!shiny) {
        section.setThumbnailAccessory(
            new ThumbnailBuilder()
                .setURL(pokemonData.sprites.other.home.front_default)
        )
    }
    if (shiny) {
        section.setThumbnailAccessory(
            new ThumbnailBuilder()
                .setURL(pokemonData.sprites.other.home.front_shiny!)
        )
    }

    container.addSectionComponents(section)

    container.addSeparatorComponents(
		new SeparatorBuilder()
	)

    if (position == 1) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`Pokedex ID: ${pokemonData.id}`),
            new TextDisplayBuilder()
                .setContent(`Types: ${types}`),
            new TextDisplayBuilder()
                .setContent(`Abilities: ${abilities}`)
        )
        if (message) {
            container.addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent("Game And Count"),
                new TextDisplayBuilder()
                    .setContent(message)
            )
        }
    }
    if (position == 2) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`Capture Rate (Max 255): ${speciesData.capture_rate}`),
            new TextDisplayBuilder()
                .setContent(`Base Experience: ${pokemonData.base_experience}`),
            new TextDisplayBuilder()
                .setContent("Base Stats"),
            new TextDisplayBuilder()
                .setContent(basestats)
        )
    }
    if (position == 3) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent("Weaknesses"),
            new TextDisplayBuilder()
                .setContent(weaknesses)
        )
    }

    container.addSeparatorComponents(
		new SeparatorBuilder()
	)

    // Components Row

    let id1 = 0
    let id2 = 0
    if (position == 1) {
        id1 = 1
        id2 = 2
    }
    if (position == 2) {
        id1 = 1
        id2 = 3
    }
    if (position == 3) {
        id1 = 2
        id2 = 3
    }

    const row1 = new ActionRowBuilder<StringSelectMenuBuilder>()

    // Varities Menu

    const varieties = new StringSelectMenuBuilder()
        .setPlaceholder("Select The Pokemon Species")
        .setCustomId(LZString.compressToUTF16(JSON.stringify({
            name: name,
            species: species,
            position: position,
            shiny: shiny,
            message: message
        })))

    for (const variety of speciesData.varieties) {
        varieties.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(variety.pokemon.name.charAt(0).toUpperCase() + variety.pokemon.name.slice(1))
                .setValue(variety.pokemon.name)
        )
    }

    container.addActionRowComponents(row1.addComponents(varieties))

    // Page Buttons

    const row2 = new ActionRowBuilder<ButtonBuilder>()

    if (position > 1) {
        row2.addComponents(
            new ButtonBuilder()
                .setLabel("<-")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(LZString.compressToUTF16(JSON.stringify({
                    name: name,
                    species: species,
                    position: id1,
                    shiny: shiny,
                    message: message
                })))
        )
    }
    if (position < 3) {
        row2.addComponents(
            new ButtonBuilder()
                .setLabel("->")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(LZString.compressToUTF16(JSON.stringify({
                    name: name,
                    species: species,
                    position: id2,
                    shiny: shiny,
                    message: message
                })))
        )
    }

    // Shiny Buttons

    if (!shiny) {
        row2.addComponents(
            new ButtonBuilder()
                .setLabel("Show Shiny")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(LZString.compressToUTF16(JSON.stringify({
                    name: name,
                    species: species,
                    position: position,
                    shiny: true,
                    message: message
                })))
        )
    }
    if (shiny) {
        row2.addComponents(
            new ButtonBuilder()
                .setLabel("Hide Shiny")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(LZString.compressToUTF16(JSON.stringify({
                    name: name,
                    species: species,
                    position: position,
                    shiny: false,
                    message: message
                })))
        )
    }

    container.addActionRowComponents(row2)

    // Return
    
    return container
}

// Exports

export default {
    request
}