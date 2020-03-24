function sound(options, ...sources) {
    this.play = function() {
        let element = document.createElement("audio")
        let {volume=1} = options
        element.volume = volume
        for(let source of sources) {
            let child = document.createElement("source")
            child.src = source.src
            child.type = source.type
            element.appendChild(child)
        }
        this.element = element
        element.play()
    }
}
let shoot = new sound(
    {},
    {
        src : "Shoot3.ogg",
        type : "audio/ogg"
    }
)
let explode = new sound(
    {
        volume : 0.75
    },
    {
        src : "Explode.ogg",
        type : "audio/ogg"
    }
)
let started = false