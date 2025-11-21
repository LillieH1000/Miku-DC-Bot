import deno from "./deno.json" with { type: "json" }
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ColorResolvable, ContainerBuilder, SectionBuilder, SeparatorBuilder, TextDisplayBuilder, ThumbnailBuilder } from "discord.js"
import { AudioPlayer, AudioResource } from "@discordjs/voice"
import LZString from "lz-string"

// Default Colours

const colours = {
    "embed": "#FFC0DD" as ColorResolvable
}

// Player Objects

interface playerObject {
    [key: string]: {
        status: number
        ids: string[]
        player: AudioPlayer
        volume: number
        resource?: AudioResource
    }
}

const player:playerObject = {}

// Pokemon Utils

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
        url?: string
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

interface speciesData {
    base_happiness?: number
    capture_rate?: number
    is_baby: boolean
    is_legendary: boolean
    is_mythical: boolean
    varieties: [{
        pokemon: {
            name: string
            url: string
        }
    }]
}

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

interface pokeapiWeaknessType {
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

async function pokeapiRequest(name: string, position: number, mega: boolean, gmax: boolean, shiny: boolean, guild: boolean, guildid: string, message: string | null): Promise<ContainerBuilder | undefined> {
    let data: pokemonData
    
    // Pokemon Request
    const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!res1.ok) {
        return undefined
    }
    data = await res1.json()
    const origname = data.name

    // Species Request
    const res2 = await fetch(data.species.url!)
    if (!res2.ok) {
        return undefined
    }
    const speciesData: speciesData = await res2.json()

    // Mega Check

    let hasmega = false
    let megaurl = ""
    speciesData.varieties.forEach(variety => {
        if (variety.pokemon.name.endsWith("-mega")) {
            hasmega = true
            megaurl = variety.pokemon.url
        }
    })

    if (hasmega && mega) {
        const res1 = await fetch(megaurl)
        if (!res1.ok) {
            return undefined
        }
        data = await res1.json()
    }

    // Gmax Check

    let hasgmax = false
    let gmaxurl = ""
    speciesData.varieties.forEach(variety => {
        if (variety.pokemon.name.endsWith("-gmax")) {
            hasgmax = true
            gmaxurl = variety.pokemon.url
        }
    })

    if (hasgmax && gmax) {
        const res1 = await fetch(gmaxurl)
        if (!res1.ok) {
            return undefined
        }
        data = await res1.json()
    }

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
    for (const type of data.types) {
        // Type Info
        const res1 = await fetch(type.type.url)
        const data1:typesData = await res1.json()

        if (data1.damage_relations.double_damage_from) {
            for (const double of data1.damage_relations.double_damage_from) {
                weakness[double.name as keyof pokeapiWeaknessType] *= 2
            }
        }
        if (data1.damage_relations.half_damage_from) {
            for (const half of data1.damage_relations.half_damage_from) {
                weakness[half.name as keyof pokeapiWeaknessType] *= 0.5
            }
        }
        if (data1.damage_relations.no_damage_from) {
            for (const none of data1.damage_relations.no_damage_from) {
                weakness[none.name as keyof pokeapiWeaknessType] = 0
            }
        }

        // Type Name
        types += type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
        typescount += 1
        if (data.types.length != typescount) {
            types += ", "
        }
    }

    let weaknessescount = 0
    let weaknesses = ""
    for (const weaknessobject in weakness) {
        weaknesses += `${weaknessobject.charAt(0).toUpperCase()}${weaknessobject.slice(1)}: ${weakness[weaknessobject as keyof pokeapiWeaknessType]}x`
        weaknessescount += 1
        if (Object.keys(weakness).length != weaknessescount) {
            weaknesses += "\n"
        }
    }

    // Abilities

