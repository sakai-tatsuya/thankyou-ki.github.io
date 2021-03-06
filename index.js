window.onerror = () => alert('パスフレーズが間違ってます')

let r = new Random((new Date()).getTime())
const RSAK = cryptico.generateRSAKey(location.search.replace(/^\?/, ''), 1024)
for(var k = messages.length - 1; k > 0; k--){
    var j = r.nextInt(0, k);
    var tmp = messages[k];
    messages[k] = messages[j];
    messages[j] = tmp;
}
let data = {"messages" : []}
let i = 0
let width = 200;
let zIndex = 0;
let desktop = () => document.querySelector('#app2');
let areasX = 8;
let areasY = 10;
function add() {
    if(i < messages.length){
        let message = messages[i].hasOwnProperty("message") ? messages[i]["message"] : messages[i]
        let style = messages[i].hasOwnProperty("style") ? messages[i]["style"] : {}
        let left = r.nextInt(0, 50) + Math.floor(desktop().clientWidth / areasX * r.nextInt(0, areasX - 3));
        let top = r.nextInt(0, 50) + Math.floor(desktop().clientHeight / areasY * r.nextInt(0, areasY - 2));
        let decrypted = decode(cryptico.decrypt(message, RSAK).plaintext)
        setTimeout(function(){
            data.messages.push({
                "message" : decrypted, 
                "left": left,
                "top": top,
                "style" : Object.assign({
                    "width": Math.max.apply(null, decrypted.split("\n").filter(b => b).map(b => b.split('').map(c => c.charCodeAt() < 256 ? 1 : 2).reduce((e,f)=>e+f))) / 2 + 5 + 'em',
                    "left": left + "px",
                    "top": top + "px",
                    "z-index": ++zIndex
                }, style)
            })
            add()
        }, r.nextInt(1000 * i, 6000))
    }
    i++
}
add()
let app2 = new Vue({
    el: '#app2',
    data: data,
    methods: {
        mousedown(message, event) {
            event.preventDefault()
            if(!this.drag) {
                this.drag = true
                this.message = message
                this.event = event
                message.style["z-index"] = ++zIndex
            }
        },
        mousemove(message, event) {
            event.preventDefault()
            if(this.drag) {
                this.message["left"] -= getEvent(this.event).clientX - getEvent(event).clientX
                this.message["top"] -= getEvent(this.event).clientY - getEvent(event).clientY
                this.message.style["left"] = this.message["left"] + "px"
                this.message.style["top"] = this.message["top"] + "px"
                this.event = event
            }
        },
        mouseup(message, event) {
            event.preventDefault()
            this.drag = false
        }                   
    }
})
window.onerror = (e) => console.log(e)

function getEvent(event) {
    return event.touches ? event.touches[0] : event
}