    let abilitiescount = 0
    let abilities = ""
    for (const ability of data.abilities) {
        abilities += ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)
        if (ability.is_hidden == true) {
            abilities += " (Hidden)"
        }
        abilitiescount += 1
        if (data.abilities.length != abilitiescount) {
            abilities += ", "
        }
    }
    
    // Stats

    let basestatscount = 0
    let basestats = ""
    for (const basestat of data.stats) {
        basestats += basestat.stat.name.charAt(0).toUpperCase() + basestat.stat.name.slice(1) + ": " + basestat.base_stat.toString()
        basestatscount += 1
        if (data.stats.length != basestatscount) {
            basestats += "\n"
        }
    }

    // Container

    const container = new ContainerBuilder()
        .setAccentColor(+deno.keys.accent)

    const section = new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(data.name.charAt(0).toUpperCase() + data.name.slice(1)),
        )

    if (data.sprites.other.home.front_default == undefined) {
        return
    }
    
    if (!shiny) {
        section.setThumbnailAccessory(
            new ThumbnailBuilder()
                .setURL(data.sprites.other.home.front_default)
        )
    }
    if (shiny) {
        section.setThumbnailAccessory(
            new ThumbnailBuilder()
                .setURL(data.sprites.other.home.front_shiny!)
        )
    }

    container.addSectionComponents(section)

    container.addSeparatorComponents(
		new SeparatorBuilder()
	)

    if (position == 1) {
        container.addTextDisplayComponents(
            new TextDisplayBuilder()
                .setContent(`Pokedex ID: ${data.id}`),
            new TextDisplayBuilder()
                .setContent(`Types: ${types}`),
            new TextDisplayBuilder()
                .setContent(`Abilities: ${abilities}`)
        )
        if (guild && guildid == "416350699794857986" && message) {
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
                .setContent(`Base Experience: ${data.base_experience}`),
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

    const row = new ActionRowBuilder<ButtonBuilder>()

    // Page Buttons

    if (position > 1) {
        row.addComponents(
            new ButtonBuilder()
                .setLabel("<-")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(LZString.compressToUTF16(JSON.stringify({
                    name: origname,
                    position: id1,
                    mega: mega,
                    gmax: gmax,
                    shiny: shiny,
                    message: message
                })))
        )
    }
    if (position < 3) {
        row.addComponents(
            new ButtonBuilder()
                .setLabel("->")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(LZString.compressToUTF16(JSON.stringify({
                    name: origname,
                    position: id2,
                    mega: mega,
                    gmax: gmax,
                    shiny: shiny,
                    message: message
                })))
        )
    }

    // Mega Buttons

    if (hasmega) {
        if (!mega) {
            row.addComponents(
                new ButtonBuilder()
                    .setLabel("Mega Evolve")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(LZString.compressToUTF16(JSON.stringify({
                        name: origname,
                        position: position,
                        mega: true,
                        gmax: false,
                        shiny: shiny,
                        message: message
                    })))
            )
        } else {
            row.addComponents(
                new ButtonBuilder()
                    .setLabel("Un-Mega Evolve")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(LZString.compressToUTF16(JSON.stringify({
                        name: origname,
                        position: position,
                        mega: false,
                        gmax: false,
                        shiny: shiny,
                        message: message
                    })))
            )
        }
    }

    // Gmax Buttons

    if (hasgmax) {
        if (!gmax) {
            row.addComponents(
                new ButtonBuilder()
                    .setLabel("Gigantamax")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(LZString.compressToUTF16(JSON.stringify({
                        name: origname,
                        position: position,
                        mega: false,
                        gmax: true,
                        shiny: shiny,
                        message: message
                    })))
            )
        } else {
            row.addComponents(
                new ButtonBuilder()
                    .setLabel("Un-Gigantamax")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId(LZString.compressToUTF16(JSON.stringify({
                        name: origname,
                        position: position,
                        mega: false,
                        gmax: false,
                        shiny: shiny,
                        message: message
                    })))
            )
        }
    }

    // Shiny Buttons

    if (!shiny) {
        row.addComponents(
            new ButtonBuilder()
                .setLabel("Show Shiny")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(LZString.compressToUTF16(JSON.stringify({
                    name: origname,
                    position: position,
                    mega: mega,
                    gmax: gmax,
                    shiny: true,
                    message: message
                })))
        )
    }
    if (shiny) {
        row.addComponents(
            new ButtonBuilder()
                .setLabel("Hide Shiny")
                .setStyle(ButtonStyle.Secondary)
                .setCustomId(LZString.compressToUTF16(JSON.stringify({
                    name: origname,
                    position: position,
                    mega: mega,
                    gmax: gmax,
                    shiny: false,
                    message: message
                })))
        )
    }

    container.addActionRowComponents(row)

    // Return
    
    return container
}

// yt-dlp Returns

interface ytdlpData {
    entries?: [{
        id: string
        title: string
        uploader: string
        thumbnail: string
        url: string
    }],
    id: string
    title: string
    uploader: string
    thumbnail: string
    url: string
}

interface retData {
    id: string
    title: string
    author: string
    artwork: string
    url: string
}

async function ytdlpRequest(url: string, id: string, query: string): Promise<retData | undefined> {
    let arg = ""
    if (url != "null") {
        arg = url
    }
    if (id != "null") {
        arg = `https://api.soundcloud.com/tracks/${id}`
    }
    if (query != "null") {
        arg = `scsearch:${query}`
    }

    const command = new Deno.Command("yt-dlp", {
        args: ["-J", "-f", "bestaudio[ext=mp3]", "--no-cache-dir", "--no-download", "--no-playlist", arg],
        stdout: "piped"
    })

    const process: Deno.ChildProcess = command.spawn()
    const json: ytdlpData = await process.stdout.json()

    let data: ytdlpData
    if (json.entries) {
        data = json.entries[0]
    } else {
        data = json
    }

    return {
        id: data.id,
        title: data.title,
        author: data.uploader,
        artwork: data.thumbnail,
        url: data.url
    }
}

// Exports

export default {
    colours,
    player,
    pokeapiRequest,
    ytdlpRequest
}